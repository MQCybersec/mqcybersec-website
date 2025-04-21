---
title: "Cantor's Pairadox"
description: "Now that I have encrypted my flag with a new math function I was just researching I can know share it with my friend Cantor and no one will know how to read it except us!" 
pubDate: 2025-04-21
ctf: "DawgCTF 2025"
category: "cryptography"
author: "tulip"
section: "CTFs"
---

We are given an output and a script. Let's check out the script.

```py
from sage.all import sqrt, floor

def getTriNumber(n):
    return n * (n + 1) // 2  # Ensure integer division

def pair(n1, n2):
    S = n1 + n2
    return getTriNumber(S) + n2

def pair_array(arr):
    result = []
    for i in range(0, len(arr), 2):
        result.append(pair(arr[i], arr[i + 1]))    
    return result

def pad_to_power_of_two(arr):
    result = arr
    n = len(result)
    while (n & (n - 1)) != 0:
        result.append(0)
        n += 1
    return result
    
flag = [ord(f) for f in flag]  
flag = pad_to_power_of_two(flag)

temp = flag
for i in range(6):
    temp = pair_array(temp)

print("Encoded:", temp)
```

Interesting, `getTriNumber()` gets the $n$-th triangular number. A triangular number $n$ is a number where $n$ dots can represent an equilateral triangle. e.g. the number 6 is a triangular number because an equilateral triangle can be represented with 6 dots as such:
```
  .
 . .
. . .
```
Algebraically, a triangular number can be given by the following formula that was implemented in `getTriNumber()`:
\\[ T_n = \frac{n(n+1)} 2 \\]

More about what the script is doing:
- The script gets a secret string (our flag) and converts it into an array of ASCII values.
- The array is padded with zeroes so that the length is the next power of 2 (e.g. if I had an array of length 9, I would pad it with 7 zeroes to get to length $16 = 2^4$).
- Each pair of the array is passed to `pair(a,b)` which calculates $T_{a+b} + b$. Important note, this turns a set of two numbers into one. This operation is known as **Cantor's Pairing**.
- This result is appended to a new array until it has iterated through the entire string.
- The entire array is returned.

Let's break this down. Since part of our result is $T_{a+b}$, we need to find a way to get the value of $n$ given a triangular number $T_n$. You can think of it as: "What position does the number $T_n$ lie in the series of triangular numbers?" (1,3,6,10,15)

Well, we can solve for this:
\\[ T_n = \frac{n(n+1)}2 \\]
\\[2T_n = n^2 + n\\]
\\[ n^2 + n - 2T_n = 0 \\]
Using the quadratic formula:
\\[ n = \frac{-1 \pm \sqrt{1+8T_n}}{2} \\]
We only care about the positive solution, so discard the $\pm$.
\\[ n = \frac{ \sqrt{8T_n + 1} - 1}{2} \\]

To solve this, notice that $T_n$ grows much faster than $n$ as $n$ increases. This means we can reliably find a number $T_n$ just under our output of `pair(a,b)` that is offset by just $b$ (remember that `pair(a,b)` calculates $T_{a+b}+b$). This means we can find the number $a+b$ because $T_{a+b}$ it is constrained to be tha largest possible triangular number below `pair(a,b)`, and we can do this by taking the floor of the operation. Note that knowing $a+b$ does not always mean you will know $a$ and $b$.

Once we have $a+b$, we can also find $T_{a+b}$ and thus the pair $a,b$ by:
\\[ b = \operatorname{pair}(a,b) - T_{a+b} \\]
\\[ a = (a+b) - b \\]

```py
import math

def unpair(z):
    # Solve for the largest S
    S = (math.isqrt(8 * z + 1) - 1) // 2
    T_S = getTriNumber(S)
    n2 = z - T_S
    n1 = S - n2
    return (n1, n2)
```

So now, we can successfully unpair a single number! The original script applied `pair()` 6 times, so we need to unpair 6 times.
```py
import math

def getTriNumber(n):
    return n * (n + 1) // 2  # Ensure integer division

def unpair(z):
    S = int((math.isqrt(8 * z + 1) - 1) // 2)
    T_S = getTriNumber(S)
    n2 = z - T_S
    n1 = S - n2
    return (n1, n2)

def unpair_array(paired_arr):
    result = []
    for val in paired_arr:
        n1, n2 = unpair(val)
        result.extend([n1, n2])
    return result

a = [4036872197130975885183239290191447112180924008343518098638033545535893348884348262766810360707383741794721392226291497314826201270847784737584016]
for i in range(6):
    a = unpair_array(a)

for i in a:
    print(chr(i), end="")
```

```
$ python cantor.py
Dawg{1_pr3f3r_4ppl3s_t0_pa1rs_4nyw2y5}
```

Flag: `Dawg{1_pr3f3r_4ppl3s_t0_pa1rs_4nyw2y5}`