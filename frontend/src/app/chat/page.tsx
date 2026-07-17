'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { PaperAirplaneIcon, SparklesIcon, PlusIcon, MapPinIcon, BoltIcon, MagnifyingGlassIcon, ChatBubbleLeftRightIcon,  } from '@heroicons/react/24/outline';
import Header from '../../components/Header';

interface PropertyCard {
  id: string;
  title: string;
  price: number;
  area: string;
  city: string;
  matchScore: number;
  safetyScore: number;
  image: string;
  alt: string;
  priceStatus: string;
  reason: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  properties?: PropertyCard[];
  timestamp: Date;
}

const SUGGESTED_PROMPTS = [
  'Budget under ₹25k in Bangalore',
  'Pet-friendly near metro',
  'Work from home setup',
  'Safe neighborhood for family',
  'Studio under ₹15k Noida',
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: "Hi! I'm StaySmart AI 👋 I can help you find the perfect apartment using natural language. Just tell me what you're looking for — your budget, preferred city, lifestyle needs, commute requirements, anything!",
    timestamp: new Date(Date.now() - 120000),
  },
  {
    id: '2',
    role: 'user',
    content: "I'm looking for a pet-friendly apartment under ₹30k near Noida Sector 62 with reliable internet. I work from home.",
    timestamp: new Date(Date.now() - 90000),
  },
  {
    id: '3',
    role: 'assistant',
    content: "Great! I found 3 properties that match your requirements. I've ranked them by how well they fit your work-from-home lifestyle, pet-friendliness, and proximity to Sector 62. Here's what I recommend:",
    properties: [
      {
        id: '4',
        title: 'Cozy Studio in Sector 62',
        price: 15000,
        area: 'Sector 62',
        city: 'Noida',
        matchScore: 96,
        safetyScore: 93,
        image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&q=80',
        alt: 'Cozy studio apartment with modern interior near metro in Noida Sector 62',
        priceStatus: 'Fair Value',
        reason: 'Best match — 5 min from metro, excellent WiFi, pet-friendly building, under budget',
      },
      {
        id: '2',
        title: 'Spacious 2BHK in Koramangala',
        price: 28000,
        area: 'Sector 137',
        city: 'Noida',
        matchScore: 88,
        safetyScore: 88,
        image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&q=80',
        alt: 'Spacious 2BHK apartment with open living area and modern amenities',
        priceStatus: 'Undervalued',
        reason: 'Priced below market, dedicated work desk, fiber internet, pet deposit waived',
      },
      {
        id: '1',
        title: 'Modern Studio near Cyber Hub',
        price: 22000,
        area: 'Sector 50',
        city: 'Noida',
        matchScore: 82,
        safetyScore: 91,
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&q=80',
        alt: 'Modern studio apartment with large windows and minimalist design',
        priceStatus: 'Fair Value',
        reason: 'High safety score, coworking space in building, allows small pets',
      },
    ],
    timestamp: new Date(Date.now() - 60000),
  },
  {
    id: '4',
    role: 'user',
    content: 'Tell me more about the first one. Is the neighborhood safe?',
    timestamp: new Date(Date.now() - 30000),
  },
  {
    id: '5',
    role: 'assistant',
    content: "The Sector 62 studio has a **Safety Score of 93/100** — one of the highest in Noida. Here's the breakdown:\n\n• Crime Rate: 90/100 — very low incident reports\n• Street Lighting: 95/100 — well-lit roads 24/7\n• Hospitals: 88/100 — Fortis Hospital 2km away\n• Police Station: 91/100 — Sector 58 station 1.2km\n\nThe neighborhood is predominantly residential with IT professionals. The building has 24/7 security, CCTV, and a gated entrance. I'd rate it as one of the safest options in your budget range.",
    timestamp: new Date(Date.now() - 10000),
  },
];

const CHAT_HISTORY = [
  { id: 'c1', title: 'Pet-friendly in Noida', time: 'Just now', active: true },
  { id: 'c2', title: '2BHK Bangalore under 30k', time: '2 hours ago', active: false },
  { id: 'c3', title: 'Studio near metro Delhi', time: 'Yesterday', active: false },
  { id: 'c4', title: 'Family apartment Mumbai', time: '3 days ago', active: false },
];

const AI_RESPONSES = [
  "I found some great options matching your criteria! Let me rank them by how well they fit your preferences.",
  "Based on your search history and preferences, I can see you value safety and proximity to metro. Here are my top picks:",
  "Great choice! That area has excellent connectivity and a strong safety score. Would you like me to estimate your commute time?",
  "I've analyzed 847 properties in that area. Here are the top 3 that match your budget and lifestyle requirements:",
  "That neighborhood has a safety score of 89/100. The area is well-lit, has multiple hospitals nearby, and low crime rates. Shall I show you available properties there?",
];

function PropertyMiniCard({ property }: { property: PropertyCard }) {
  const priceColor = property.priceStatus === 'Undervalued' ? '#86EFAC' : property.priceStatus === 'Overpriced' ? '#FCA5A5' : '#FDE047';
  return (
    <Link href={`/property/${property.id}`} className="block rounded-xl overflow-hidden hover:scale-[1.02] transition-transform duration-200" style={{ background: 'rgba(30,19,50,0.6)', border: '1px solid rgba(139,92,246,0.2)' }}>
      <div className="flex gap-3 p-3">
        <div className="relative w-20 h-16 rounded-lg overflow-hidden shrink-0">
          <img src={property.image} alt={property.alt} className="w-full h-full object-cover" />
          <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-xs font-bold" style={{ background: 'rgba(139,92,246,0.8)', color: '#fff', fontSize: '10px' }}>
            {property.matchScore}%
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold truncate mb-0.5" style={{ color: '#EEEEF0' }}>{property.title}</div>
          <div className="flex items-center gap-1 mb-1">
            <MapPinIcon className="w-3 h-3 shrink-0" style={{ color: '#9898A0' }} />
            <span className="text-xs truncate" style={{ color: '#9898A0' }}>{property.area}, {property.city}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold" style={{ color: '#A78BFA' }}>₹{(property.price / 1000).toFixed(0)}k/mo</span>
            <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(34,197,94,0.1)', color: priceColor, fontSize: '10px' }}>{property.priceStatus}</span>
          </div>
          <div className="text-xs mt-1 line-clamp-1" style={{ color: '#A78BFA', fontSize: '10px' }}>
            <BoltIcon className="inline w-3 h-3 mr-0.5" />{property.reason}
          </div>
        </div>
      </div>
    </Link>
  );
}

function formatContent(content: string) {
  return content.split('\n').map((line, i) => {
    if (line.startsWith('•')) {
      return <div key={i} className="flex items-start gap-2 my-0.5"><span style={{ color: '#A78BFA' }}>•</span><span>{line.slice(1).trim()}</span></div>;
    }
    if (line.startsWith('**') && line.endsWith('**')) {
      return <strong key={i} style={{ color: '#EEEEF0' }}>{line.slice(2, -2)}</strong>;
    }
    if (line === '') return <br key={i} />;
    return <span key={i}>{line.replace(/\*\*(.*?)\*\*/g, '$1')}</span>;
  });
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeChat, setActiveChat] = useState('c1');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = (text?: string) => {
    const content = text || input.trim();
    if (!content) return;
    setInput('');

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)],
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 1200 + Math.random() * 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="h-screen flex flex-col" style={{ background: '#09090B' }}>
      <Header onFindMatch={() => {}} />

      <div className="flex flex-1 overflow-hidden pt-16">
        {/* Sidebar */}
        <div className="hidden md:flex flex-col w-64 shrink-0" style={{ background: 'rgba(30,19,50,0.3)', borderRight: '1px solid rgba(238,238,240,0.06)' }}>
          <div className="p-4">
            <button
              onClick={() => setMessages(INITIAL_MESSAGES.slice(0, 1))}
              className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
              style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', color: '#A78BFA' }}
            >
              <PlusIcon className="w-4 h-4" />
              New Conversation
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1">
            <div className="text-xs font-semibold px-2 mb-2" style={{ color: '#3A3A45' }}>RECENT CHATS</div>
            {CHAT_HISTORY.map(chat => (
              <button
                key={chat.id}
                onClick={() => setActiveChat(chat.id)}
                className="w-full text-left px-3 py-2.5 rounded-xl transition-all duration-200"
                style={{
                  background: activeChat === chat.id ? 'rgba(139,92,246,0.12)' : 'transparent',
                  border: activeChat === chat.id ? '1px solid rgba(139,92,246,0.25)' : '1px solid transparent',
                }}
              >
                <div className="flex items-center gap-2">
                  <ChatBubbleLeftRightIcon className="w-4 h-4 shrink-0" style={{ color: activeChat === chat.id ? '#A78BFA' : '#9898A0' }} />
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate" style={{ color: activeChat === chat.id ? '#EEEEF0' : '#9898A0' }}>{chat.title}</div>
                    <div className="text-xs" style={{ color: '#3A3A45' }}>{chat.time}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="p-4 border-t" style={{ borderColor: 'rgba(238,238,240,0.06)' }}>
            <Link href="/listings" className="flex items-center gap-2 text-xs" style={{ color: '#9898A0' }}>
              <MagnifyingGlassIcon className="w-4 h-4" />
              Browse all listings
            </Link>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Chat Header */}
          <div className="px-6 py-4 flex items-center gap-3" style={{ borderBottom: '1px solid rgba(238,238,240,0.06)', background: 'rgba(9,9,11,0.8)', backdropFilter: 'blur(12px)' }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.4)' }}>
              <SparklesIcon className="w-4 h-4" style={{ color: '#A78BFA' }} />
            </div>
            <div>
              <div className="text-sm font-bold" style={{ color: '#EEEEF0' }}>StaySmart AI Assistant</div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                <span className="text-xs" style={{ color: '#9898A0' }}>Online · Powered by semantic search + ML ranking</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-5">
            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center mt-1" style={{ background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.4)' }}>
                    <SparklesIcon className="w-4 h-4" style={{ color: '#A78BFA' }} />
                  </div>
                )}
                <div className={`max-w-[75%] space-y-3 ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                  <div
                    className="px-4 py-3 rounded-2xl text-sm leading-relaxed"
                    style={msg.role === 'user'
                      ? { background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.35)', color: '#EEEEF0', borderBottomRightRadius: '4px' }
                      : { background: 'rgba(30,19,50,0.6)', border: '1px solid rgba(238,238,240,0.08)', color: '#EEEEF0', borderBottomLeftRadius: '4px' }
                    }
                  >
                    {formatContent(msg.content)}
                  </div>
                  {msg.properties && (
                    <div className="w-full space-y-2">
                      {msg.properties.map(p => <PropertyMiniCard key={p.id} property={p} />)}
                    </div>
                  )}
                  <span className="text-xs px-1" style={{ color: '#3A3A45' }}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.4)' }}>
                  <SparklesIcon className="w-4 h-4" style={{ color: '#A78BFA' }} />
                </div>
                <div className="px-4 py-3 rounded-2xl" style={{ background: 'rgba(30,19,50,0.6)', border: '1px solid rgba(238,238,240,0.08)' }}>
                  <div className="flex gap-1 items-center h-5">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: '#A78BFA', animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts */}
          <div className="px-4 md:px-8 pb-3">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {SUGGESTED_PROMPTS.map(prompt => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="chip shrink-0 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="px-4 md:px-8 pb-6">
            <div className="flex gap-3 items-end p-3 rounded-2xl" style={{ background: 'rgba(30,19,50,0.5)', border: '1px solid rgba(139,92,246,0.25)' }}>
              <textarea
                className="flex-1 bg-transparent text-sm resize-none outline-none leading-relaxed"
                style={{ color: '#EEEEF0', minHeight: '24px', maxHeight: '120px' }}
                placeholder="Find me a pet-friendly apartment under ₹30k near Noida Sector 62 with reliable internet..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || isTyping}
                className="p-2.5 rounded-xl transition-all duration-200"
                style={{
                  background: input.trim() && !isTyping ? '#8B5CF6' : 'rgba(139,92,246,0.2)',
                  color: input.trim() && !isTyping ? '#fff' : '#9898A0',
                }}
              >
                <PaperAirplaneIcon className="w-4 h-4" />
              </button>
            </div>
            <p className="text-center text-xs mt-2" style={{ color: '#3A3A45' }}>
              StaySmart AI uses semantic search + ML ranking to find your best match
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
