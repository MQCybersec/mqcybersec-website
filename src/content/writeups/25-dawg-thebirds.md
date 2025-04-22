---
title: "The Birds"
description: "You think you're being watched, and you see a suspicious flock of birds on the powerlines outside of your house each morning. You think the feds are trying to tell you something. Separate words with underscores and encase in DawgCTF{}. All lowercase."
pubDate: 2025-04-22
ctf: "DawgCTF"
category: "Cryptography"
author: "HulkOperator"
image: "./images/25-dawg/icon.png"
section: "CTFs"
---

## Challenge

The challenge provides us with an image of birds on a rope and asks us to decipher the message.
![Birds on a Rope](images/25-dawg/burb.png)

Reverse searching this image on Google mentions the **birds on a wire cipher**. This website can be used to encrypt and decrypt messages for this cipher https://www.dcode.fr/birds-on-a-wire-cipher.

Decrypting the ciphertext, we get the message: `THEREISNOESCAPE`

Flag: `DawgCTF{there_is_no_escape}`
