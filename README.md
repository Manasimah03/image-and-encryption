# 🔐 AES Image Encryption & Secure QR Transmission

**Encrypt an image with AES-256, share it offline as QR codes, then decrypt it and verify nothing changed.**

Python · AES-256-CBC · OpenCV · Oct 2024 – Dec 2024

---

## What it does

1. **Encrypt**: image bytes are encrypted with AES-256-CBC (PKCS#7 padding) using a fresh random IV for every transmission.
2. **Encode**: the encrypted payload is converted into QR codes, so it can be shared offline (print, screen, camera).
3. **Decode and decrypt**: QR codes are scanned with OpenCV and the image is decrypted.
4. **Verify**: a SHA-256 hash of the recovered image is compared against the original hash to confirm integrity.

## Flow

```
Image → AES-256-CBC encrypt (random IV) → QR code(s)
                                              │  (offline transfer)
                                              ▼
Verified image ← SHA-256 check ← AES decrypt ← QR scan (OpenCV)
```

## Security design

| Feature | Detail |
|---------|--------|
| Cipher | AES-256, CBC mode |
| Padding | PKCS#7 |
| IV | New random 16-byte IV per transmission, sent with the ciphertext |
| Integrity | SHA-256 hash comparison after decryption |
| Transport | QR codes (no network needed) |

## Quick start

```bash
git clone https://github.com/Manasimah03/<repo-name>.git
cd <repo-name>
pip install -r requirements.txt

# Encrypt image -> QR codes
python encrypt.py --input photo.png --key <your-key>

# Scan QR codes -> decrypt + verify
python decrypt.py --qr qr_output/ --key <your-key>
```

## Project structure

```
├── encrypt.py      # AES encryption + QR generation
├── decrypt.py      # QR scanning + decryption + hash check
├── requirements.txt
└── README.md
```

## Limitations & roadmap

- [ ] Move from CBC to **AES-GCM** (adds built-in authentication; CBC alone doesn't detect tampering)
- [ ] Derive the key from a passphrase with PBKDF2 or scrypt instead of using raw key input
- [ ] Split large images across multiple QR codes (a single QR holds under ~3 KB)
- [ ] Add a CLI progress bar and error handling for bad scans
- [ ] Unit tests: round-trip encrypt/decrypt, wrong key, corrupted QR

> ⚠️ Educational project. Not audited for production use.

## Author

**Manasi** · [GitHub](https://github.com/Manasimah03) · [LinkedIn](https://linkedin.com/in/manasi-mahesh-b9a217253)
