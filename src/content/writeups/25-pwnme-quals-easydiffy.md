---
title: "Key Exchange"
description: "Someone wants to send you a message. But they want something from you first."
pubDate: 2025-03-04
ctf: "KashiCTF 2025"
category: "cryptography"
author: "tulip"
section: "CTFs"
---

# Key Exchange - Cryptography

We are given a server file `server.py`. In the file, we can see an elliptic curve being used to generate a public key, and the private key is a random integer.

The server sends us this public key that was generated $(kG)$, where $G$ is the generator point. $k$ is this random integer generated. 

The server then asks for an $(x,y)$ coordinate on the plane.

```py
try:
    # P_B_x and P_B_y are the x and y coordinates we sent.
    # If P_B_x and P_B_y do not lie on the curve defined by the parameters
    # above, E.point(P_B_x, P_B_y) will fail. So our points must lie on 
    # the curve.
    P_B = E.point(P_B_x, P_B_y)
except:
    EXIT()
```

This $(x,y)$ that we send it is then multiplied by the same $k$ used to generate the public key, and then the $x$ coordinate of this point is used to AES encrypt some data to us. So if we know $k$, we should be able to solve for the this key, right?

The problem with finding $k$ is that $k$ is computationally very infeasible to find. Likewise to how RSA's modulus $n$ is hard to factorise into $p$ and $q$, finding $k$ given the public key $kG$ and the generator point $G$ is hard for an elliptic curve (Search the [discrete logarithm problem](https://enigbe.medium.com/about-elliptic-curves-and-dlp-ed76c5e27497) if you want to look into it more). So finding $k$ is not an option.

Let $P_A$ be the public key $(x,y)$ or $kG$, $P_B$ be the coordinates we send, and $k$ the private key.

Here a snippet of code from `server.py`:

```py
#Curve Parameters (NIST P-384)
p = 3940200619639447921227904010014361380579739270465446667948293404245721771496870329047266088258938001861606973112319
a = -3
b = 27580193559959705877849011840389048093056905856361568521428707301988689241309860865136260764883745107765439761230575
E = EllipticCurve(p,a,b)
G = E.point(26247035095799689268623156744566981891852923491109213387815615900925518854738050089022388053975719786650872476732087,8325710961489029985546751289520108179287853048861315594709205902480503199884419224438643760392947333078086511627871)

print(G)

n_A = random.randint(2, p-1) # n_A is k in our scenario
P_A = n_A * G

# ... lines between ...

S = n_A * P_B # n_A is the random integer k, P_B is our point

print(f"\nReceived from Weierstrass:")
print(f"   Message: {encrypt_flag(S.x)}")
```

The server uses the same $k$ to encrypt data and send to us after we give it a point on the curve $P_B$. So the data is encrypted with $(kP_{B})$'s $x$ coordinate. However, $P_B$ can be *any* point that lies on the curve. Since $P_A = kG$, and we know the generator point $G$ definitely lies on the curve, we can just send the server the coordinates of $G$, and the server will send us $kG$, which is the same coordinate as the public key sent to us.

Thus the server will AES encrypt using $(kP_B)_x = (kG)_x = (P_A)_x$. The server then sends us a JSON object containing the IV and ciphertext, with the key that we now know since it is the $x$ coordinate of the public key.

```json
{
    "iv": "f7fd4727fe72241e1d986f248edef684",
    "ciphertext": "ca80db182d37545ae75be56612c545bea0dfb331e5aaf3044fe13cc7791252ad79748f8bba7860e48527720c6d1b86ed2bf0e00ddd2e0661493856bd2d80d6ccf13e7bae217f0ead1b06cc8c522d191880d35e884a539302bae99a44f201f418"
}
```

The key used is actually the first 16 bytes of the sha1 digest of our key $(P_A)_x$, so we can create a quick script to implement this in python.

```py
def decrypt_flag(shared_secret: int, encrypted_data: str):
    sha1 = hashlib.sha1()
    sha1.update(str(shared_secret).encode("ascii"))
    key = sha1.digest()[:16]

    data = json.loads(encrypted_data)
    iv = bytes.fromhex(data["iv"])
    ciphertext = bytes.fromhex(data["ciphertext"])

    cipher = AES.new(key, AES.MODE_CBC, iv)
    plain = unpad(cipher.decrypt(ciphertext), 16)

    return plain.decode("utf-8")
```

```
$ python3.9 decrypt.py
Decrypted Flag: NaeusGRX{L_r3H3Nv3h_kq_Sun1Vm_O3w_4fg_4lx_1_t0d_a4q_lk1s_X0hcc_Dd4J_fvjBIYJr}

Hint: DamnKeys
```

So it's still encrypted, but with a weak cipher and a given key. The curly braces and the underscores are left untouched, which tells us that this is probably a caesar or vigenere or alike cipher. Plugging it into a vigenere decoder with the key `DamnKeys`, we get the flag:

```
KashiCTF{I_r3V3Al3d_my_Pub1Ic_K3y_4nd_4ll_1_g0t_w4s_th1s_L0usy_Fl4G_fjwREARo}
```
