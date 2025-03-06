---
title: "serpentine"
description: "Find the flag in the Python script!"
pubDate: 2025-03-06
ctf: "PicoCTF"
category: "general"
author: "sclux7"
section: "PicoCTF"
---

# Understanding the challenge
First we `wget [file link]` and second we run the program to see what it does.

The program lets us choose whether we want to receive an encouragement, print the flag or quit. Of course, we print an encouragement.
"You can do it!"

Yes we can snake program, yes we can.

Let's now see what happens when we print the flag.

"Oops! I must have misplaced the print_flag function! Check my source code!"


Let's do exactly what the program tells us to.

We `cat serpentine.py` and get to reading. At the top of the file, we see some awfully useful looking code:
```python
def str_xor(secret, key):
    #extend key to secret length
    new_key = key
    i = 0
    while len(new_key) < len(secret):
        new_key = new_key + key[i]
        i = (i + 1) % len(key)
    return "".join([chr(ord(secret_c) ^ ord(new_key_c)) for (secret_c,new_key_c) in zip(secret,new_key)])


flag_enc = chr(0x15) + chr(0x07) + chr(0x08) + chr(0x06) + chr(0x27) + chr(0x21) + chr(0x23) + chr(0x15) + chr(0x5c) + chr(0x01) + chr(0x57) + chr(0x2a) + chr(0x17) + chr(0x5e) + chr(0x5f) + chr(0x0d) + chr(0x3b) + chr(0x19) + chr(0x56) + chr(0x5b) + chr(0x5e) + chr(0x36) + chr(0x53) + chr(0x07) + chr(0x51) + chr(0x18) + chr(0x58) + chr(0x05) + chr(0x57) + chr(0x11) + chr(0x3a) + chr(0x0f) + chr(0x0a) + chr(0x5b) + chr(0x57) + chr(0x41) + chr(0x55) + chr(0x0c) + chr(0x59) + chr(0x14)


def print_flag():
  flag = str_xor(flag_enc, 'enkidu')
  print(flag)
```

Moving to the bottom of the program we can see that when we input the choice to print the flag, the program instead returns the message we got earlier.
```python
  while True:
    print('a) Print encouragement')
    print('b) Print flag')
    print('c) Quit\n')
    choice = input('What would you like to do? (a/b/c) ')

    if choice == 'a':
      print_encouragement()

    elif choice == 'b':
      print('\nOops! I must have misplaced the print_flag function! Check my source code!\n\n')
```

Let's change this.

# Method
We can use `nano serpentine.py` to open the source code in an editable environment.

We can then scroll down to the while True function and change `elif choice = 'b':` to instead `print_flag()`.
```python
    elif choice == 'b':
      print_flag()
```

Perfect. We can now `Ctrl+X` to exit `nano`, this prompts us to save so we press `Shift+Y` to save and finally press enter to close.

Let's run the program once more.

For old time's sake, let's get one more encouragement.

"Look how far you've come!"

Look how far indeed. Let's print our flag.

Flag: `picoCTF{7h3_r04d_l355_7r4v3l3d_aa2340b2}`