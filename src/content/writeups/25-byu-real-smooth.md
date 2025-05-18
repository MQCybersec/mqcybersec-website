---
title: "Real Smooth"
description: "Just do the dance, that's the solve"
pubDate: 2025-05-18
ctf: "BYUCTF 2025"
category: "cryptography"
author: "tulip"
section: "CTFs"
---
Let's see what's happening on the server.
```
5d07d1e73ac3c283d40ecf30d8c6c4fbd5
caaeab929ff62a1043d2c20f8e32645ab791
1 # user input
Those aren't the words!
```
Hmmm, okay, let's see the source code.

```py
from Crypto.Cipher import ChaCha20
from Crypto.Random import get_random_bytes
from secrets import FLAG

key = get_random_bytes(32)
nonce = get_random_bytes(8)

cipher = ChaCha20.new(key=key, nonce=nonce)
print(bytes.hex(cipher.encrypt(b'Slide to the left')))
print(bytes.hex(cipher.encrypt(b'Slide to the right')))

try:
    user_in = input().rstrip('\n')
    cipher = ChaCha20.new(key=key, nonce=nonce)
    decrypted = cipher.decrypt(bytes.fromhex(user_in))
    if decrypted == b'Criss cross, criss cross':
        print("Cha cha real smooth")
        print(FLAG)
    else:
        print("Those aren't the words!")
except Exception as e:
    print("Those aren't the words!")
```

So they are giving us two ciphertexts encrypted using ChaCha20. However, one thing in this script stands out.
```py
key = get_random_bytes(32)
nonce = get_random_bytes(8)
```

These aren't refreshed *anywhere* else in the code, meaning the nonce is reused, a critical security vulnerability as it means the keystream is not refreshed for each message. This means we can gather the keystream since we have the plaintext and the ciphertext, as ChaCha20 operates by generating a keystream and XORing, e.g.

\\[ \mathrm{ciphertext} = \mathrm{plaintext} \oplus \mathrm{keystream} \\]

...and going through each character of the plaintext and keystream (no padding). So since we know both the plaintext and ciphertext, and the nonce **isn't** regenerated, the keystream stays the same. Something else is that there is a sort of internal "counter" e.g. for each character in the plaintext, the keystream generates a new character. But also notice, 

```py
try:
    user_in = input().rstrip('\n')
    cipher = ChaCha20.new(key=key, nonce=nonce)
    decrypted = cipher.decrypt(bytes.fromhex(user_in))
```

This means the key is actually being refreshed and the counter is set right back to the start, so the exact same keystreams used to generate those first two ciphertexts! So all we need to do is retrieve the keystream, and XOR it with our message. Let's make a script for this.

```py
from pwn import *

HOST = "smooth.chal.cyberjousting.com"
PORT = 1350

context.log_level = "debug"

# Known plaintexts
kp1 = b'Slide to the left'
kp2 = b'Slide to the right'

server = remote(HOST, PORT)

# Known ciphertexts
kc1x = server.recvline().decode()
kc2x = server.recvline().decode()
kc1 = bytes.fromhex(kc1x)
kc2 = bytes.fromhex(kc2x)

# xor() is from pwntools
key = xor(kc1, kp1) + xor(kc2, kp2)

m = "Criss cross, criss cross"
forged = xor(key[0:len(m)], m)

server.sendline(bytes.hex(forged).encode())
server.interactive()
```

```
$ python pwner.py
eafc512c7c91036bf7e68a62366d8f7073
98a1d90b76fdca15b9a428d388b2d3a834c4
fae2513b6a911476b8e1912b3662987f74b8edd31d7caecd
Cha cha real smooth
byuctf{ch4ch4_sl1d3?...n0,ch4ch4_b1tfl1p}
```

Flag: `byuctf{ch4ch4_sl1d3?...n0,ch4ch4_b1tfl1p}`
