import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './components.css';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! I am your CipherShare assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const addBotMessage = (text) => {
    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: 'bot', text }]);
    }, 600);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { sender: 'user', text: input }]);
    const query = input.toLowerCase();
    setInput('');

    if (query.includes('encrypt')) {
      addBotMessage("To encrypt, upload an image, generate or type a secure key, and hit Encrypt. You'll get a QR code and Share ID.");
    } else if (query.includes('decrypt') || query.includes('recover')) {
      addBotMessage("To decrypt, switch to the Decrypt tab, paste the Share ID (from the QR code), and enter the exact encryption key.");
    } else if (query.includes('key')) {
      addBotMessage("We use AES-256 for encryption. It requires an exact key. If you lose the key, the image cannot be recovered. Keep it safe!");
    } else if (query.includes('qr')) {
      addBotMessage("The QR code contains the Share ID. Large encrypted images are too big for standard QR codes, so we securely store the encrypted payload and share the ID via QR.");
    } else {
      addBotMessage("I am a simple assistant. I can help answer general questions. Try asking about 'encrypt', 'decrypt', 'keys', or 'QR'.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <>
      {/* Floating Action Button */}
      <button 
        className="chatbot-trigger" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Chatbot"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="chatbot-window glass-panel"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9, transition: { duration: 0.2 } }}
          >
            <div className="chat-header">
              <span>Cipher Assistant</span>
              <button onClick={() => setIsOpen(false)} className="text-secondary hover:text-white">
                <X size={18} />
              </button>
            </div>
            
            <div className="chat-messages">
              {messages.map((msg, index) => (
                <div key={index} className={`chat-bubble ${msg.sender}`}>
                  {msg.text}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="quick-replies">
              <button className="quick-reply-btn" onClick={() => setInput("How to encrypt?")}>How to encrypt?</button>
              <button className="quick-reply-btn" onClick={() => setInput("Lost key")}>Lost key</button>
            </div>

            <div className="chat-input-area">
              <input 
                type="text" 
                className="input-base" 
                style={{ padding: '0.5rem 0.75rem', borderRadius: '20px' }}
                placeholder="Ask me anything..." 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button onClick={handleSend} className="btn-icon" style={{ borderRadius: '50%' }}>
                <Send size={16} className="text-cyan" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
