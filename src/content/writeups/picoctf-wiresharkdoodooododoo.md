---
title: "Wireshark doo dooo do doo..."
description: "Can you find the flag? shark1.pcapng."
pubDate: 2025-04-03
category: "forensics"
author: "Tenzin"
section: "PicoCTF"
tags: ["medium"]
---
With the shark1.pcapng provided within the [picoCTF site](https://play.picoctf.org/practice/challenge/115?page=1&search=wireshar), the pcap is opened within wireshark. The packet list displays a large number of intercepted traffics, which can be seen below. 
![WiresharkDoDoo_1](images/picoctf/wiresharkdoodooododoo/Wiresharkdodoo.png)
The traffic contains a large number of HTTP packets. After applying a filter using HTTP, the number of packets is reduced by 70%.

Reviewing the list of packets, packet 827 and packet 964 appear to be the only two responses received for the two prior GET requests. Examining the decoded hex of packet 827, the ASCII (human-readable) section contains the following text:
```
;hLAEr@$~%&hP]gD)[PHTTP/1.1 200 OK
Date: Mon, 10 Aug 2020 01:51:45 GMT
Server: Apache/2.4.29 (Ubuntu)
Last-Modified: Fri, 07 Aug 2020 00:45:02 GMT
ETag: "2f-5ac3eea4fcf01"
Accept-Ranges: bytes
Content-Length: 47
Keep-Alive: timeout=5, max=100
Connection: Keep-Alive
Content-Type: text/html

Gur synt vf cvpbPGS{c33xno00_1_f33_h_qrnqorrs}
```
The last line particularly stands out with its flag format replication, which after using a [ROT13 decoder](https://rot13.com/), provides the flag.
`The flag is picoCTF{p33kab00_1_s33_u_deadbeef}`