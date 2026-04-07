import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

const INITIAL_MESSAGES = [
  {
    type: 'bot',
    text: 'नमस्ते! Welcome to NirvaPay! 🙏\n\nI\'m your AI assistant. How can I help you today?'
  }
];

const FAQ_RESPONSES = {
  'loan': 'We offer Personal Loans (₹10K-₹5L), Business Loans (₹50K-₹10L), Emergency Loans (₹5K-₹50K), and Education Loans (₹20K-₹3L). Interest rates start from 8% per year.',
  'emi': 'We offer both Monthly and Weekly EMI options! Weekly EMI is great for small business owners and daily wage earners as it helps manage cash flow better.',
  'documents': 'Minimal documents required: Aadhaar Card, PAN Card, and Bank Statement. For business loans, we may need your Shop License.',
  'salary': 'We provide loans even if you earn ₹8,000-₹10,000 per month! We understand everyone\'s situation is different.',
  'time': 'Loan approval typically takes 24-48 hours after document submission. Emergency loans can be processed faster!',
  'interest': 'Our interest rates range from 8% to 18% per year depending on the loan type. Personal loans at 12%, Business loans at 15%, Emergency at 18%, and Education at 8%.',
  'contact': 'You can reach us at:\n📞 8767765025, 9226017405\n📧 Nirvapaymicrofou@gmail.com\n📍 Pole No G-24, Warora, Chandrapur, Maharashtra',
  'location': 'Our branch is located at:\nPole No G-24, Opposite Yamaha Service Center,\nGuest House Road, Tilak Ward,\nWarora 442907, Chandrapur, Maharashtra',
  'apply': 'You can apply for a loan by:\n1. Creating an account on our website\n2. Filling the online application\n3. Uploading KYC documents\n4. Waiting for approval (24-48 hours)',
  'repayment': 'We offer flexible repayment options:\n• Monthly EMI (traditional)\n• Weekly EMI (for small business owners)\n• Choose tenure from 3 to 60 months',
  'default': 'I\'m here to help! You can ask me about:\n• Loan types and amounts\n• EMI options (Monthly/Weekly)\n• Required documents\n• Interest rates\n• Application process\n• Contact information'
};

function getBotResponse(input) {
  const lowerInput = input.toLowerCase();
  
  for (const [key, response] of Object.entries(FAQ_RESPONSES)) {
    if (lowerInput.includes(key)) {
      return response;
    }
  }
  
  return FAQ_RESPONSES.default;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = { type: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      const botResponse = { type: 'bot', text: getBotResponse(input) };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickReplies = [
    'What loans do you offer?',
    'EMI options?',
    'Required documents?',
    'Low salary loan?'
  ];

  return (
    <div className="chatbot-container">
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-primary-500 to-indian-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window dark:bg-slate-800 dark:border-slate-700">
          {/* Header */}
          <div className="chatbot-header flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 rounded-lg bg-primary-100 p-2 dark:bg-primary-500/20">
                <Bot className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100">NirvaPay Assistant</h3>
                <p className="text-xs text-gray-500 dark:text-slate-400">Ask me about loans & accounts</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 dark:text-slate-400 dark:hover:text-slate-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="chatbot-messages dark:bg-slate-800">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`chatbot-message ${message.type} dark:${message.type === 'user' ? 'bg-primary-600' : 'bg-slate-700 text-slate-100'}`}
              >
                <div className="flex items-start gap-2">
                  {message.type === 'bot' && (
                    <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  )}
                  {message.type === 'user' && (
                    <User className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  )}
                  <span className="whitespace-pre-line">{message.text}</span>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="chatbot-message bot dark:bg-slate-700 dark:text-slate-100">
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4" />
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          <div className="px-4 py-2 bg-gray-50 dark:bg-slate-700 border-t border-gray-100 dark:border-slate-600">
            <div className="flex flex-wrap gap-2">
              {quickReplies.map((reply, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setInput(reply);
                    setTimeout(handleSend, 100);
                  }}
                  className="text-xs bg-white dark:bg-slate-600 text-primary-600 dark:text-primary-400 px-3 py-1 rounded-full border border-primary-200 dark:border-primary-700 hover:bg-primary-50 dark:hover:bg-slate-500 transition-colors"
                >
                  {reply}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="chatbot-input dark:bg-slate-800 dark:border-slate-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your question..."
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:border-primary-500 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-400"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
