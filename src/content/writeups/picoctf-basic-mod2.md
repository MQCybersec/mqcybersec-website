---
title: "basic-mod2"
description: "A new modular challenge! Download the message here. Take each number mod 41 and find the modular inverse for the result. Then map to the following character set: 1-26 are the alphabet, 27-36 are the decimal digits, and 37 is an underscore. Wrap your decrypted message in the picoCTF flag format (i.e. picoCTF{decrypted_message})"
pubDate: 2025-04-29
category: "cryptography"
author: "tulip"
section: "PicoCTF"
tags: ["medium"]
---

**Note**: If you have never encountered modular arithmetic, [the first challenge writeup](/writeups/picoctf-basic-mod1) is recommended. 

A bit of a step up! This one is asking us to calculate the modular inverse of each number mod 41. A modular inverse (often denoted $s^{-1}$) in maths is a number such that:
\\[ s\cdot s^{-1} \equiv 1 \pmod {n} \\]

..for some modulus $n$. So how do we find such a number? Again, as this is a more introductory challenge, the writeup will be likewise.

### Extended euclidean algorithm
The euclidean algorithm is a way to find the GCD (greatest common divisor) of two numbers. Now, this is an important fact to know, the modular inverse of a number $s$ mod $n$ only exists **if and only if** $s$ and $n$ are coprime, meaning $s$ and $n$ don't share any factors other than 1. To test this, you can say that $s$ and $n$ are coprime if $\gcd(s,n) = 1$. 

The euclidean GCD algorithm functions leverages the identity:
\\[ \gcd(s, n) = \gcd(n, s \mod n) \\]

For example:
\\[ \gcd(11, 3): 11 = 3\times3 + 2\\]
\\[ \gcd(3, 2): 3 = 2\times1 + 1\\]
\\[ \gcd(2, 1): 2 = 1\times2 + 0\\]

...and when $s \mod n = 0$, stop. The last value of $n$ is the GCD. So in this case, $\gcd(11,3) = 1$. But now, we want to find the integer $s^{-1}$ such that $s \cdot s^{-1} \equiv 1 \pmod{11}$. Now, note that, this is the same as finding an integer such that:
\\[ s \cdot s^{-1} = 1 + kn \\]
...where $k$ is some integer. This is the true meaning of "modulo", you are saying that the number can be written as a remainder plus a multiple of $n$. 

This is more commonly seen in the form of **Bezout's identity**, stating that for coprime integers $x$ and $y$, there exists integers $a$ and $b$ such that:
\\[ ax + by = 1 \\]

To find this integer, we work backwards. This is called the **extended euclidean algorithm**. From the second last step,
\\[ 1 = 3 - 2 \times 1 \\]

But we can say that $2 = 11 - 3 \times 3$. So,
\\[ 1 = 3 - (11-3\times3) = 3 + 3\times3 - 11 = 4\times3 - 11 \\]

So now we can say, 
\\[ 3\times 4 \equiv 1 \pmod {11} \\]

So $4$ is the modular inverse of $3$ mod $11$! This is how to do it by hand, but in the world of cryptography, we need automation. So in python, you can use `pow(s, -1, n)` to find the modular inverse of $s$ and $n$.

```py
ints = "432 331 192 108 180 50 231 188 105 51 364 168 344 195 297 342 292 198 448 62 236 342 63".split()
modulos = []

# Convert to a list of integers
for s in ints:
    modulos.append(int(s))

inverses = []

# Take the inverse of each integer mod 41
for s in modulos:
    inverses.append(pow(s, -1, 41))

CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_"

for i in inverses:
    # This character set started at 1
    print(CHARSET[i-1], end="")
```
```
$ python inverses.py
1NV3R53LY_H4RD_C680BDC1
```

Flag: `picoCTF{1NV3R53LY_H4RD_C680BDC1}`
