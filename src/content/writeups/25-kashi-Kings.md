---
title: "Kings"
description: "Did you know the cosmic weapons like this? I found similar example of such weapons on the net and it was even weirder. This ruler's court artist once drew the most accurate painting of a now extinct bird. Can you tell me the coordinates upto 4 decimal places of the place where this painting is right now. Flag Format: `KashiCTF{XX.XXXX_YY.YYYY}`"
pubDate: 2025-03-27
ctf: "KashiCTF 2025"
category: "osint"
author: "Tenzin"
section: "CTFs"
image: "images/25-kashi/icon.png"
---

This challenge was a bit of back and forth since the king found was incorrect, whom was King Tutankhamun. There was no court painter who was in relation to king tut, which cause some time wasted for discovery of the ruler's painter.
Upon ticketing with the admin, they pointed out another king as the candidate since the title had pluralised the amount of king. 
Upon looking for another king whom also hold meteoric iron dagger through the use of gpt, and prompting `which kings owned meteoric iron dagger other than king tut?`, the Emperor Jahangir (Mughal Empire, 17th century CE) came to be the result. 
Upon finding out the ruler, looking out for the court ruler's painter by searching `Emperor Jahangir court ruler's painter`, gave the following name:
```
Ustad Mansur, Abdul Hassan, Farukh Beg, Murad, Madhav
```
From the five name, Ustad Mansur stood out the most, as the drawing of Dodo was widely popular and accurately drawn as few result has shown, while also extinct as pointed out from the challenge description! One being an article by Rana Safvi titled [Ustad Mansur- Emperor Jehangir’s Master Painter](https://ranasafvi.com/ustad-mansur-emperor-jehangirs-master-painter/). 
Checking the discussion by the team also pointed to Ustad Mansur and his popular painting of extinct Dodo.
Finding out the location of the painting, it pointed to Hermitage Museum in Saint Petersburg, which the coordinate from the google map was attempted as the flag several time, to no avail to be inaccurate. This stumped the findings as result appeared correct. Creating a ticket and doing a flag sanitisation, the final, fourth decimal point was off, which was fixed, and flag was ultimately captured.
`KashiCTF{59.9399_30.3149}`