---
title: "Bridget Lives"
description: "After dropping numerous 0days last year Bridget has flown the coop. This is the last picture she posted before going dark. Where was this photo taken from? NOTE: Flag is case-insensitive and requires placing inside 'DUCTF{}'! e.g. 'DUCTF{name_of_building}'"
pubDate: 2024-07-10
ctf: "DownUnderCTF 2024"
category: "osint"
author: "sealldev"
section: "CTFs"
image: "images/24-downunder/icon.png"
---

> Original Writeup on [seall.dev](https://seall.dev/posts/downunderctf2024#bridget-lives)

We are supplied a `bridget.png`.

![bridget.png](images/24-downunder/bridget.png)

Due to the unique shape of the bridge I put it into Google Images. After some scrolling and some similar-ish bridges but a different background, I find a match.

![robertsonbridge](images/24-downunder/robertsonbridge.png)

The Robertson Bridge, Singapore is the one!

![gmapsbridget](images/24-downunder/gmapsbridget.png)

We can see the circle foyer in the background of the original image, meaning the photo had to be taken from **Four Points**.

Flag: `DUCTF{four_points}`