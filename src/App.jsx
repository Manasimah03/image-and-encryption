import { useState } from 'react';
import { Shield, Lock, Unlock } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Encryptor from './components/Encryptor';
import Decryptor from './components/Decryptor';
import Chatbot from './components/Chatbot';
import './App.css';

function App() {
  const [mode, setMode] = useState('encrypt');

  return (
    <div className="app-container">
      <header className="top-nav">
        <div className="brand">
          <Shield size={28} />
          <span className="gradient-text">CipherShare</span>
        </div>
        
        <div className="mode-switcher" style={{ position: 'relative' }}>
          <motion.div 
            className="active-pill"
            layoutId="active-pill"
            initial={false}
            animate={{
              left: mode === 'encrypt' ? '0.25rem' : 'calc(50% + 0.125rem)',
              width: 'calc(50% - 0.375rem)'
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
          <button 
            className={`mode-btn ${mode === 'encrypt' ? 'active' : ''}`}
            onClick={() => setMode('encrypt')}
          >
            <Lock size={16} style={{ display: 'inline', marginRight: 6, verticalAlign: 'text-bottom' }} />
            Encrypt
          </button>
          <button 
            className={`mode-btn ${mode === 'decrypt' ? 'active' : ''}`}
            onClick={() => setMode('decrypt')}
          >
            <Unlock size={16} style={{ display: 'inline', marginRight: 6, verticalAlign: 'text-bottom' }} />
            Decrypt
          </button>
        </div>
      </header>

      <main className="main-content">
        <AnimatePresence mode="wait">
          {mode === 'encrypt' ? (
            <motion.div
              key="encrypt"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              style={{ width: '100%', maxWidth: '600px' }}
            >
              <Encryptor />
            </motion.div>
          ) : (
            <motion.div
              key="decrypt"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              style={{ width: '100%', maxWidth: '600px' }}
            >
              <Decryptor />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Chatbot />
    </div>
  );
}

export default App;
