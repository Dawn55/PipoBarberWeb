"use client";

import { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import MessageDrawer from '@/components/messages/MessageDrawer';

export default function ChatButton() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        onClick={toggleDrawer}
        className="fixed bottom-20 right-6 z-30 bg-secondary hover:bg-secondary/80 text-white p-3 rounded-full shadow-lg transition-all duration-300"
        aria-label="Mesajlar"
      >
        <MessageSquare size={24} />
      </button>
      
      <MessageDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}