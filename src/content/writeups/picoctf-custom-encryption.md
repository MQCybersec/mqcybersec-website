---
title: "Custom Encryption"
description: "Can you get sense of this code file and write the function that will decode the given encrypted file content?"
pubDate: 2025-03-21
category: "cryptography"
author: "tulip"
section: "PicoCTF"
tags: ["medium"]
---

In the challenge, we are given an output and a custom encryption script. This encryption script seems to be performing some sort of key exchange, and performing some operations on our plaintext. Here's a few functions from the script.

```py
def test(plain_text, text_key):
    p = 97
    g = 31
    if not is_prime(p) and not is_prime(g):
        print("Enter prime numbers")
        return
    a = randint(p-10, p)
    b = randint(g-10, g)
    print(f"a = {a}")
    print(f"b = {b}")
    u = generator(g, a, p)
    v = generator(g, b, p)
    key = generator(v, a, p)
    b_key = generator(u, b, p)
    shared_key = None
    if key == b_key:
        shared_key = key
    else:
        print("Invalid key")
        return
    semi_cipher = dynamic_xor_encrypt(plain_text, text_key)
    cipher = encrypt(semi_cipher, shared_key)
    print(f'cipher is: {cipher}')
```

Also, at the bottom, there is a snippet that calls `test()` with a user's message and the key `trudeau`:

```py
if __name__ == "__main__":
    message = sys.argv[1]
    test(message, "trudeau")
```

At first, it tests if $p=97$ and $g=31$ are prime. Since they are defined in the function directly as $97$ and $31$, this will always pass. It then performs a "key exchange" with.. noone, apparently, and this key is used in the `encrypt()` function. But first, a semi-cipher is made via the `dynamic_xor_encrypt()` function. Let's check that out.

```py
def dynamic_xor_encrypt(plaintext, text_key):
    cipher_text = ""
    key_length = len(text_key)
    for i, char in enumerate(plaintext[::-1]):
        key_char = text_key[i % key_length]
        encrypted_char = chr(ord(char) ^ ord(key_char))
        cipher_text += encrypted_char
    return cipher_text
```

Breaking it down, the function reverses the plaintext but NOT the key, then performs classic XOR encryption with the reversed plaintext. There are two more functions that we need to investigate, `generator()` and `encrypt()`. 

```py
def generator(g, x, p):
    return pow(g, x) % p

def encrypt(plaintext, key):
    cipher = []
    for char in plaintext:
        cipher.append(((ord(char) * key*311)))
    return cipher
```

From this, `generator(g, x, p)` is the exact same as `pow(g, x, p)` ($g^x\mod{p}$) in Python. So this is just a modular exponentiation function. `encrypt()` seems to grab the ASCII decimal value of each character in our input, then multiply it by the key and $311$. So if we know the value of the key, we can derive the original values.

Okay, so now we get a rough idea of what's happening, let's look at the output they also gave us.

```
a = 94
b = 21
cipher is: [131553, 993956, 964722, 1359381, 43851, 1169360, 950105, 321574, 1081658, 613914, 0, 1213211, 306957, 73085, 993956, 0, 321574, 1257062, 14617, 906254, 350808, 394659, 87702, 87702, 248489, 87702, 380042, 745467, 467744, 716233, 380042, 102319, 175404, 248489]
```

Well, that's convenient! $a$ and $b$ are already given. Investigating where $a$ and $b$ are being used again, we can see them here:
```py
def test(plain_text, text_key):
    # ...
    u = generator(g, a, p)
    v = generator(g, b, p)
    key = generator(v, a, p)
    b_key = generator(u, b, p)
    shared_key = None
    if key == b_key:
        shared_key = key
    # ...
```

This is effectively checking this congruence:
\\[ (g^a)^b \equiv (g^b)^a \pmod{p} \\]
which will always hold true for all values of $a,b$ and all values of $g,p$ such that $g$ and $p$ are coprime. So all we need to do is compute the value of the key from the given parameters and congruence:
\\[ \mathrm{key} \equiv (g^b)^a \equiv (31^{24})^{94} \equiv 47 \pmod{97} \\]

Now we've got the value of the key! So we can find the semi-cipher now.

```py
cipher = [131553, 993956, 964722, 1359381, 43851, 1169360, 950105, 321574, 1081658, 613914, 0, 1213211, 306957, 73085, 993956, 0, 321574, 1257062, 14617, 906254, 350808, 394659, 87702, 87702, 248489, 87702, 380042, 745467, 467744, 716233, 380042, 102319, 175404, 248489]
key = 47

def semi_dec(ct):
    temp = []
    for i in ct:
        temp.append(int(i / 311 / key))
    return temp
```

This gives us the values of the semi-cipher. We know the XOR key is `trudeau`, and XOR reverses itself. Therefore we can just use any string XOR function to decrypt our ciphertext.

```py
# Pass the semi-cipher as it is (reversed, XORed plaintext) and the key as it is. ("trudeau")
def dynamic_xor_decrypt(ciphertext, text_key):
    cipher_text = ""
    key_length = len(text_key)
    for i, char in enumerate(ciphertext): # Don't reverse input when decrypting
        key_char = text_key[i % key_length]
        encrypted_char = chr(ord(char) ^ ord(key_char))
        cipher_text += encrypted_char
    return cipher_text
```

Now let's put it all together! First, decrypt the full cipher to semi by dividing each term in the list by $(311\times\mathrm{key})$, then we need to turn this list of integers to a string and pass it to the `dynamic_xor_decrypt()` function along with the key `trudeau`, and reverse the output.

```py
cipher = [131553, 993956, 964722, 1359381, 43851, 1169360, 950105, 321574, 1081658, 613914, 0, 1213211, 306957, 73085, 993956, 0, 321574, 1257062, 14617, 906254, 350808, 394659, 87702, 87702, 248489, 87702, 380042, 745467, 467744, 716233, 380042, 102319, 175404, 248489]
key = 47

def semi_dec(ct):
    temp = []
    for i in ct:
        temp.append(int(i / 311 / key))
    return temp

def dynamic_xor_decrypt(ciphertext, text_key):
    cipher_text = ""
    key_length = len(text_key)
    for i, char in enumerate(ciphertext):
        key_char = text_key[i % key_length]
        encrypted_char = chr(ord(char) ^ ord(key_char))
        cipher_text += encrypted_char
    return cipher_text

semi = semi_dec(cipher)

xor_key = "trudeau"

semi_b = ""
for i in semi:
    semi_b += chr(i)

print(dynamic_xor_decrypt(semi_b, xor_key)[::-1])
```
Running this script, we get the flag!

Flag: `picoCTF{custom_d2cr0pt6d_8b41f976}`