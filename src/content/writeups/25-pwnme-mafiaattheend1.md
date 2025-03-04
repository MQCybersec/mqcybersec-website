---
title: "Mafia at the End 1"
description: "You're an agent, your unit recently intercepted a mob discussion about an event that's going to take place on August 8, 2024. You already know the location, though. A password for the event was mentioned. Your job is to find it and return it so that an agent can go to the scene and collect evidence. Note : The contract is deployed on sepolia network "

pubdate: 2025-03-04
ctf: "PwnMeCTF 2025"
category: "misc"
author: "Ch1maera & sealldev"
section: "CTFs"
---

We are provided with a packet capture that contains a range of protocols used for internet communication. Looking through some of the protocols, we can see an IRC protocol. Initially I had just filtered the files in WireShark, but my teammate, seal, came up with a much better solution - a tshark command that just pulled out all the IRC protocol packets: 

```tshark -r darknetmafia_prologue.pcapng -Y "irc" -T fields -e frame.number -e frame.time -e ip.src -e ip.dst -e irc.request -e irc.response -e data.text```

This reveals a few things: 

1. A base64 encrypted link (it was a RickRoll, and yes I fell for it).
2. A shorturl link to the chat messages sent on telegram, as mentioned in the messages captured on the pcap.
3. Two addresses to online crypto transactions:
   1. 0xCAB0b02864288a9cFbbd3d004570FEdE2faad8F8.
   2. 0x69E881DB5160cc5543b544603b04908cac649D38.

Going online, we can find a lookup service for the Sepolia network, which allows us to view the transactions made at these addresses. 

My teammate solved the rest of the challenge, so the below is a recount of their actions. 

My teammate, seal, looked up these transaction addresses on the Sepolia network. 

The first address rendered a fake flag, which had the PWNME{} format, but contained another address. In looking up the new address, it led back to the initial fake PWNME{} flag. 

After looking at the second address, we can see that multiple transactions have occurred, but, if we look at the transaction from 4 days ago, and go to more details, and view the input as UTF-8, we find the flag!

Flag: `PWNME{1ls_0nt_t0vt_Sh4ke_dz8a4q6}`