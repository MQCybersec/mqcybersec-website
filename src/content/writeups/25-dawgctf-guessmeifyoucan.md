---
title: "Guess Me If You Can"
description: "Check out the note-taking app I created! I heard users are really bad at picking passwords, so I made a really really secure number generator to give users passwords! Good luck trying to break it now.\n\n`nc connect.umbccd.net 25185`" 
pubDate: 2025-04-21
ctf: "DawgCTF 2025"
category: "cryptography"
author: "tulip"
section: "CTFs"
---

Let's check out that server.

```
Welcome to the state of the art secure note taking app, Global Content Library. You can make accounts, see active users, store and view private information. Everything you can ask for. You can rest well knowing your password is securely generated, just make sure you don't lose it. That's the only way to access your account!

[1] - Register
[2] - Login
[3] - Manage Notes
[4] - List Users
[5] - Exit

> 1
Enter your name: 1

Your secret password is: 2004400667945757523
Please don't lose it!!
```

Okay, nice. Let's see what's in `server.py` as well. (It's quite a long file, so here are some of the important snippets)

```py
from secret import flag, init, N, a, b

seed = init
state = seed

# ...

def getNext(state):
    state = (a * state + b) % N
    return state

def make_account(name, password):
    global accounts
    global notes
    accounts.append((name, password))
    notes[name] = []

def register(name):
    for account in accounts:
        if name == account[0]:
            print("An account with this name already exists")
            raise ValueError(f"User '{name}' already exists. Please choose a different username")
    global state
    state = getNext(state)
    make_account(name, state)
    
    return state

# ...

def initAdmin():
    register("admin")
    add_note("admin", flag)
```

So it seems our name doesn't have any impact on the result of our password; it's **pseudorandomly generated** (numbers that seem random, but they follow a predictable pattern). In fact, we're dealing with a specific type of pseudorandom number generator, a **linear congruential generator**, which is a random number generator that operates under the following recursive congruence:

\\[ s_n \equiv As_{n-1} + B \pmod{m} \\]

It also seems the `admin` account is locked with the initial state of the LCG.

# Breaking an LCG

Even though they have kept the initial state and configuration secret, LCGs are **not cryptographically secure**. They follow a predictable pattern and more importantly, if enough output data is received, the configuration of the LCG can be fully determined and any state can be generated. 

To break an LCG, we need to know 4 things:
- The modulus $m$
- The coefficient $A$
- The constant $B$
- A known state $s_n$

These are easily recoverable, given enough outputs.

### Recovering the modulus

To recover the modulus, we can gather a series of terms that are multiples of it, and find the greatest common divisor of all of them. Let's look at the differences between the terms, if:
\\[s_1 \equiv As_0 + B \pmod{m}\\]
\\[s_2 \equiv As_1 + B \pmod{m}\\]
\\[s_3 \equiv As_2 + B \pmod{m}\\]
\\[s_4 \equiv As_3 + B \pmod{m}\\]

The difference from one term and its previous can be written like so. $\Delta$ represents difference in and all computations are done mod $m$ here.

\\[ \Delta s_{n} = As_n + B - As_{n-1} - B\\]
\\[ \Delta s_{n} = As_n - As_{n-1} \\]

So starting from $s_2$ as we do not have $s_0$,
\\[ \Delta s_2 = As_2 - As_1 \\]
\\[ \Delta s_3 = As_3 - As_2 \\]
\\[ \Delta s_4 = As_4 - As_3 \\]

But we can write it in terms of just 1 state. 

\\[ \Delta s_2 = A^2s_1 + AB - As_1 \\]
\\[ \Delta s_3 = A^3s_1  + A^2B - A^2s_1 \\]
\\[ \Delta s_4 = A^4s_1  + A^3B - A^3s_1 \\]

Or in general, we can say:
\\[ \Delta s_n = A^ns_1 + A^{n-1}B - A^{n-1}s_1 \\]

Remember, since we are trying to find terms that give us a multiple of $m$, we are looking for such an expression $E(s)$ that $E(s)\equiv 0 \pmod{m}$. This is the same as finding two expressions such that $E_1(s) \equiv E_2(s)$, since we can subtract them to get $0$.

Let's try and play around a bit. What if we compute $\Delta s_2 \cdot \Delta s_4$? (I have not included the full expansion as it's quite lengthy with 9 terms).
\\[ \Delta s_2 \cdot \Delta s_4 = A^6s_1 + A^5Bs_1 - A^5s_1^2 + \ldots \\]

Now, what if we try to compute $(\Delta s_3)^2$? Again, this isn't the full thing.

\\[ (\Delta s_3)^2 = A^6s_1^2 + A^5Bs_1 - A^5s_1^2 + \ldots \\]

And it turns out, these two are the **exact same**! So when we take the difference of these two results, this will be congruent to $0$ modulo $m$, or in gemeral math notation:

\\[ (\Delta s_{n-1}\cdot \Delta s_{n+1}) - (\Delta s_n)^2 \equiv 0 \pmod{m} \\]

This part is **very important**, because what we are saying is that the difference between these can be written as a multiple of $m$, the modulus, which is one of the key parts of breaking an LCG. Since we can gather several multiples of $m$, if we take the GCD of them, we should be able to recover $m$. Let's write a python script to implement this.

```py
from pwn import *
from math import gcd
from functools import reduce

def recover_m(outputs):
    diffs = [outputs[i+1] - outputs[i] for i in range(len(outputs)-1)]

    T = []
    for i in range(len(diffs) - 2):
        s0 = diffs[i]
        s1 = diffs[i+1]
        s2 = diffs[i+2]
        t = s2 * s0 - s1 * s1
        T.append(abs(t))

    # Apply gcd() to each pair in T
    m = reduce(gcd, T)
    return m

HOST = "connect.umbccd.net"
PORT = 25185

context.log_level = "debug"
server = remote(HOST, PORT)

L = []

# Gather LCG outputs
for i in range(7):
    server.recvuntil(b"> ")
    server.sendline(b"1")
    server.recvuntil(b"Enter your name: ")
    server.sendline(chr(i).encode())
    n = int(server.recvline().strip().split()[-1])
    L.append(n)

m = recover_modulus(L)
```

```py
# output
m = 15580717407977551177
```

So we've successfully recovered $m$! 

### Recovering A

Now that the hard part is done, let's look at $A$. To recover $A$, let's look back at our differences in $s_n$. Recall that:
\\[ \Delta s_n = A^ns_1 + A^{n-1}B - A^{n-1}s_1 \\]
We can factor an $A$ out of this however.
\\[ \Delta s_n = A(A^{n-1}s_1 + A^{n-2}B - A^{n-2}s_1) \\]
...but wait, that's just $A(\Delta s_{n-1})$! So we can say now:
\\[ \Delta s_n = A(\Delta s_{n-1}) \\]
And rearranging for $A$,
\\[ A = \frac{\Delta s_n}{\Delta s_{n-1}} \\]
However remember we are working mod $m$, and division is generally not allowed in modular arithmetic. So instead, we have to compute:
\\[ A = (\Delta s_{n-1})^{-1}(\Delta s_n) \pmod m \\]
...where $(\Delta s_{n-1})^{-1}$ denotes the modular inverse of $\Delta s_{n-1}$ mod $m$. In python, this can be done with `pow(s, -1, m)`
And this is easy to compute given 3 outputs of the LCG. It can even be done in one line.

```py
a = (((L[2] - L[1]) * pow( (L[1] - L[0]), -1, m)) % m)
# Output: a = 3
```

### Recovering B
Recall that a term $s_n$ in the LCG is given by:
\\[ s_n \equiv As_{n-1} + B \pmod{m} \\]
So now that we have $A$, we can compute this easily.
\\[ B \equiv s_n - As_{n-1} \pmod m  \\]

### Recovering the initial state
Now that we have $A$, $B$, and $m$, we can recover any term in the sequence given a starting term. But we want to recover the initial state $s_0$. Given $s_1$, we can do just that.
\\[ s_1 \equiv As_0 + B \pmod m \\]
\\[ s_0 \equiv A^{-1}(s_1 - B) \pmod m \\]

In python:
```py
init = (pow(a, -1, m) *(L[0] - C)) % m
```

Perfect! So we have all the pieces we need. Now to put it all together.

```py
m = recover_modulus(L)
a = ( ((L[2]-L[1]) * pow((L[1]-L[0]), -1, m)) % m)
C = (L[1] - a*L[0]) % m
init = (pow(a, -1, m) *(L[0] - C)) % m

print(f"{m = }")
print(f"{a = }")
print(f"{C = }")
print(f"{init = }")

server.recvuntil(b"> ")
server.sendline(b"2")
server.recvuntil(b"Enter your name: ")
server.sendline(b"admin")
server.recvuntil(b"Enter your password: ")
server.sendline(str(init).encode())

server.recvuntil(b"> ")
server.sendline(b"3")

server.interactive()
```
```
Here are the notes for user 'admin'
Note 1: DawgCTF{PRNGs_d0nt_m4k3_f0r_g00d_p455w0rd5}
```
Flag: `DawgCTF{PRNGs_d0nt_m4k3_f0r_g00d_p455w0rd5}`