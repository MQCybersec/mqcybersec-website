---
title: "Lost Frequencies"
description: "Zeroes, ones, dots and dashes  
 Data streams in bright flashes
 `111 0000 10 111 1000 00 10 01 010 1011 11 111 010 000 0"
pubDate: 2025-03-27
ctf: "KashiCTF 2025"
category: "cryptography"
author: "Tenzin"
section: "CTFs"
image: "images/25-kashi/icon.png"
---

The description points out dots and dashes, which brings up morse code right away. Searching up `conversion of zeroes and one to Morse code` provided the Quora result, showcasing one of the comment answering `the beep are 1’s the not beeps are 0’s.`
Converting each zeroes to dots, and ones to dash provides the following:
```
--- .... -. --- -... .. -. .- .-. -.-- -- --- .-. ... .
```
Converting from Morse to text results in `OHNOBINARYMORSE`. Since the flag requires encasing, the text is encased within KashiCTF{}, ultimately capturing the flag.
`KashiCTF{OHNOBINARYMORSE}`