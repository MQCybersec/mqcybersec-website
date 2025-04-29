---
title: "basic-mod1"
description: "We found this weird message being passed around on the servers, we think we have a working decryption scheme. Download the message here. Take each number mod 37 and map it to the following character set: 0-25 is the alphabet (uppercase), 26-35 are the decimal digits, and 36 is an underscore. Wrap your decrypted message in the picoCTF flag format (i.e. picoCTF{decrypted_message})"
pubDate: 2025-04-29
category: "cryptography"
author: "tulip"
section: "PicoCTF"
tags: ["medium"]
---

This challenge serves as an introduction to modular arithmetic. As such, the writeup should as well. Let's check the file.
```
165 248 94 346 299 73 198 221 313 137 205 87 336 110 186 69 223 213 216 216 177 138 
```

The description says to take each number mod $37$. If you have not encountered the mod/modulo function before, a simple way to describe it is the **remainder**. For example, the remainder of $5$ divided by $2$ is $1$. Mathematically, it is written:
\\[ 5 \equiv 1 \pmod 2 \\]
...which is read as "$5$ is congruent to $1$ mod $2$". When there are brackets around the word mod, it means the modulo operation applies to the entire congruence. We say congruent, because $5$ is not *equal* to $1$, but $5$ and $1$ behave the same under the operation mod $2$. 

You may have also used the modulo operator in programming, symbolised by `%`, e.g. `7 % 3` is $7\mod 3$. So let's take all these numbers mod $37$.
\\[ 165 \equiv 17 \pmod {37} \\]
\\[ 248 \equiv 26 \pmod {37} \\]
\\[ 94 \equiv 20 \pmod {37} \\]
\\[ \vdots \\]

And so on, you get the idea. Now it wants us to map this to a character set which is the uppercase alphabet, followed by numbers (starting from 0) and then an underscore at the end, starting from 0. So index 0 of the character set goes to A, 1 goes to B, etc.

```
17 : R
26 : 0
20 : U
13 : N
3  : D
36 : _
13 : N
36 : _
17 : R
26 : 0
20 : U
13 : N
3  : D
36 : _
1  : B
32 : 6
1  : B
28 : 2
31 : 5
31 : 5
29 : 3
27 : 1 
```
Flag: `picoCTF{R0UND_N_R0UND_B6B25531}`