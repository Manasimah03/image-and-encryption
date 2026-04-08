import { useState, useRef } from 'react';
import { RefreshCw, UploadCloud, Copy, CheckCircle2, QrCode, Lock } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { fileToBase64, generateKey, encryptAndStore } from '../lib/crypto';
import './components.css';

export default function Encryptor() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [secret, setSecret] = useState('');
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [shareId, setShareId] = useState('');
  const [copied, setCopied] = useState(false);

  const fileInputRef = useRef(null);

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      const url = URL.createObjectURL(f);
      setPreview(url);
    }
  };

  const doGenerateKey = () => {
    setSecret(generateKey(16));
  };

  const handleEncrypt = async () => {
    if (!file || !secret) return;
    setIsEncrypting(true);
    try {
      const base64 = await fileToBase64(file);
      const sid = await encryptAndStore(base64, secret);
      setShareId(sid);
    } catch (err) {
      console.error(err);
      alert('Encryption failed. See console.');
    }
    setIsEncrypting(false);
  };

  const copyId = () => {
    navigator.clipboard.writeText(shareId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (shareId) {
    return (
      <div className="glass-panel p-6 text-center">
        <div className="mb-4 text-success flex justify-center">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-xl font-semibold mb-2">Encrypted Successfully</h2>
        <p className="text-secondary mb-6">Scan the QR code or copy the Share ID.</p>
        
        <div className="qr-container bg-white p-4 rounded-xl inline-block mb-6 shadow-glow">
          <QRCodeSVG value={shareId} size={200} level="H" />
        </div>

        <div className="bg-dark p-3 rounded flex items-center justify-between border border-active">
          <span className="font-mono text-cyan truncate text-left">{shareId}</span>
          <button onClick={copyId} className="btn-icon" title="Copy ID">
            {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
          </button>
        </div>

        <div className="mt-4 p-4 border border-active rounded bg-dark text-left">
          <div className="text-xs text-secondary mb-1">Your decryption key is:</div>
          <div className="font-mono text-white break-all">{secret}</div>
          <div className="text-xs text-error mt-2">Save this key securely! You cannot recover the image without it.</div>
        </div>

        <button 
          className="btn-primary w-full mt-6"
          onClick={() => { setShareId(''); setFile(null); setPreview(''); setSecret(''); }}
        >
          Encrypt Another Image
        </button>
      </div>
    );
  }

  return (
    <div className="glass-panel p-6">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <Lock size={20} className="text-cyan" /> Secure Encryption
      </h2>

      <div 
        className={`upload-area ${preview ? 'has-image' : ''}`}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFile} 
          accept="image/*" 
        />
        {preview ? (
          <img src={preview} alt="Preview" className="upload-preview" />
        ) : (
          <div className="upload-placeholder">
            <UploadCloud size={40} className="mb-2 text-secondary" />
            <p>Click or drag to upload image</p>
          </div>
        )}
      </div>

      <div className="mt-6 mb-2 text-sm text-secondary">Encryption Key (Min 16 chars recommended)</div>
      <div className="input-group">
        <input 
          type="text" 
          className="input-base font-mono" 
          placeholder="Enter or generate key..." 
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
        />
        <button className="btn-icon" onClick={doGenerateKey} title="Generate Key">
          <RefreshCw size={18} />
        </button>
      </div>

      <button 
        className="btn-primary w-full mt-6" 
        onClick={handleEncrypt}
        disabled={!file || !secret || isEncrypting}
      >
        {isEncrypting ? 'Encrypting...' : 'Encrypt & Generate QR'}
      </button>
    </div>
  );
}
