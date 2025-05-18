---
title: "Cycles"
description: "I heard through the grapevine that you can't take a discrete log under a large enough, good prime. Well I made sure to pick a good prime, go ahead and try"
pubDate: 2025-05-18
ctf: "BYUCTF 2025"
category: "cryptography"
author: "tulip & Hung"
section: "CTFs"
---

We are given a source script.
```py
from Crypto.Util.number import long_to_bytes, bytes_to_long, isPrime
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad

# Can you undo this?
from hidden import p,N,a,flag,g

# these are for you :)
assert isPrime(p)
assert len(bin(a)) < 1050

hint = pow(g, a, p)
key = long_to_bytes(a)[:16]

cipher = AES.new(key, AES.MODE_ECB)
ct = cipher.encrypt(pad(flag, AES.block_size))

# Now for your hints
print(f"g = {g}")
print(f"P = {p}")
print(f"ciphertext = {ct}")
print(f"Hint = {hint}")
```

So the script had some secret integer $a$ that had a bit length less than 1050, and a known integer $g$ and a prime integer $p$. They then give us the result of,
\\[ g^a\pmod{p} \\]
Let's check the output given.
```
g = 3
P = 121407847840823587654648673057258513248172487324370407391241175652533523276605532412599555241774504967764519702094283197762278545483713873101436663001473945726106157159264352878998534133035299601861808839807763182625559052896295039354029361792893109774218584502647139466059910154701304129191164513825925289381
ciphertext = b'S\x00\xe7%\xcd\xec\xad\x9a\xe1lO\x80\xd6\r\xa5\x00\x19Y\x18\x7f\xa1\x9cx\x98\xb08n~-\rj2\xd4d\xd2\xda\xa6\xd0\r#7\xee-\\\xb4\x10\x98\x8f'
Hint = 1
```

Very interesting. `Hint = 1` is a very special result of $g^a \pmod p$. Recall Fermat's little theorem,
\\[ a^{p-1} \equiv 1 \pmod p \\]
...for any $a$ coprime to $p$. However, $p$ is prime, so any number in the range $\[ 1, p-1 \]$ is coprime to it. 

Now, there are technically other integers $k$ that also result in $g^k \equiv 1 \pmod p$, however, finding this integer is very hard when the group is defined over a very large $p$. Let's think more practically.

The challenge name hints at **cyclic groups**, where in the group, every element can be *generated* by a single element raised to some powers. This element is often denoted $g$. If we assume that $3$ is a generator of the cyclic group $C_p$, then the lowest integer $k$ such that $g^k \equiv 1 \pmod p$ **must** be $p-1$. 

Now, this doesn't mean $a$ is *exactly* $p-1$, as $a$ could also be a multiple of it, since $1^k = 1$ for any number. But we can brute force search for multiples of $p-1$ instead and try those. Let's write a script for this.

```py
from Crypto.Cipher import AES
from Crypto.Util.number import long_to_bytes
from Crypto.Util.Padding import unpad
g = 3
P = 121407847840823587654648673057258513248172487324370407391241175652533523276605532412599555241774504967764519702094283197762278545483713873101436663001473945726106157159264352878998534133035299601861808839807763182625559052896295039354029361792893109774218584502647139466059910154701304129191164513825925289381
ciphertext = b'S\x00\xe7%\xcd\xec\xad\x9a\xe1lO\x80\xd6\r\xa5\x00\x19Y\x18\x7f\xa1\x9cx\x98\xb08n~-\rj2\xd4d\xd2\xda\xa6\xd0\r#7\xee-\\\xb4\x10\x98\x8f'

a = P-1

def printable(B):
    return all((0x20 <= b <= 0x7E) for b in B)

i = 1

while (i*a).bit_length() < 1050:
    key = long_to_bytes(a*i)[:16]
    cipher = AES.new(key, AES.MODE_ECB)
    pt = cipher.decrypt(ciphertext)
    
    # unpad() can error if there is no proper padding scheme
    # e.g. incorrectly decrypted plaintext
    try:
        pt = unpad(pt, AES.block_size)
        if printable(pt):
            print(pt)
            break
    except Exception as e:
        pass

    i += 1
```

```
$ python brute.py
b'byuctf{1t_4lw4ys_c0m3s_b4ck_t0_1_21bcd6}'
```

Flag: `byuctf{1t_4lw4ys_c0m3s_b4ck_t0_1_21bcd6}`
