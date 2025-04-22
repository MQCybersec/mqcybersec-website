---
title: "My Cat Trashed My File!"
description: "I had a super important file open in my editor when my cat decided to take a stroll across my keyboard. He managed to smash a bunch of keys, and now the file looks like digital spaghetti. Fortunately, I had a chat with the little troublemaker and got a full confession for exactly which keys he pressed. If you can help me recover the file, I’ll be eternally grateful (and so will my cat, who’s currently on thin ice)!"
pubDate: 2025-04-22
ctf: "DawgCTF"
category: "Misc"
author: "HulkOperator"
image: "./images/25-dawg/icon.png"
section: "CTFs"
---

Taking a look at the cat's confession, these keystrokes appear to be Vim commands. 
```
gg07lDjp0lDjp04lDjp04lDjp07lDjp05lDjp02lDjp03lDjp01lDjp02lDjpgg04x2jp:5<Enter>$4hDGkP:7<Enter>ddpggjddjlp
```

And the resulting output of the file is
```
CTF
pDawgAws
ibiL
{
it
r3_m3
V3l
0w
0
i3s_aus
}

```

Reversing these commands seemed trickier. So, I decided to take a sample flag, follow these commands to get the spaghetti output, and reverse it while mimicking the steps with the challenge's output. 
Taking the flag `DawgCTF{this_is_a_test_flag_12345678}` with the same length and following the vim commands, we get
```
CTF
tDawghis
_is_
{
a_
flag_
345
12
6
test_78
}
```

Since we know the input and output, we can easily reverse this and the original text.

Flag: `DawgCTF{pAwsibiLiti3s_ar3_m30wV3l0us}`
