---
title: "Binary Search"
description: "Want to play a game? As you use more of the shell, you might be interested in how they work! Binary search is a classic algorithm used to quickly find an item in a sorted list. Can you find the flag? You'll have 1000 possibilities and only 10 guesses. Cyber security often has a huge amount of data to look through - from logs, vulnerability reports, and forensics. Practicing the fundamentals manually might help you in the future when you have to write your own tools!"
pubDate: 2025-03-06
ctf: "PicoCTF"
category: "general skill"
author: "sclux7"
section: "PicoCTF"
tags: ["easy"]
---

# Understanding the challenge
We can download the files for the challenge using `wget [file link]`.

Let's then use `unzip [file]` to unzip the zip file.

We are given a zip file with 3 folders and a .sh (shell script) file.

Navigating to the file using `cd [folder]/`, we can then read the file using `cat [file]` so that we may begin understanding how this file works.

We see that the program first chooses a random number between 1 and 1000,
```
 target=$(( (RANDOM % 1000) + 1 ))
```

it then reads the inputted guess, and if the guess is valid (only contains numbers between 0 and 9),
```
if ! [[ "$guess" =~ ^[0-9]+$ ]]; then
```
checks if the guess is higher or lower than the target number. It then prints a corresponding message to keep the player's guesses on the right track.
```
if (( guess < target )); then
                    echo "Higher! Try again."
                elif (( guess > target )); then
                    echo "Lower! Try again."
```

Understanding this, let's attempt the challenge.

# Method

We use the ssh command to connect to the provided port and address, inputting the provided password when prompted.

We can then begin guessing the number.

Upon guessing the right number, we get the flag.
