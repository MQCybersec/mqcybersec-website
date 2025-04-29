---
title: "Baby RSA 2"
description: "If all I have to do is keep my factors p and q secret, then I can save computation time by sharing the same modulus between all my friends. I'll give them unique e and d pairs to encrypt and decrypt messages. Sounds secure to me!"
pubDate: 2025-04-22
ctf: "DawgCTF"
category: "cryptography"
author: "HulkOperator"
image: "./images/25-dawg/icon.png"
section: "CTFs"
---

## Background

Similar to the [Baby RSA 1](/writeups/25-dawg-babyrsa1) challenge, this challenge is also based on RSA encryption. However, to make things difficult a direct relation to the values `p` and `q` are not given.

## Solution

We are given the Python source file, which was used to encrypt the flag, and an output file containing four values. 
The code generates two large primes `p` and `q` and calculates `N`

$N = p * q$

The challenge's flag is encrypted using

$ct = flag^65537 \bmod N$

The values of `N` and `ct` are given in the output file. However, just based on this, we cannot decrypt the flag as we know nothing about `p` and `q`.  

We are, however, given a separate `e` and `d` pair.

$e = 58271$

$d = e^{-1} \bmod \varphi$, where $\varphi = (p - 1) * (q - 1)$

Since the given `d` is the modular inverse of `e`

$e*d \equiv 1 \bmod \varphi$

Hence, $e * d -1$ is divisible by $\varphi$

$e * d - 1 = k * \varphi$. Multiple combinations of $k$ and $\varphi$ will exist, but only one is the right solution. 

We can work with this information to retrieve the values of `p` and `q`.

$\varphi = (p - 1) * (q - 1)$

$p + q = N + 1 - \varphi$

$N = p * q$

Since we have the values of $p*q$ and $p+q$, we can consider `p` and `q` as the roots for the following quadratic equation

$x^{2} - (p + q)*x + pq = 0$

$x = \frac{(p + q) + \sqrt{(p + q)^2 - 4pq}}{2}$ and $x = \frac{(p + q) - \sqrt{(p + q)^2 - 4pq}}{2}$

Let's implement a Python code to solve this

```py
from Crypto.Util.number import *
from math import isqrt

e = 58271
d = 16314065939355844497428646964774413938010062495984944007868244761330321449198604198404787327825341236658059256072790190934480082681534717838850610633320375625893501985237981407305284860652632590435055933317638416556532857376955427517397962124909869006289022084571993305966362498048396739334756594170449299859
N = 119082667712915497270407702277886743652985638444637188059938681008077058895935345765407160513555112013190751711213523389194925328565164667817570328474785391992857634832562389502866385475392702847788337877472422435555825872297998602400341624700149407637506713864175123267515579305109471947679940924817268027249

kphi = e * d - 1

for k in range(1, 100000):
    if kphi % k != 0:
        continue
    phi = kphi // k
    sum_pq = N - phi + 1
    disc = sum_pq**2 - 4*N
    if disc < 0:
        continue
    sqrt_d = isqrt(disc)
    if sqrt_d*sqrt_d != disc:
        continue

    p = (sum_pq + sqrt_d) // 2
    q = (sum_pq - sqrt_d) // 2
    if p*q == N:
        print("p =", p)
        print("q =", q)
```

Now that we have the values of `p` and `q`, we can calculate the `d` to decrypt the challenge's flag.

$d = 65537^{-1} \bmod \varphi$

$m = ct ^ d \bmod N$

```py
from Crypto.Util.number import *
from math import isqrt, gcd

N = 119082667712915497270407702277886743652985638444637188059938681008077058895935345765407160513555112013190751711213523389194925328565164667817570328474785391992857634832562389502866385475392702847788337877472422435555825872297998602400341624700149407637506713864175123267515579305109471947679940924817268027249
c = 107089582154092285354514758987465112016144455480126366962910414293721965682740674205100222823439150990299989680593179350933020427732386716386685052221680274283469481350106415150660410528574034324184318354089504379956162660478769613136499331243363223860893663583161020156316072996007464894397755058410931262938
p = 12673583859073640501661455004784587727654478446168828670161124936354757284691620326810620730841144377346099498240982811485371900565080834027555162227575467
q = 9396132067856904799705987823868170683112984056272046970591959922947051853868582057072505997173925740215078957901709486016878996439574126935354008510180947

d = pow(65537, -1, (p - 1) * (q - 1))
flag = pow(c, d, N)
print(long_to_bytes(flag).decode())
```

Flag: `DawgCTF{kn0w1ng_d_1s_kn0w1ng_f4ct0rs}`
