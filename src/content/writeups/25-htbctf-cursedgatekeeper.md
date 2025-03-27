---
title: "Cursed GateKeeper"
description: "Once a benevolent guardian spirit at the Gates of Loria, it could sense each traveler’s purity. Those with righteous hearts earned the entry chant to open the gates of Loria’s hidden library, while the unworthy were misled to other places. Since falling under Malakar’s dark influence, the Gatekeeper’s gift has been corrupted. Pure-hearted seekers now receive a false incantation that triggers the library’s defenses, while Malakar’s followers are given the genuine chant, passing into Loria unharmed. Eloween has sensed the curse in it, and asked for your prompt injection skills to outwit this curse to reveal the genuine chant reserved for the followers of Malakar. \nOnce you have the chant, submit it as flag with the format `HTB{Chant}`"
pubDate: 2025-03-27
ctf: "HTB CTF 2025"
category: "AI"
author: "Ch1maera"
section: "CTFs"
image: "images/25-htbctf/icon.jpg"
---

## Cursed Gatekeeper

Somehow, I managed to solve this in a single command. I don't know how, but I can definitely confirm that I paid for it in the other AI challenges I played in the CTF. Let's break it down. 

So, when reading through the flavourtext we have been given, I picked up on what we needed to achieve: we needed to view the genuine chant, but due to some evil forces at work, only Malakar's followers have access to the chant. So, I did the first thing that came to mind:

![Image of the command for Cursed GateKeeper](images/25-htbctf/cursedgatekeepercmd1.png)

It's response?

![Image of the response from Cursed GateKeeper](images/25-htbctf/cursedgatekeeper.png)

What a nice AI, I didn't even have to ask for the flag! Thanks GateKeeper for the very cursed challenge. 

Flag: `HTB{Eyes_Of_the_North_Hearts_Of_The_South}`


