---
title: "rsa-oracle"
description: "An attacker was able to intercept communications between a bank and a fintech company. They managed to get the message (ciphertext) and the password that was used to encrypt the message."
pubDate: 2025-04-29
category: "cryptography"
author: "tulip"
section: "PicoCTF"
tags: ["medium"]
---

**Note**: The message can be decrypted with `openssl enc -aes-256-cbc -d -in <infile>`.

As always, let's see what's happening on the server.

```
*****************************************
****************THE ORACLE***************
*****************************************
what should we do for you?
E --> encrypt D --> decrypt.
D
Enter text to decrypt: 4228273471152570993857755209040611143227336245190875847649142807501848960847851973658239485570030833999780269457000091948785164374915942471027917017922546
Lol, good try, can't decrypt that for you. Be creative and good luck
```

Okay, so we have an encryption-decryption oracle. And judging by how the "ciphertext" is an integer, it's very likely to be RSA. Just to clear up our task, we have an AES encrypted message in `secret.enc`, and the encrypted password is given to us. 

So really, all we're given is just $c$, the ciphertext. So we have to take some guesses.

The most common public exponent used in RSA is $e = 65537$. Let's assume they are using this as well. We also don't have $n$, so let's get to work on recovering that.

### Recovering the modulus

For a given message, the server computes:
\\[ c \equiv m^e\pmod n \\]

This means that $m^e$ can be written as $c + kn$, where $k$ is some unknown integer. This means $m^e - c = kn$, or:
\\[ m^e - c \equiv 0 \pmod n \\]

This is powerful, because it means we can compute several values of $m^e - c$ for known values of $m$, and take the GCD to compute $n$. Let's implement this.
```py
from pwn import *
from gmpy2 import mpz, gcd
from functools import reduce

HOST = "titan.picoctf.net"
PORT = 50466

server = remote(HOST, PORT)

context.log_level = "debug"
C = []

for i in range(48, 58):
    server.recvuntil(b'E --> encrypt D --> decrypt. \n')
    server.sendline(b'E')
    server.recvuntil(b'enter text to encrypt (encoded length must be less than keysize): ')
    server.sendline(chr(i).encode())
    trashcan = [server.recvline() for i in range(4)]
    c = int(server.recvline().decode().strip().split()[-1])
    C.append(c)

# "zeroes" because these are 0 mod n
zeroes = []
e = 0x10001

for i in range(10):
    zeroes.append(mpz((i+48)**e - C[i]))

# Apply gcd() to each pair in zeroes
n = reduce(gcd, zeroes)
print(f"{n = }")
```
Note that $(i+48)^{65537}$ is an absolutely massive number. We need to use `gmpy2`'s `mpz` datatype to store this. But despite that, let's try this.

```
$ python pwner.py

... lines ...

n = 5507598452356422225755194020880876452588463543445995226287547479009566151786764261801368190219042978883834809435145954028371516656752643743433517325277971
```

Nice! So we have the modulus. Now, onto an interesting property of RSA.

RSA encryption is defined as:
\\[ c \equiv m^e \pmod n \\]

And decryption as:
\\[ c^d \equiv m \pmod n \\]

But let's say we want to multiply some random integer $k$ to the message $m$.
\\[ c_2 \equiv (km_1)^e \equiv k^em_1^e \equiv k^e c_1 \pmod n \\] 

However, **even more** interestingly,
\\[ c_2^d \equiv ((km_1)^e)^d \equiv k^{ed}m_1^{ed} \equiv km_1 \pmod n \\]

This is known as the **homomorphic property** of RSA encryption. More generally, if $\mathcal R$ represents the RSA encryption function, then:
\\[ \mathcal R(m_1m_2) \equiv \mathcal R(m_1) \cdot \mathcal R(m_2) \pmod n\\]

This is dangerous, because now that we have $e$ and $n$, we can manipulate the ciphertext as such:
\\[ c_2 \equiv 2^ec_1 \equiv (2m_1)^e \pmod n \\]

And if we send this to the server to decrypt, the output will be as follows:
\\[ c_2^d \equiv ((2m_1)^e)^d \equiv 2m_1\pmod n \\]

$m$ can be directly computed from this output! The server won't deny this, because we didn't send it $c$ exactly either. So we can use this! We just need to forge a ciphertext as such, using a multiplier of $2$.
```py
ct = 4228273471152570993857755209040611143227336245190875847649142807501848960847851973658239485570030833999780269457000091948785164374915942471027917017922546
cprime = ct * pow(2, e, n) % n

server.recvuntil(b'E --> encrypt D --> decrypt. \n')
server.sendline(b'D')
server.recvuntil(b'Enter text to decrypt: ')
server.sendline(str(cprime).encode())
ct2 = int(server.recvline().decode().strip().split()[-1], 16)

print(bytes.fromhex(format(ct2//2, "x")))
```
Check the output!
```
b'da099'
```
So the encryption password was `da099`! Let's put this into `openssl`.

```
$ openssl enc -aes-256-cbc -d -in secret.enc
enter aes-256-cbc decryption password:
*** WARNING : deprecated key derivation used.
Using -iter or -pbkdf2 would be better.
picoCTF{su((3ss_(r@ck1ng_r3@_da099d93}
```

Flag: `picoCTF{su((3ss_(r@ck1ng_r3@_da099d93}`