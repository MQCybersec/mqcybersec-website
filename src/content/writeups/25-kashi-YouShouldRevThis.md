---
title: "You Should Rev This"
description: "- Did you know that the x86 mov instruction is turing complete? Chal file provided"
pubDate: 2025-03-27
ctf: "KashiCTF 2025"
category: "rev"
author: "Tenzin"
section: "CTFs"
image: "images/25-kashi/icon.png"
---

Running `file` command on the file shows the file to be an ELF 32 bit LSB executable:
```
$ file chal
chal: ELF 32-bit LSB executable, Intel 80386, version 1 (SYSV), dynamically linked, interpreter /lib/ld-linux.so.2, not stripped
```
Running `strings` on the file provides a huge chunk of data, while passing through `head chal` prints the displays 
```
              8&6FVfv���/flag.txtnope
Got input: '%s'
Enter the password: e1n5tds4bu4et1n4ui2oh2ou4s4tu2oerror 
```
This text after password particularly stood out, and initating suffering to connect to the machine through netcat request password, which points out the text above to part of the password.
```
$ nc kashictf.iitbhucybersec.in 19787
Enter the password:
```
Upon opening the file within ghidra, and viewing the decompiled main, it can be seen that the text above goes through a number of transformation
```
  *(char **)(&sel_data)[on] = s_e1n5tds4bu4et1n4ui2oh2ou4s4tu2o_08050076;
  stack_temp = s_Enter_the_password:_08050061;
  *(undefined4 *)(&sel_data)[on] = *(undefined4 *)(sp + -0x200068);
  *(char **)(&sel_data)[on] = stack_temp;
  stack_temp = (char *)CONCAT22((short)*(undefined4 *)
                                        ((&alu_add16)
                                         [*(int *)(PTR_alu_add16_34820_08085fb0 + 0x20000)] +
                                        (*(uint *)(&alu_add16)[*(int *)PTR_alu_add16_48410_08093408 ]
                                        >> 0x10) * 4),
                                (short)*(uint *)(&alu_add16)[*(int *)PTR_alu_add16_48410_08093408] );
  *(undefined4 *)(&sel_data)[on] = *(undefined4 *)(sp + -0x200068);
  *(char **)(&sel_data)[on] = stack_temp;
  *(undefined4 *)(&sel_data)[on] = *(undefined4 *)(sp + -0x200060);
  *(undefined4 *)(&sel_data)[on] = *(undefined4 *)(sp + -0x200060);
  stack_temp = *(char **)(&sel_data)[on];
```
To avoid the need to fully understand the transformation, I passed the text within cyberchef and attempted a number of recipes. Passing through different base values, and ROT13 bruteforce, until coming across ROT47 bruteforce with the value 93, the text stood out as seenable below:
```
Amount = 91: p\b.k2qap1_r1bq.k1rf/le/lr1p1qr/l\-5-2--43
Amount = 92: q]c/l3rbq2`s2cr/l2sg0mf0ms2q2rs0m].6.3..54
Amount = 93: r^d0m4scr3at3ds0m3th1ng1nt3r3st1n^/7/4//65
```
As seen from the text, the `d0m4scr3at3ds0m3th1ng1nt3r3st1n` is sensible as a password. Passing the text as a password ultimately captured the flag.
```
$ nc kashictf.iitbhucybersec.in 19787
Enter the password: d0m4scr3at3ds0m3th1ng1nt3r3st1n
d0m4scr3at3ds0m3th1ng1nt3r3st1n
Got input: 'd0m4scr3at3ds0m3th1ng1nt3r3st1n'
KashiCTF{d1d_y0u_r3v_17_LByDG02ak}
```
It can be concluded that the transformation was a ROT47 with a value of 47.