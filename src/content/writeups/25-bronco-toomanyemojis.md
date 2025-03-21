---
title: "Too Many Emojis"
description: "I like using emojis in my text messages, but my friend may have taken it too far. 💀 Can you figure out what she’s trying to tell me? 🤔"
pubDate: 2025-03-19
ctf: "Bronco CTF 2025"
category: "cryptography"
author: "Ch1maera"
section: "CTFs"
image: "images/25-bronco/icon.png"

---

## Too Many Emojis

To start, we are provided with the following image: 

![image of too many emojis challenge](images/25-bronco/toomanyemojis.png)

From this image, we can see that we are provided with the flag format. By crosschecking the flag format `bronco{}` and the first group of emojis, we can see that the first letter of each emoji is used to make the flag! So:

|Emoji   |Emoji Name|Letter Taken|
|---------|----------|------------|
|💔   |Broken Heart  | `b`     |
|😌   |Relieved Face | `r`     |
|👹   |Ogre          | `o`     |
|🤢   |Nauseated Face | `n`    |
|😖   |Confounded Face | `c`   |
|👹   |Ogre          | `o`     |

With that, we can get the flag!

Flag: `bronco{emojis_express_my_emotions}`