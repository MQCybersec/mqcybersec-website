---
title: "PW Crack 4"
description: "Can you crack the password to get the flag?\nDownload the password checker here and you'll need the encrypted flag and the hash in the same directory too.\nThere are 100 potential passwords with only 1 being correct. You can find these by examining the password checker script."
pubDate: 2025-03-06
category: "general skills"
author: "sclux7"
section: "PicoCTF"
tags: ["medium"]
---

# Understanding the challenge
This is the fourth installment in the PW Crack series. I highly recommend completing the other ones from the start as they teach you different and important skills in each one, however only the fourth one was chosen to be demo'd in Hack Hub. But do what you will I am merely [a voice inside your head as you are reading this text](https://en.wikipedia.org/wiki/Subvocalization).
With all that out of the way, let's get [cracking](https://en.wikipedia.org/wiki/Pun)!
After using `wget` on all three files and ensuring they are all in the same directory, we can then `cat level4.py` and start reading how the program works.
```python
def level_4_pw_check():
    user_pw = input("Please enter correct password for flag: ")
    user_pw_hash = hash_pw(user_pw)

    if( user_pw_hash == correct_pw_hash ):
        print("Welcome back... your flag, user:")
        decryption = str_xor(flag_enc.decode(), user_pw)
        print(decryption)
        return
    print("That password is incorrect")                      

level_4_pw_check()

# The strings below are 100 possibilities for the correct password.
#   (Only 1 is correct)
pos_pw_list = ["158f", "1655", "d21e", "4966", "ed69", "1010", "dded", "844c", ...]
```
# Method
This part of the program is especially interesting, as we can instead make it use the correct password, print it and then the flag.
We change the above to the following:
```python
def level_4_pw_check():

pos_pw_list = ["158f", "1655", "d21e", "4966", "ed69", "1010", "dded", "844c", "40ab", "a948", "156c", "ab7f", "4a5f", >

for i in pos_pw_list:

     user_pw_hash = hash_pw(i)

     if( user_pw_hash == correct_pw_hash ):

         print("Welcome back... your flag, user:")

         decryption = str_xor(flag_enc.decode(), i)

         print(decryption)

         return

print("That password is incorrect")
```
Analysing the above:
- We move `pos_pw_list` to inside the function so that we may call upon it later
- We use a for loop to iterate through the list so that when the correct password is selected, it then prints the flag
- We change `user_pw_hash = hash_pw(user_pw)` to `user_pw_hash = hash_pw(i)` so that each password from `pos_pw_list` is run through the `hash_pw` function

After changing this and running the program with `python3 level4.py`, we get the flag.