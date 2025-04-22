---
title: "The MAC FAC"
description: "Check out my new MAC generator! I know you are supposed to use random and secret IVs in CBC-AES mode, so I decided to improve upon standard MACs by implementing that. Good luck trying to forge any messages now!\n\n`nc connect.umbccd.net 27811`" 
pubDate: 2025-04-21
ctf: "DawgCTF 2025"
category: "cryptography"
author: "tulip"
section: "CTFs"
image: "images/25-dawgctf/icon.png"
---

Let's check this out.
```
Welcome to the MAC FAC(tory). Here you can request prototype my secure MAC generation algorithm. I know no one can break it so I hid my flag inside the admin panel, but only I can access it. Have fun!

[1] - Generate a MAC
[2] - Verify a MAC
[3] - View MAC Logs
[4] - View Admin Panel
[5] - Exit
> 
```

MACs (Message Authentication Codes) are functions that output data that can be used to verify integrity and authenticity of a message. It seems we have to forge some. Let's dig into the `server.py`. Here's some important snippets.
```py
from secret import flag, xor_key, mac_key, admin_iv, admin_phrase

# ...

def CBC_MAC(msg, iv):
    cipher = AES.new(mac_key, AES.MODE_CBC, iv) # Encrypt with CBC mode
    padded = pad(msg, 16) # Pad the message
    tag = cipher.encrypt(padded)[-16:] # only return the last block as the tag
    msg_enc, iv_enc = encrypt_logs(padded, iv)
    logs.append((f"User generated a MAC (msg={msg_enc.hex()}, IV={iv_enc.hex()}"))
    return tag

# ...

def encrypt_logs(msg, iv):
    return (xor(msg, xor_key), xor(iv, xor_key))#Encrypts logs so users can't see other people's IVs and Messages

def setup_admin():
    tag = CBC_MAC(admin_phrase, admin_iv)
    return tag

def verify_admin(msg, iv, user_tag, admin_tag):
    if msg == admin_phrase:
        print("This admin phrase can only be used once!")
        return
    
    tag = CBC_MAC(msg, iv)
    if (tag != user_tag): #Ensure msg and iv yield the provided tag
        print("Computed: ", tag.hex())
        print("Provided: ", user_tag.hex())
        print("Computed MAC Tag doesn't match provided tag")
        return
    else:
        if (tag == admin_tag):
            print(admin_banner)
            return
        else:
            print("Tag is invalid")

# ...
# part of run()
iv = bytes.fromhex(input("IV (in hex): ").strip())
if (len(iv) != 16):
    print("The IV has to be exactly 16 bytes")
```

Let's focus on that last part, and `encrypt_logs()`. 

### User supplied IV
Ideally, the IV when using AES should be generated randomly. However, this server is allowing us to supply our own IV. And even more alarmingly:
```py
def encrypt_logs(msg, iv):
    #Encrypts logs so users can't see other people's IVs and Messages
    return (xor(msg, xor_key), xor(iv, xor_key))
```
This is something that we can view as an output. The second part `xor(iv, xor_key)` XORs **our user supplied IV** with the XOR key. So the encrypted IV is given by: ($\oplus$ denotes bitwise XOR)
\\[ \operatorname{encrypt}(\mathrm{IV}) = \mathrm{IV} \oplus \mathrm{key} \\]
Note that the XOR operation has an identity element, e.g. an element $a$ such that $a \oplus b = b$ for any value $b$. This value is when $a$ is false, or essentially just zeroes. This means if we send the server an IV of 16 null bytes, the "encrypted" IV will just be the XOR key of the server. We can write a `pwntools` script to facilitate this. While we are at it, we can also gather the admin's encrypted passphrase and encrypted IV.

```py
from pwn import *

HOST = "connect.umbccd.net"
PORT = 27811

context.log_level = "debug"

server = remote(HOST, PORT)

server.recvuntil(b"> ")
server.sendline(b"1")
server.recvuntil(b"Message: ")
server.sendline(b"1")
server.recvuntil(b"IV (in hex): ")
server.sendline(b"00"*16)

server.recvuntil(b"> ")
server.sendline(b"3")
# 3 was the option to view logs: the first log 
# entry is the admin's, the second is ours

admin = server.recvline()
adminL = admin.split()
adminEIV = bytes.fromhex(adminL[-1][-32:].decode())

me = server.recvline()
meL = me.split()

XOR_KEY = bytes.fromhex(meL[-1][-32:].decode())
```

Using this XOR key, we can retrieve the original passphrase and the original admin IV:
```py
# The same XOR key was used to encrypt the admin IV.
adminIV = strxor.strxor(adminEIV, XOR_KEY).hex()

adminM = adminL[-2][5:-1].decode()
adminMB = bytes.fromhex(adminM)

for i in range(0, len(adminMB), 16):
    print(strxor.strxor(adminMB[i:i+16], XOR_KEY), end="")
```
Output:
```
b'At MAC FAC, my M'b'AC is my passwor'b'd. Please verify'b' me\r\r\r\r\r\r\r\r\r\r\r\r\r'
At MAC FAC, my MAC is my password. Please verify me
```
The carriage returns `\r` are the padding characters. We can ignore them. We have successfully recovered the original passphrase. Let's try to login as the admin then.

```py
admin_phrase = b"At MAC FAC, my MAC is my password. Please verify me"

server.recvuntil(b"> ")
server.sendline(b"4")
server.recvuntil(b"Admin passphrase: ")
server.sendline(admin_phrase)
server.recvuntil(b"IV (in hex): ")
server.sendline(adminIV)
```

```
[1] - Generate a MAC
[2] - Verify a MAC
[3] - View MAC Logs
[4] - View Admin Panel
[5] - Exit\n'

> 4
Admin passphrase: At MAC FAC, my MAC is my password. Please verify me
IV (in hex): f5c7484a7f4db192eda4ef3771113657
Tag (in hex): 
```

Well, we don't have that. But now that we know the phrase, and the IV, we can compute the tag of this as the server allows you to generate the tag using option `[1]`.

```py
server.recvuntil(b"> ")
server.sendline(b"1")
server.recvuntil(b"Message: ")
server.sendline(admin_phrase)
server.recvuntil(b"IV (in hex): ")
server.sendline(adminIV.encode())
tag = server.recvline().decode().split()[-1].encode()

# appended these lines
server.recvuntil(b"Tag (in hex): ")
server.sendline(tag)
```
Now, let's try that again! This should work!

```
Admin passphrase: At MAC FAC, my MAC is my password. Please verify me
IV (in hex): f5c7484a7f4db192eda4ef3771113657
Tag (in hex): 6fb6e8a4a833bc14813ce21f7d6c7d58

This admin phrase can only be used once!
```
...wait, what?! It seems we overlooked a line of code.
```py
def verify_admin(msg, iv, user_tag, admin_tag):
    if msg == admin_phrase:
        print("This admin phrase can only be used once!")
        return
    
    tag = CBC_MAC(msg, iv)
    if (tag != user_tag): #Ensure msg and iv yield the provided tag
        print("Computed: ", tag.hex())
        print("Provided: ", user_tag.hex())
        print("Computed MAC Tag doesn't match provided tag")
        return
    else:
        if (tag == admin_tag):
            print(admin_banner)
            return
        else:
            print("Tag is invalid")
```
From the first condition, we can see that the message cannot equal to the admin phrase, but the tag must stay the same. Which means we have to manipulate the IV and the message in such a way that the message is different, but the output is the same. Normally, this is near impossible as IVs are randomly generated. However, we can choose our IV.

AES in CBC mode encrypts plaintext blocks by XORing the successive cipher block before encryption. For the first plaintext block, there is no successive block, which is what the IV is for: it acts as the "zeroth" plaintext block. Let $\mathcal{A}$ represent AES encryption.
\\[ C_1 = \mathcal A(P_1 \oplus \mathrm{IV}) \\]
However, for subsequent blocks:

\\[ C_n = \mathcal A(P_n \oplus C_{n-1}) \\]

So all that matters is that the first plaintext block of our manipulated data matches the original, as long as the rest is unchanged. Now, remember that the XOR operation reverses itself. That is, 
\\[ A \oplus B \oplus B = A \\]
And this is always true. So, we could potentially manipulate our plaintext and IV such that: 
\\[ P^\prime_1 \oplus \mathrm{IV}^\prime = P_1 \oplus \mathrm{IV} \\]
...where $P^\prime, \mathrm{IV}^\prime$ represents our manipulated data.
Now, if we set:
\\[ P^\prime=P \oplus B \\]
\\[ \mathrm{IV}^\prime = \mathrm{IV} \oplus B \\]
...where $B$ is some set bytestream, the output becomes:
\\[ P^\prime \oplus \mathrm{IV}^\prime = P \oplus B \oplus \mathrm{IV} \oplus B = P \oplus \mathrm{IV} \\]
And $P^\prime \neq P$! So $B$ can really be anything: but we can only change the first plaintext block. Remember that AES operates in 16 byte blocks. I chose $B$ as the bytestream `b"\x10" + b"\x00"*15`. If we XOR this with the first 16 bytes of the plaintext, and the IV, the forged message we get is:

```py
forged =  b"Qt MAC FAC, my MAC is my password. Please verify me"
forgeKEY = b"\x10" + b"\x00"*15
forgeIV = strxor.strxor(bytes.fromhex(adminIV), forgeKEY).hex()

server.recvuntil(b"> ")
server.sendline(b"4")
server.recvuntil(b"Admin passphrase: ")
server.sendline(forged)
server.recvuntil(b"IV (in hex): ")
server.sendline(forgeIV)
server.recvuntil(b"Tag (in hex): ")
server.sendline(tag)
```
Now let's try it out.
```
Admin passphrase: Qt MAC FAC, my MAC is my password. Please verify me
IV (in hex): f5c7484a7f4db192eda4ef3771113657
Tag (in hex): 6fb6e8a4a833bc14813ce21f7d6c7d58

There's no way you got in! You have to be cheating this bug will be reported and I will return stronger!
DawgCTF{m0r3_r4nd0mne55_15_n0t_4lw4y5_m0r3_53cur3}
```


Flag: `DawgCTF{m0r3_r4nd0mne55_15_n0t_4lw4y5_m0r3_53cur3}`