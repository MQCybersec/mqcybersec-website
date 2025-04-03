---
title: Redaction gone wrong
description: "Now you DON’T see me.
This report has some critical data in it, some of which have been redacted correctly, while some were not. Can you find an important key that was not redacted properly?"
pubDate: 2025-04-03
ctf: PicoCTF
category: forensics
author: Tenzin
section: CTFs
image:
---
With the challenge file provided within the [chal](https://play.picoctf.org/practice/challenge/290?page=1&search=Reda), downloading shows a pdf file named "Financial_Report_for_ABC_Labs.pdf". 
Upon opening the file, it displays a short report with certain parts of the text dark overlayed/redacted.
As a pdf file where the text upon the screen is expected to be readable, copying the entire text using `ctrl + A`, and pasting `ctrl + V` in another text box, the following text can be seen, which captures the flag.
```
Financial Report for ABC Labs, Kigali, Rwanda for the year 2021. Breakdown - Just painted over in MS word. Cost Benefit Analysis Credit Debit This is not the flag, keep looking Expenses from the picoCTF{C4n_Y0u_S33_m3_fully} Redacted document.
```