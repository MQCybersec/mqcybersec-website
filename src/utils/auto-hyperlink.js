/**
 * auto-hyperlink.js - Fixed version
 * Utility for automatically hyperlinking technical terms in writeup content 
 * and showing tool modals for specific tools
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
  Wireshark: "TOOL:wireshark",
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
  
  /* TOOLS - These will use the modal instead of external links */
  /* These are marked with a special prefix 'TOOL:' */
  // forens
  Autopsy: "TOOL:autopsy",
  Wireshark: "TOOL:wireshark",
  exiftool: "TOOL:exiftool",
  tshark: "TOOL:tshark",
  MemProcFS: "TOOL:memprocfs",
  vol3: "TOOL:volatility3",
  volatility: "TOOL:volatility3",
  volatility3: "TOOL:volatility3",
  oletools: "TOOL:oletools",
  aperisolve: "TOOL:aperisolve",
  zsteg: "TOOL:zsteg",
  ericzimmerman: "https://ericzimmerman.github.io/#!index.md",
  evtxecmd: "TOOL:evtxecmd",

  //crypto
  CyberChef: "TOOL:cyberchef",
  "Dcode.fr": "TOOL:dcode",
  Dcode: "TOOL:dcode",

  //general
  PayloadAllTheThings: "TOOL:payloadallthethings",
  SecLists: "TOOL:seclists",
  "webhook.site": "TOOL:webhooksite",
  netcat: "TOOL:netcat",
  nc: "TOOL:netcat",

  //hachcrack
  hashcat: "TOOL:hashcat",
  johntheripper: "TOOL:johntheripper",
  
  //pwn
  DetectItEasy: "TOOL:detectiteasy",
  gdb: "TOOL:gdb",
  
  //rev
  dogbolt: "TOOL:dogbolt",

  //fullpwn/windows/stuff
  SQLCipher: "https://github.com/sqlcipher/sqlcipher",
  mimikatz: "TOOL:mimikatz",

  //web
  wappalyzer: "TOOL:wappalyzer",
  pwnfox: "TOOL:pwnfox",
  "burp suite": "TOOL:burpsuite",
  burpsuite: "TOOL:burpsuite",
  "jwt.io": "TOOL:jwtio",
  editthiscookie2: "TOOL:editthiscookie2",
  jwt_tool: "TOOL:jwt_tool",

  //osint
  gitfive: "TOOL:gitfive",
  ghunt: "TOOL:ghunt",

  // People
  sealldev: "https://seall.dev/",

  // Add more terms as needed
};

// Mapping for tool slugs to make sure we use the correct IDs
export const toolSlugMap = {
  autopsy: "autopsy",
  wireshark: "wireshark",
  exiftool: "exiftool",
  tshark: "tshark",
  memprocfs: "memprocfs",
  volatility3: "volatility3",
  oletools: "oletools",
  aperisolve: "aperisolve",
  zsteg: "zsteg",
  ericzimmerman: "ericzimmerman",
  evtxecmd: "evtxecmd",
  cyberchef: "cyberchef",
  dcode: "dcode",
  payloadallthethings: "payloadallthethings",
  seclists: "seclists",
  webhooksite: "webhooksite",
  netcat: "netcat",
  hashcat: "hashcat",
  johntheripper: "johntheripper",
  detectiteasy: "detectiteasy",
  gdb: "gdb",
  dogbolt: "dogbolt",
  sqlcipher: "sqlcipher",
  mimikatz: "mimikatz",
  wappalyzer: "wappalyzer",
  pwnfox: "pwnfox",
  burpsuite: "burpsuite",
  jwtio: "jwtio",
  editthiscookie2: "editthiscookie2",
  jwt_tool: "jwt_tool",
  gitfive: "gitfive",
  ghunt: "ghunt",
  // Add mappings for all your tools
};

/**
 * Process the content to add auto-hyperlinks and tool modals
 * This function is used in JavaScript to process content dynamically
 */
export function processAutoHyperlinks(content) {
  let processedContent = content;

  // Process each term in our dictionary
  for (const [term, url] of Object.entries(autoHyperlinkTerms)) {
    // Case insensitive replace with a word boundary check
    const regex = new RegExp(`\\b(${term})\\b`, "gi");
    
    // Check if this is a tool that should open a modal
    if (url.startsWith("TOOL:")) {
      const toolSlug = url.replace("TOOL:", "");
      processedContent = processedContent.replace(
        regex,
        `<span class="tool-modal-trigger cursor-pointer text-primary underline" data-tool-slug="${toolSlug}">$1</span>`
      );
    } else {
      // Regular hyperlink
      processedContent = processedContent.replace(
        regex,
        `<a href="${url}" class="auto-hyperlink" title="${term}">$1</a>`
      );
    }
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
    // privsec
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

// Export all functions directly to ensure they're available
export default {
  autoHyperlinkTerms,
  toolSlugMap,
  processAutoHyperlinks,
  extractTagSuggestions
};