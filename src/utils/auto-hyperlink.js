/**
 * auto-hyperlink.js
 * Utility for automatically hyperlinking technical terms in writeup content
 */

// Dictionary of cybersecurity terms and their corresponding URLs
export const autoHyperlinkTerms = {
  // Web Security
  XSS: "https://owasp.org/www-community/attacks/xss/",
  CSRF: "https://owasp.org/www-community/attacks/csrf/",
  SQLi: "https://owasp.org/www-community/attacks/SQL_Injection",
  "SQL injection": "https://owasp.org/www-community/attacks/SQL_Injection",
  SSRF: "https://owasp.org/www-community/attacks/Server_Side_Request_Forgery",
  XXE: "https://owasp.org/www-community/vulnerabilities/XML_External_Entity_(XXE)_Processing",
  RCE: "https://owasp.org/www-community/attacks/rce/",
  SSTI: "https://portswigger.net/web-security/server-side-template-injection",
  CRLF: "https://www.invicti.com/learn/crlf-injection/",
  "DOM clobbering": "https://portswigger.net/web-security/dom-based/dom-clobbering",
  "Prototype pollution": "https://portswigger.net/web-security/prototype-pollution",

  // Binary Exploitation
  "Buffer Overflow":
    "https://owasp.org/www-community/vulnerabilities/Buffer_Overflow",
  ROP: "https://en.wikipedia.org/wiki/Return-oriented_programming",
  "Heap Exploitation": "https://en.wikipedia.org/wiki/Heap_overflow",

  // Cryptography
  RSA: "https://en.wikipedia.org/wiki/RSA_(cryptosystem)",
  AES: "https://en.wikipedia.org/wiki/Advanced_Encryption_Standard",
  ECB: "https://en.wikipedia.org/wiki/Block_cipher_mode_of_operation#Electronic_codebook_(ECB)",
  CBC: "https://en.wikipedia.org/wiki/Block_cipher_mode_of_operation#Cipher_block_chaining_(CBC)",

  // Reverse Engineering
  Ghidra: "https://ghidra-sre.org/",
  IDA: "https://hex-rays.com/ida-pro/",
  Radare2: "https://rada.re/n/",

  // Networking
  Wireshark: "https://www.wireshark.org/",
  Nmap: "https://nmap.org/",
  DNS: "https://en.wikipedia.org/wiki/Domain_Name_System",

  // CTF Categories
  Pwn: "https://ctf101.org/binary-exploitation/overview/",
  "Binary Exploitation": "https://ctf101.org/binary-exploitation/overview/",
  Crypto: "https://ctf101.org/cryptography/overview/",
  Cryptography: "https://ctf101.org/cryptography/overview/",
  Reversing: "https://ctf101.org/reverse-engineering/overview/",
  Rev: "https://ctf101.org/reverse-engineering/overview/",
  "Reverse Engineering": "https://ctf101.org/reverse-engineering/overview/",
  Web: "https://ctf101.org/web-exploitation/overview/",
  Forensics: "https://ctf101.org/forensics/overview/",
  Forens: "https://ctf101.org/forensics/overview/",
  OSINT: "https://en.wikipedia.org/wiki/Open-source_intelligence",
  Steganography: "https://en.wikipedia.org/wiki/Steganography",

  // Ciphers
  "Caeser Cipher": "https://www.dcode.fr/caesar-cipher",
  "ROT Cipher": "https://www.dcode.fr/rot-cipher",
  ROT8000: "https://www.dcode.fr/rot8000-cipher",

  //Windows
  DPAPI: "https://en.wikipedia.org/wiki/Data_Protection_API",
   /* TOOLS */
  // forens
  Autopsy: "https://www.autopsy.com/download/",
  Wireshark: "https://www.wireshark.org/download.html",
  exiftool: "https://github.com/exiftool/exiftool",
  tshark: "https://tshark.dev/setup/install/",
  MemProcFS: "https://github.com/ufrisk/MemProcFS",
  vol3: "https://github.com/volatilityfoundation/volatility3",
  volatility: "https://github.com/volatilityfoundation/volatility3",
  volatility3: "https://github.com/volatilityfoundation/volatility3",
  oletools: "https://github.com/decalage2/oletools",
  aperisolve: "https://aperisolve.com/",
  zsteg: "https://github.com/zed-0xff/zsteg",
  ericzimmerman: "https://ericzimmerman.github.io/#!index.md",
  evtxecmd: "https://github.com/EricZimmerman/evtx",

  //crypto
  CyberChef: "https://gchq.github.io/CyberChef/",
  "Dcode.fr": "https://www.dcode.fr/cipher-identifier",
  Dcode: "https://www.dcode.fr/cipher-identifier",

  //general
  PayloadAllTheThings: "https://github.com/swisskyrepo/PayloadsAllTheThings",
  SecLists: "https://github.com/danielmiessler/SecLists",
  "webhook.site": "https://webhook.site",
  netcat: "https://en.wikipedia.org/wiki/Netcat",
  nc: "https://en.wikipedia.org/wiki/Netcat",

  //hachcrack
  hashcat: "https://hashcat.net/hashcat/",
  johntheripper: "https://github.com/openwall/john",
  
  //pwn
  DetectItEasy: "https://github.com/horsicq/Detect-It-Easy",
  gdb: "https://en.wikipedia.org/wiki/GNU_Debugger",
  
  //rev
  dogbolt: "https://dogbolt.org/",

  //fullpwn/windows/stuff
  SQLCipher: "https://github.com/sqlcipher/sqlcipher",
  mimikatz: "https://github.com/ParrotSec/mimikatz",

  //web
  wappalyzer: "https://www.wappalyzer.com/",
  pwnfox: "https://github.com/yeswehack/PwnFox",
  "burp suite": "https://portswigger.net/burp",
  burpsuite: "https://portswigger.net/burp",
  "jwt.io": "https://jwt.io/",
  editthiscookie2: "https://addons.mozilla.org/en-US/firefox/addon/etc2/",
  jwt_tool: "https://github.com/ticarpi/jwt_tool",

  //osint
  gitfive: "https://github.com/mxrch/gitfive",
  ghunt: "https://github.com/mxrch/ghunt",

  // People
  sealldev: "https://seall.dev/",

  // Add more terms as needed
};

/**
 * Process the content to add auto-hyperlinks
 * This function is used in JavaScript to process content dynamically
 */
export function processAutoHyperlinks(content) {
  let processedContent = content;

  // Process each term in our dictionary
  for (const [term, url] of Object.entries(autoHyperlinkTerms)) {
    // Case insensitive replace with a word boundary check
    const regex = new RegExp(`\\b(${term})\\b`, "gi");
    processedContent = processedContent.replace(
      regex,
      `<a href="${url}" class="auto-hyperlink" title="${term}">$1</a>`,
    );
  }

  return processedContent;
}

/**
 * Extract tags from content
 * Identifies potential tags in the content that aren't in the tags array yet
 */
export function extractTagSuggestions(content, existingTags = []) {
  // Define term groups that should map to the same tag
  const tagMappings = {
    //privsec
    "privesc": "privilege-escalation",
    "privilege escalation": "privilege-escalation",
    "priv esc": "privilege-escalation",
    //racecond
    "race condition":"race-condition",
    //hashcrack
    hashcat: "hash-cracking",
    johntheripper: "hash-cracking",
    // command inj
    "command injection": "command-injection",
    "cmd injection": "command-injection",
    // jadx
    "jadx": "jadx",
    "jadx-gui": "jadx",
    //cache poisoning
    "cache poisoning": "cache-poisoning",
    "poison cache": "cache-poisoning",
    //auth bypass
    "authentication bypass": "authentication-bypass",
    //ssti
    ssti: "ssti",
    //protoptye
    "prototype pollution": "prototype-pollution",
    // Steganography variants
    stego: "steganography",
    steganography: "steganography",

    spectrogram: "spectrogram",

    // Buffer overflow variants
    bof: "buffer-overflow",
    "buffer overflow": "buffer-overflow",

    // Remote code execution
    rce: "remote-code-execution",
    "remote code execution": "remote-code-execution",

    // SQL injection
    sqli: "sql-injection",
    "sql injection": "sql-injection",

    // Cross-site scripting
    xss: "xss",
    "cross site scripting": "xss",

    // Dom clobber
    "dom clobbering": "dom-clobbering",

    // Cross-site request forgery
    csrf: "csrf",
    "cross site request forgery": "csrf",

    // XML External Entity
    xxe: "xxe",
    "xml external entity": "xxe",

    // Man in the middle
    mitm: "man-in-the-middle",
    "man in the middle": "man-in-the-middle",

    // Dictionary attack variations
    "dictionary attack": "dictionary-attack",
    wordlist: "dictionary-attack",

    // Shell-related
    revshell: "reverse-shell",
    "rev shell": "reverse-shell",
    "reverse shell": "reverse-shell",

    // Python jail
    pyjail: "python-jail",
    "python jail": "python-jail",
    "sandbox escape": "sandbox-escape",

    // Deserialization
    deserialization: "deserialization",
    pickle: "deserialization",

    // Authentication
    jwt: "jwt",
    "json web token": "jwt",

    // Format string
    "format string": "format-string",

    // Advanced attacks
    "padding oracle": "padding-oracle",
    "timing attack": "timing-attack",
    "side channel": "side-channel",

    // Brute force
    bruteforce: "brute-force",
    "brute force": "brute-force",
    "rainbow table": "rainbow-table",

    // Social engineering
    phishing: "phishing",

    // Metadata
    exiftool: "exif",
    exif: "exif",

    // Memory analysis
    "memory dump": "memory-forensics",
    "memory forensics": "memory-forensics",

    // Network analysis
    pcap: "network-forensics",
    pcapng: "network-forensics",
    wireshark: "network-forensics",

    // Tools
    ghidra: "ghidra",
    autopsy: "autopsy",
    cyberchef: "cyberchef",
    gdb: "gdb",
  };

  // List of all terms to search for
  const searchTerms = Object.keys(tagMappings);

  // Convert existingTags to lowercase for case-insensitive comparison
  const normalizedExistingTags = existingTags.map((tag) => tag.toLowerCase());

  // Store resolved tags
  const resolvedTags = new Set();

  // Check for each term in the content
  searchTerms.forEach((term) => {
    // Create regex with word boundaries
    const regex = new RegExp(`\\b${term}\\b`, "i");

    // If the term is found in the content
    if (regex.test(content)) {
      // Get the normalized tag for this term
      const normalizedTag = tagMappings[term.toLowerCase()];

      // Skip if the normalized tag is already in existing tags
      if (!normalizedExistingTags.includes(normalizedTag)) {
        resolvedTags.add(normalizedTag);
      }
    }
  });

  // Convert set to array
  return Array.from(resolvedTags);
}
