---
title: "Jokesmith"
description: "Test your comedy skills with my new AI powered chatbot!\n\n`nc connect.umbccd.net 20549`" 
pubDate: 2025-04-21
ctf: "DawgCTF 2025"
category: "cryptography"
author: "tulip"
section: "CTFs"
---

Let's see.

```
You think you're funny? I got a few jokes of my own, tell me a joke and I'll tell you mine
Tell me a joke: 2
Really? That's it? Come back with some better material
```

Rude. Anyways, let's see what's happening in `server.py`.

```py
def run():
    print("You think you're funny? I got a few jokes of my own, tell me a joke and I'll tell you mine")
    transcript = []
    for i in range(3):
        joke = input("Tell me a joke: ")
        joke = chr(1)
        funny = bytes_to_long(joke.encode()) % 2
        if (not funny):
            print("Really? That's it? Come back with some better material")
            exit()
        else:
            transcript.append(joke)
            print("Ha! That was pretty funny! Here's one of my own")
            print(hideFlag(jokes[i]))
            transcript.append(jokes[i])
    print("Here is our jokes! Show it to a friend to make them laugh! I better encrypt it though in case I said something private")

    m = "\n".join(transcript)
    
    p = getPrime(512)
    q = getPrime(512)
    N = p * q
    
    e = 3
    c = pow(bytes_to_long(m.encode()), e, N)
    print("c =", c)
    print("N =", N)
    print("e =", e)
```

So it seems the decimal representation of our message needs to be an odd number. This is easily achievable. Let's set up a `pwntools` script for this.
```py
HOST = "connect.umbccd.net"
PORT = 20549

context.log_level = "debug"

server = remote(HOST, PORT)

for _ in range(3):
    server.recvuntil(b"Tell me a joke: ")
    server.sendline(long_to_bytes(1))

for _ in range(3):
    trashcan = server.recvline()
```
We are sending the server the byte `0x01`, which is odd. So it will accept it.

```
Ha! That was pretty funny! Here's one of my own
Why did the CTF player cross the road? To get to the DawgCTF{XXXXXXXXXXXXXXXXXXXXXXXXXXXX}
Here is our jokes! Show it to a friend to make them laugh! I better encrypt it though in case I said something private
c = 8999097663210884343884119839124816861065737893292653100200626958612582048692109841547053357785668865880303486758872187554299320139641106702444994222023235186775713278525795797181200440189982942835407743478854789191076372702834557882683545950531787641698468465420442273704886320620885239453109190081199923605
N = 78050149450745978029752731096936956908160942828638722395082315708470313573878853896369664181354464073207459066711437948970083068837818625773597057850156466342478711033236607229267315041198876066289347575531464479667786555456400496251433793931287344708659164168209593098780684367366427374033024304962966614027
e = 3
```

One line in particular stands out.
```py
e = 3
```

Along with the `n`, `p` and `q` in the file, this implies RSA. And in the context of RSA, `e = 3` is very dangerous. However, let's go into some more of the workings.

The server "encrypts" the following list along with our jokes that we send to it (which again must be odd).
```py
jokes = [
    "Why did the prime break up with the modulus? Because it wasn't factoring in its feelings",
    "Why did the cryptographer bring RSA to the dance? Because it had great curves — wait, no, wrong cryptosystem",
    "Why did the CTF player cross the road? To get to the " + flag
]
```

The reason I say "encrypts" with quotations is because, this message is very large. If we assume the flag as `DawgCTF{XXXXXXXXXXXXXXXXXXXXXXXXXXXX}` and send the server the byte `0x01` everytime, we get the following message:
```
\x01\n
Why did the prime break up with the modulus? Because it wasn't factoring in its feelings\n
\x01\n
Why did the cryptographer bring RSA to the dance? Because it had great curves — wait, no, wrong cryptosystem\n
\x01\n
Why did the CTF player cross the road? To get to the DawgCTF{XXXXXXXXXXXXXXXXXXXXXXXXXXXX}
```
This has a massive bit length of 2361. The server is generating $p$ and $q$ at 512 bits each, which means a modulus of 1024 bits. But in RSA, the bit length of the message should always be **less** than the bit length of the modulus, otherwise data loss will occur.

### Håstad's Broadcast
So we need to find a way to reconstruct the message **cubed** (since the server sends us $m^3\pmod n$). There is a specific attack that targets this called **Håstad's Broadcast Attack**, where:
- The same message $m$ is sent to several recipients
- The message is encrypted under different, unique moduli. All moduli must be coprime to each other (very likely to happen in RSA)
- The message must be encrypted using the same public key
- Works best when the public key is small, such as $e = 3$
- No padding scheme

This attack utilises the **Chinese Remainder Theorem** (CRT), which states that if you have a series of congruences:
\\[r \equiv s_1 \pmod {n_1}\\]
\\[r \equiv s_2 \pmod {n_2}\\]
\\[ \vdots \\]
\\[r \equiv s_k \pmod {n_k}\\]

...and the set $\[ n_1, n_2, \ldots , n_k \]$ are all **pairwise coprime** (every number is coprime to each other), then there exists a unique solution $X \pmod{\mathcal N}$ where $\mathcal N$ is the product of all $n$ (or you can say $\mathcal N = \displaystyle\prod_{i=1}^kn_i$) that satifies all the congruences. 
\\[ m^e \equiv X \pmod {\mathcal N} \\]

But.... so what?? Well, remember how we said that this attack works best when $e$ is small? This comes down to the fact that for any number $a$ mod $n$:
\\[ a = a \mod n\\]

...if $a < n$. So if we can find a modulus $\mathcal N$ that is larger than $m^3$, than we can directly compute the **integer cube root** of $X$ to retrieve $m$, which is much much easier than any other method. So the logical next step, let's see how many moduli we need to take. To do this, remember the modulus $\mathcal N$ must be larger than the bit length of $m^3$. We can compute this in python.

```py
known = b"\x01\nWhy did the prime break up with the modulus? Because it wasn't factoring in its feelings\n\x01\nWhy did the cryptographer bring RSA to the dance? Because it had great curves \xe2\x80\x94 wait, no, wrong cryptosystem\n\x01\nWhy did the CTF player cross the road? To get to the DawgCTF{XXXXXXXXXXXXXXXXXXXXXXXXXXXX}"
# 7081
print((int.from_bytes(known, "big")**3).bit_length())
```

So we need a modulus larger than 7081 bits. This means combining at least 7 moduli. So we can fetch 7 cipher-modulus pairs from the server and combine them to carry out Håstad's attack. Now in the real world, if you wanted to carry out this attack, the combined modulus $\mathcal N$ must be larger than $m^e$ which could be unimaginably huge, with the common $e = 65537$. This is why this is only feasible for small values of $e$. 

Actually computing the unique solution would take eons by hand. Thankfully we can use python's `sympy` library to do it for us.

```py
from Crypto.Util.number import long_to_bytes
from sympy.ntheory.modular import crt
from gmpy2 import iroot

C = [
    7832469328406627034673192693026902005159742029515121067314652855181413851198506287164483026511056985980859118250470464037568842876402749675405325062483720736344451843065991128112443546969000996201889576500628624898756650874736320570202967346402799860264846024361447970990860912175748377836647334303985398545,
    73339511884650628265396256322801744010132676573629009245851948875839632246582392255638866906866681521287751647561191702408568592732024195105330425006487925590190553527284076893428497497495163239342899746986221352163081335901903012794975175698306860995878357254019808321598474021978859330027966834267343261723,
    142856257298089465903257026805750559402996294590241765841895314877805272248096898955285312790766997182184746623209523799270861457515885932497602611369982096433303174148866783559093101769824259613598969575658709207559395913216377934675485872513509898506184664142184353774279837353934446586513738978326995774389,
    113385209863402565083406699306135346421821670840474378124297553514706598767833569137438886180165601402442537324078169988850881951176878276034092597105736353180754190276172693704346920023700228750510098008525914085779714432531628498707385379932731435954270430517323924472103424953138849237974851324843023472123,
    46721744624981099293032268597032590664971576557900305795916661673354492246423824911591974837420943419768687980372503035002935630203170836445195927255855169594581007091063328783362568659179025202641255693393107191051176972361676551274181117996042316650811845389052191440791657474930261443910981912585434385546,
    58862942554374721834159899825539673558170349569653734084354900888517413756844829706992911347924693616386860684964524012978860832206005509122318467666897527194484605635949188941221246635018372659688402971642804762213925160172286722079193211306168444044214856516662315669488621578525445013101253749116378425972,
    148739584928402381866534726163567530646611527586456223818505743572599751197825679924624166065382462264637622619515544876254003602649861741208540350383862971229408505041152851548970770964350255316293171423300432319188183279171825648352660760307955957776173955572134309505423115538147678897995697088903536426964,
    117222558904037067762434419344877835903102234545703414830759576282982834927486002175132502651055093622400841875850847922587652947410123443314454412124069779193834015012962555365402082248013767139445338283943606621985028043110544921584074789740135449730369010814621074853062224207580670684045965491086064023098
]

e = 3

N = [
    123792291025027820121506198630739348622296310655411905957446959791357069283595601810769295696478006638983671098903870935080243670238015216570236438917626956171895084497560910548179566943681714134441709434649511684842583636627527355853972140046376968009281926380164517226487312986629495583367675649583321416909,
    86530876740898592701671572085673622141465091577234844939925569882528647987834754925110966326611483784626742191551827781983638057185287590711958639606151715810561090860437684039695695293373377238957666180997410356172352672324592725797004810273530301876322993459400081237739236266268386991650680259107879620897,
    153621315836442464539719525203825249813709534888049156563268978282109631604461252915690303829118354058671827958918011922369479827310545333436704429390939003626324704509317605597881700211524837784063363050689211154929713618046693102034880553906060436485082604963255117740622576023788476750939192288259366280761,
    120242569325230267287606068345113934183069896948156126979165591937180756055832401600325519043616203208567688884719395495122361270810833630710274665868859140307490721052620428100841326843856065583219418424722932086329220934290528896313091564397273170397641643591110357756108343954220919144304729147908366409559,
    57175435363704462334233951415530285266714669281264974019942645812547370543212766110355814826668213968879741207141512035421278118563243999909612791505001932645125049301112634778689093596316445600603354867066385850240932470706423395553452203602725433654685243073068915691311465041976646078663298950122851068259,
    71785413226873472872049802961290292761470655268923698440080144705504819091694228337083649295988037584393747916380999366632788190312157211096032600223674850383892352089441569901793174659601473660458964468095042633151228447045363936208248803138596354509033590224154446917198371750588282993111370577978306525141,
    157343457371558190346939758900695220706834650686180711722345527370955506557576041394791162334222672383241417145024556369698307196571946654870896357095320449748319961182866596187919810110613489809469995183978078936477953910920334471335644515819833916795340122886761124396393530409190660731236365298436053550671,
    155708026126218247496723166112976835846650236332630758619386220173898218316191222054612149596209739798520416646571572362675942871900992628579733311611987852628196842144464481002881069005723186032082035770883915771177605386994506336163534012507224487760753832640482654167818314594179954848516120731953023902771
]

m3, mod_product = crt(N, C)
m, exact = iroot(m3, e)

if exact:
    print(f"Recovered message: {long_to_bytes(m).decode()}")
else:
    print("Failed to get exact cube root, more ciphertext modulus pairs needed.")
```

```
$ python hastad.py
Recovered message: Why did the prime break up with the modulus? Because it wasn't factoring in its feelings

Why did the cryptographer bring RSA to the dance? Because it had great curves — wait, no, wrong cryptosystem

Why did the CTF player cross the road? To get to the DawgCTF{h4h4h4h4_s0_funny!!!!!!!!!!!}
```

Flag: `DawgCTF{h4h4h4h4_s0_funny!!!!!!!!!!!}`