---
title: "Baby RSA 1"
description: "You think your Algebra skills are pretty good huh? Well let's test it out."
pubDate: 2025-04-22
ctf: "DawgCTF"
category: "cryptography"
author: "HulkOperator"
image: "./images/25-dawg/icon.png"
section: "CTFs"
---

## RSA Background

RSA is a public-key cryptosystem that relies on the difficulty of factoring large numbers. It uses two keys: the public key for encryption and the private key for decryption. 
Firstly, two large primes, `p` and `q`, are generated, and `N` is calculated as $N = p*q$. Then, a random public exponent, `e`, is chosen; typically, this is given a value of 65537. 

The private component `d` is then calculated

$d = e^{-1} \bmod \varphi$, where $\varphi = (p-1) * (q-1)$.

Finally, a plaintext message (m) can be encrypted to ciphertext (ct) using

$ct = m ^ e \bmod N$

Similarly, the ciphertext can be decrypted by

$m = ct ^ e \bmod N$

## Solution
The challenge encrypts the flag using RSA, and we are given the values `N`, `e`, and the encrypted flag `ct`. The challenge generates four random values (a, b, c, and d), and calculates $x = a * p + b * q$ and $y = c * p + d * q$.

Without the private component (d), we cannot decrypt the ciphertext. Hence, to calculate `d`, we first need to identify the values of `p` and `q`. 

Based on the given linear equations, we can solve for `p` and `q` as we have two equations and two unknowns. 

$q = (x * c - y * a) / (b * c - d * a)$

$p = (x - b * q) / a$

Solving this, we get:
```
p = 12162334930199885688769183795689969592410185555679120917249758283834302412858357859449128842077327318557896169674210867635116014075086788310254623347673691
q = 6743157372168500256063482560637365574152487940325590507177860664787954181316130485116121883062542995102725009460890756991543596608364763570502665225651511
```

We can confirm if they are the right primes by checking if $p * q = N$, which checks out in our case.

Before decrypting the flag, we must calculate the private component `d`.

$d = e ^-1 \bmod \varphi$

Then we can decrypt the flag using 

$flag = ct ^ e \bmod N$

Flag: `DawgCTF{wh0_s41d_m4th_15_us3l3ss?}`

Following is the code to solve this challenge
```py
from Crypto.Util.number import *


N = 82012538447359821165849738352756467719053530066892750177578020351019136006996881441650616631012602654920370573185549134046659875914860421394782338722082599261391182262036434549525388081948429632803770833590739702562845306267418403878169267641023564108136843672261999376998284926318313315387819024961709097101
e = 65537
ct = 16978597269030388872549064541934623430749704732655891928833779185083334396093332647023718343748730349576361193985691953617733288330780060179716905267988202710452028943623598185277149645724247199640730959820455032298145782015884558972868277752456856802145299858618876838286795962548300080924547387662096543717

a = 149738867837230590596162146900
b = 743799113257239690478459408953
c = 351498883480247386367558572595
d = 1175770398223262147164171561358

x = 6836728736678282915469852947219518538837808913380425472016857154639492051766923345186030197640091719641785981050969319578519968972834509899732176840511342124020344870655741074618585883
y = 12203451977234755811396526665700561863946871005728263879373008871704520841041885029745864562375412192520795388389509063064717933869698154304534842876137996238014648925041725231457010083

q = (x * c - y * a) // (b * c - d * a)
p = (x - b * q) // a

if p*q != N:
    return

d = pow(e, -1, (p-1)*(q-1))
flag  = long_to_bytes(pow(ct, d, p*q)).decode()
print(flag)
```