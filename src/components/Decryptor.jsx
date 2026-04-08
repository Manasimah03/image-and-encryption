import { useState } from 'react';
import { Unlock, Eye, Download, Image as ImageIcon } from 'lucide-react';
import { retrieveAndDecrypt } from '../lib/crypto';
import './components.css';

export default function Decryptor() {
  const [shareId, setShareId] = useState('');
  const [secret, setSecret] = useState('');
  const [imageSrc, setImageSrc] = useState(null);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [error, setError] = useState('');

  const handleDecrypt = async () => {
    if (!shareId || !secret) return;
    setIsDecrypting(true);
    setError('');
    
    try {
      const src = await retrieveAndDecrypt(shareId, secret);
      setImageSrc(src);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Decryption failed. Check ID and Key.');
    }
    
    setIsDecrypting(false);
  };

  const handleDownload = () => {
    if (!imageSrc) return;
    const a = document.createElement('a');
    a.href = imageSrc;
    a.download = 'decrypted_image.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (imageSrc) {
    return (
      <div className="glass-panel p-6">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-success">
          <Unlock size={20} /> Decryption Successful
        </h2>
        
        <div className="result-image-wrapper p-2 shadow-glow mb-6">
          <img src={imageSrc} alt="Decrypted file" />
        </div>

        <div className="flex gap-4">
          <button 
            className="btn-primary w-full flex items-center justify-center gap-2"
            onClick={handleDownload}
          >
            <Download size={18} /> Download
          </button>
          <button 
            className="btn-primary w-full"
            style={{ background: 'rgba(255, 255, 255, 0.1)' }}
            onClick={() => { setImageSrc(null); setShareId(''); setSecret(''); }}
          >
            Decrypt Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel p-6">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <Eye size={20} className="text-purple-400" /> Secure Decryption
      </h2>

      {error && (
        <div className="bg-red-500 bg-opacity-20 border border-red-500 text-error p-3 rounded mb-6 text-sm">
          {error}
        </div>
      )}

      <div className="mb-2 text-sm text-secondary">Share ID (from QR Scan or Sender)</div>
      <div className="mb-6">
        <input 
          type="text" 
          className="input-base font-mono bg-dark" 
          placeholder="e.g. shr_123abc" 
          value={shareId}
          onChange={(e) => setShareId(e.target.value)}
        />
      </div>

      <div className="mb-2 text-sm text-secondary">Decryption Key</div>
      <div className="mb-6">
        <input 
          type="password" 
          className="input-base font-mono bg-dark" 
          placeholder="Enter exact key..." 
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
        />
      </div>

      <button 
        className="btn-primary w-full" 
        onClick={handleDecrypt}
        disabled={!shareId || !secret || isDecrypting}
      >
        {isDecrypting ? 'Decrypting...' : 'Unlock Image'}
      </button>

      <div className="mt-8 text-center text-secondary text-sm">
        <ImageIcon size={48} className="mx-auto mb-2 opacity-20" />
        <p>Your data is processed locally. We never store keys.</p>
      </div>
    </div>
  );
}
