---
title: "Easy Diffy"
description: "I managed to generate strong parameters for our diffie-hellman key exchange, i think my message is now safe." 
pubDate: 2025-03-04
ctf: "PwnMe CTF Quals"
category: "cryptography"
author: "tulip"
section: "CTFs"
---

The challenge gives us a simple script and output parameters.

```py
from Crypto.Util.number import getPrime, long_to_bytes
from Crypto.Util.Padding import pad, unpad
from Crypto.Cipher import AES
from hashlib import sha256

import os

# generating strong parameters

flag = b"REDACTED" 

p = getPrime(1536)
g = p-1

a = getPrime(1536)
b = getPrime(1536)

A = pow(g, a, p)
B = pow(g, b, p)

assert pow(A, b, p) == pow(B, a, p)

C = pow(B, a, p)

# Encrypting my message

key = long_to_bytes(C)
key = sha256(key).digest()[:16]

cipher = AES.new(key, AES.MODE_ECB)
ciphertext = cipher.encrypt(pad(flag, AES.block_size))

print(f"{p = }")
print(f"{g = }")
print("ciphertext =", ciphertext.hex())
```

We can see the key is produced by the expression $g^a\mod{p}$, where $g = p-1$. Let's try and find if this has a special property. First, expand the binomial:
\\[g^a = (p-1)^a = (-1)^a + {n \choose k}(-1)^{a-1}p + {n \choose k}(-1)^{a-2}p^2+\ldots+p^a\\]
(The values for ${n \choose k}$ are not necessary, you'll see why here.)

However, we are expanding this expression $\pmod{p}$. So all terms with a $p^n$ in it will reduce to $0$, as they are divisible by $p$.
\\[g^a \equiv (-1)^a \pmod{p}\\]

We also know $a$ is odd, since it is prime. So we get the following result:
\\[g^a \equiv -1 \pmod{p} \leftrightharpoons g^a \equiv p-1 \pmod{p}\\]

Therefore for any odd index $a$, $(p-1)^a \equiv p-1 \pmod{p}$. Note that we have only tried this when $p$ is prime, so this is not a general rule yet. But it will work for our case.

In the `output.txt`, we are given the following parameters.
```
p = 1740527743356518530873219004517954317742405916450945010211514630307030225825627940655848700898186119703288416676610512180281414181211686282526701502342109420226095690170506537523420657033019751819646839624557146950127906808859045989204720555752289247833349649020285507405445896768256093961814925065500513967524214087124440421275882981975756344900858314408284866222751684730112931487043308502610244878601557822285922054548064505819094588752116864763643689272130951
g = 1740527743356518530873219004517954317742405916450945010211514630307030225825627940655848700898186119703288416676610512180281414181211686282526701502342109420226095690170506537523420657033019751819646839624557146950127906808859045989204720555752289247833349649020285507405445896768256093961814925065500513967524214087124440421275882981975756344900858314408284866222751684730112931487043308502610244878601557822285922054548064505819094588752116864763643689272130950
ciphertext = f2803af955eebc0b24cf872f3c9e3c1fdd072c6da1202fe3c7250fd1058c0bc810b052cf99ebfe424ce82dc31a3ba94f
```
In the script, the "key" is generated via $B^a\mod{p}$, where $B\equiv g^b\pmod{p}$. $b$ is also prime, so $B$ will be equal to $p-1$, and thus $B^a\mod{p}$ will also equal to $p-1$. So we can just use the value of $p-1$ for our key. 

Let's make a script to decrypt using the key.
```py
from Crypto.Util.number import long_to_bytes
from hashlib import sha256
from Crypto.Cipher import AES

g = 1740527743356518530873219004517954317742405916450945010211514630307030225825627940655848700898186119703288416676610512180281414181211686282526701502342109420226095690170506537523420657033019751819646839624557146950127906808859045989204720555752289247833349649020285507405445896768256093961814925065500513967524214087124440421275882981975756344900858314408284866222751684730112931487043308502610244878601557822285922054548064505819094588752116864763643689272130950
ciphertext = "f2803af955eebc0b24cf872f3c9e3c1fdd072c6da1202fe3c7250fd1058c0bc810b052cf99ebfe424ce82dc31a3ba94f"
ct_bytes = bytes.fromhex(ciphertext)

key = long_to_bytes(g)
key = sha256(key).digest()[:16]

cipher = AES.new(key, AES.MODE_ECB)

d = cipher.decrypt(ct_bytes)
print(d)
```

Running this script, we get the flag.

Flag: `PWNME{411_my_h0m13s_h4t35_sm411_Gs}`
