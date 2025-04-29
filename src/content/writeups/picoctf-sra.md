---
title: "SRA"
description: "I just recently learnt about the SRA public key cryptosystem... or wait, was it supposed to be RSA? Hmmm, I should probably check..."
pubDate: 2025-04-29
category: "cryptography"
author: "tulip"
section: "PicoCTF"
tags: ["hard"]
---

Let's see what's going on at that server.
```
anger = 16125122068115597082779928188972796880261064131170486559543722224795953961145
envy = 45720345051169593622841656572504610746799772266912873578789403660827237873089
vainglory?
> a
Hubris!
```

...and that's it, it seems? Let's check out `chal.py`.

```py
from Crypto.Util.number import getPrime, inverse, bytes_to_long
from string import ascii_letters, digits
from random import choice

pride = "".join(choice(ascii_letters + digits) for _ in range(16))
gluttony = getPrime(128)
greed = getPrime(128)
lust = gluttony * greed
sloth = 65537
envy = inverse(sloth, (gluttony - 1) * (greed - 1))

anger = pow(bytes_to_long(pride.encode()), sloth, lust)

print(f"{anger = }")
print(f"{envy = }")

print("vainglory?")
vainglory = input("> ").strip()

if vainglory == pride:
    print("Conquered!")
    with open("/challenge/flag.txt") as f:
        print(f.read())
else:
    print("Hubris!")
```

Ok, so we're dealing with an RSA scheme. The server is sending us `anger` and `envy`.
- `anger` seems to the encrypted message.
- `envy` is the private key.

It seems we need to send the server the original plaintext. But wait, if it just gave us the private key, can't we just decrypt? Well.... not really. The server sends us the private key, but this time, it leaves out $n$, the modulus. Our task is to recover that modulus. Let's explore.

### Recovering n

We don't have much to go off of. Knowing a ciphertext won't help unless we can gather several pairs maybe, but the server generates a new key each time. Let's look at the fundamental relationship between the public and private key, that is:
\\[ ed \equiv 1 \pmod{\varphi(n)} \\]

We can also see that the primes `gluttony` and `greed` (commonly $p$ and $q$) are relatively small (128 bits!). 
```py
gluttony = getPrime(128)
greed = getPrime(128)
```

We also know that $\varphi(n) = (p-1)(q-1)$. If we could recover $\varphi(n)$, we can potentially recover $n$ as well. Let's try. To recover $\varphi(n)$, recall the identity above. We can rearrange it like so.
\\[ ed-1 \equiv 0 \pmod{\varphi(n)} \\]

This is useful, because it means that $ed-1$ is a multiple of $\varphi(n)$. This also means if we can factorise $ed-1$ which unlike $n$ could have several factors, $\varphi(n)$ will be in there *somewhere*. We just need to find out where. Let's write a script for this. We can use `sympy`'s `divisors()` function to gather the, well, divisors. To narrow our search, we'll leverage two observations:
- The server is generating two 128 bit primes. This means the product should have a bit length of roughly 256. Similarly for $\varphi(n)$, this should also have a bit length of roughly 256 as $pq$ is very very close to $(p-1)(q-1)$.
- By construction:
\\[ ed \equiv 1 \pmod{\varphi(n)} \\]
- This gives us a way to test our value of $\varphi(n)$, as we have $e$ and $d$.

```py
from pwn import *
from gmpy2 import mpz
from sympy import divisors

HOST = "saturn.picoctf.net"
PORT = 61224

server = remote(HOST, PORT)
context.log_level = "debug"

c = mpz(server.recvline().decode().strip().split()[-1])
d = mpz(server.recvline().decode().strip().split()[-1])
e = 0x10001

# Divisors of multiple of phi
dmphi = divisors(d*e-1)
dmphi.reverse()

phi = 0

for p in dmphi:
    if p.bit_length() == 256 or p.bit_length() == 255:
        t = (d * e) % p
        if t == 1:
            print(f"Recovered phi: {p}")
            phi = p
```

But there's an issue. There could be several numbers that satisfy $ed\equiv 1 \pmod{p}$. So we need to record every possible value, because each one *could* be our value of $\varphi(n)$.

```py
PHI = []

for p in dmphi:
    if p.bit_length() == 256 or p.bit_length() == 255:
        t = (d * e) % p
        if t == 1:
            print(f"Recovered potential phi: {p}")
            PHI.append(p)
```
Works like a charm!
```
$ python pwner.py
[+] Opening connection to saturn.picoctf.net on port 61224: Done
[DEBUG] Received 0xbb bytes:
    b'anger = 16125122068115597082779928188972796880261064131170486559543722224795953961145\r\n'
    b'envy = 45720345051169593622841656572504610746799772266912873578789403660827237873089\r\n'
    b'vainglory?\r\n'
    b'> '

Recovered potential phi: 112679537214895519602142510784906538602324634290638876193333376493668572822226
Recovered potential phi: 108258337077046811809385564231239058982333140944312052739833844487305249240864
Recovered potential phi: 96582460469910445373265009244205604516278257963404751022857179851715919561908
Recovered potential phi: 95890113083029366911807912403745349286770886938577476821976483221954515120604
Recovered potential phi: 94726044942415960333212368702334176609541498326273046147354613926392093085756
Recovered potential phi: 87235770747015886143594201897992158917928749128236549310967775349936959604304
Recovered potential phi: 85851075973253729220680008217071648458914007078582000909206382090414150721696
Recovered potential phi: 81193752807785108857039173173429294236749855708234039554875383365478936930648
Recovered potential phi: 75119691476597013068095007189937692401549756193759250795555584329112381881484
Recovered potential phi: 73336292858644614451519253188903878665451482575179132501177765620432588195424
Recovered potential phi: 72172224718031207872923709487492705988222093962874701826555896324870166160576
Recovered potential phi: 71917584812272025183855934302809011965078165203933107616482362416465886340453
Recovered potential phi: 71044533706811970249909276526750632457156123744704784610515960444794069814317
Recovered potential phi: 64388306979940296915510006162803736344185505308936500681904786567810613041272
Recovered potential phi: 63150696628277306888808245801556117739694332217515364098236409284261395390504
Recovered potential phi: 58157180498010590762396134598661439278619166085491032873978516899957973069536
Recovered potential phi: 56339768607447759801071255392453269301162317145319438096666688246834286411113
Recovered potential phi: 54129168538523405904692782115619529491166570472156026369916922243652624620432
Recovered potential phi: 49849011855437649224910972513138376524530713787563742463410157342821119773888
Recovered potential phi: 48890861905763076301012835459269252443634321716786088334118510413621725463616
Recovered potential phi: 48291230234955222686632504622102802258139128981702375511428589925857959780954
Recovered potential phi: 47945056541514683455903956201872674643385443469288738410988241610977257560302
Recovered potential phi: 47363022471207980166606184351167088304770749163136523073677306963196046542878
Recovered potential phi: 43617885373507943071797100948996079458964374564118274655483887674968479802152
Recovered potential phi: 42925537986626864610340004108535824229457003539291000454603191045207075360848
Recovered potential phi: 40596876403892554428519586586714647118374927854117019777437691682739468465324
Recovered potential phi: 38771453665340393841597423065774292852412777390327355249319011266638648713024
Recovered potential phi: 37559845738298506534047503594968846200774878096879625397777792164556190940742
Recovered potential phi: 36668146429322307225759626594451939332725741287589566250588882810216294097712
Recovered potential phi: 36086112359015603936461854743746352994111046981437350913277948162435083080288
Recovered potential phi: 32194153489970148457755003081401868172092752654468250340952393283905306520636
Recovered potential phi: 31575348314138653444404122900778058869847166108757682049118204642130697695252
Recovered potential phi: 29078590249005295381198067299330719639309583042745516436989258449978986534768
```

Now, what can we do with this information? Well, again, $\varphi(n)$ does not necessarily have large prime factors like $n$ itself, this makes factorising it feasible. Let's combine this with some other information.
- We are looking for two distinct values that multiply to give $\varphi(n)$. These values must also have bit length close to 128.
- The number just 1 above these two values **must** be prime. This is because our divisors will be equal to $p-1$ and $q-1$, where $p$ and $q$ are both prime. This is crucial, because it gives us a way to check if we have gotten the right $p$ and $q$.
- `divisors()` returns the divisors in ascending order. This means, if `D` is a list returned by `divisors(n)`, `D[i] * D[len(D) - 1 - i] = n` for all iterations. Here's an example of what I mean. Take the divisors of 20:
\\[ \[1, 2, 4, 5, 10, 20\] \\]
- ...then for all "opposite" pairs of numbers in the list, such as $(1,20)$, $(2,10)$, $(4,5)$, they will always multiply up to equal $20$. This will help thin our search so that we don't have to go through every possible pair in the list.

Since $\varphi(n)$ is factorisable, and we can narrow our search down enough, this method is feasible. The process would be as follows:
- Find all unique divisors of $\varphi(n)$.
- For each divisor pair, check that the bit lengths of each are 128.
- If they are, check if the number 1 above each are both prime.
- Record these numbers + 1. Again, several numbers could hold these properties, so we must record them all.
- For each pair of $p$ and $q$, attempt decryption with $n = pq$. 

Let's implement this. It'll look messy.
```py
from Crypto.Util.number import long_to_bytes, isPrime

print("Attempting p and q recovery")
PQ = []

for phi in PHI:
    dphi = divisors(phi)
    
    for i in range(len(dphi)):
        # dphi[i] and dphi[len(dphi)-1-i] form a divisor pair
        if dphi[i].bit_length() == 128 or dphi[len(dphi)-1-i].bit_length() == 128:
            # Not necessary: just wanted to be extra sure
            if dphi[i] * dphi[len(dphi)-1-i] == phi:
                # If the pair of numbers a,b satisfies a+1, b+1 are both prime,
                # add them to our list
                if isPrime(dphi[i] + 1) and isPrime(dphi[len(dphi)-1-i] + 1):
                    print(f"Found potential hit at:\np = {dphi[i]}\nq = {dphi[len(dphi)-1-i]}")
                    PQ.append((dphi[i] + 1, dphi[len(dphi)-1-i] + 1))

for p in PQ:
    n = p[0]*p[1]
    print(long_to_bytes(pow(c,d,n)))
```
Check it out. (This had the same pair, just swapped.)
```
Attempting p and q recovery
Found potential hit at:
p = 199938725365364718991062216515915037438
q = 249321444679335579694228141256466319776
Found potential hit at:
p = 249321444679335579694228141256466319776
q = 199938725365364718991062216515915037438
b'EK8M8gJlaRHxE9J1'
b'EK8M8gJlaRHxE9J1'
[*] Switching to interactive mode
vainglory?
> $ EK8M8gJlaRHxE9J1
Conquered!
picoCTF{7h053_51n5_4r3_n0_m0r3_b2f9b414}
```

Flag: `picoCTF{7h053_51n5_4r3_n0_m0r3_b2f9b414}`