---
title: "Simon Says"
description: "Help me play this game of simon says - remember, the last 2 lights have been blue!"
pubDate: 2025-03-19
ctf: "Bronco CTF 2025"
category: "forensics"
author: "Ch1maera"
section: "CTFs"
image: "images/25-bronco/icon.png"

---

## Simon Says 

To start this challenge off, we are provided with the following image. 

![image of Simon Says Challenge](images/25-bronco/simonsays.png)

Personally, I love stego challenges, so the instant I saw the image, and the the fact that the challenge description referenced blue, I thought of the different colour channels used to make images. I then uploaded the challenge `.png` file to AperiSolve. After extracting the image found in the third blue channel, I found this: 

![image of Simon Says Challenge in Aperisolve](images/25-bronco/simonsayssteg.png)

That looks like the flag to me!

Flag: `bronco{simon_says_submit_this_flag}`