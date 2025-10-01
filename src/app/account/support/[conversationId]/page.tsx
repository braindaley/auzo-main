"use client";

import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, CheckCircle } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supportStorage, SupportConversation } from '@/lib/support-storage';

const ConversationPage = () => {
  const router = useRouter();
  const params = useParams();
  const conversationId = params.conversationId as string;

  const [conversation, setConversation] = useState<SupportConversation | null>(null);
  const [replyText, setReplyText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadConversation();
  }, [conversationId]);

  useEffect(() => {
    if (conversation) {
      scrollToBottom();
    }
  }, [conversation?.messages]);

  const loadConversation = () => {
    const conv = supportStorage.getConversationById(conversationId);
    if (conv) {
      setConversation(conv);
    } else {
      // Conversation not found, redirect back to support page
      router.push('/account/support');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleBack = () => {
    router.push('/account/support');
  };

  const handleSendReply = () => {
    if (!conversation || !replyText.trim()) return;

    supportStorage.addMessage(conversation.id, replyText, 'user');
    supportStorage.simulateSupportResponse(conversation.id);

    setReplyText('');

    // Reload the conversation to show the new message
    const updatedConversation = supportStorage.getConversationById(conversation.id);
    if (updatedConversation) {
      setConversation(updatedConversation);
    }
  };

  const handleCloseConversation = () => {
    if (!conversation) return;

    supportStorage.closeConversation(conversation.id);
    const updatedConversation = supportStorage.getConversationById(conversation.id);
    if (updatedConversation) {
      setConversation(updatedConversation);
    }
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading conversation...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="border-b bg-white px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={handleBack}
              className="p-1"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-gray-900">
                {conversation.subject}
              </h1>
              <p className="text-xs text-gray-500">
                {conversation.status === 'open' ? 'Active conversation' : 'Closed'}
              </p>
            </div>
          </div>
          {conversation.status === 'open' && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleCloseConversation}
              className="border-gray-300 hover:bg-gray-100"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Close
            </Button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <div className="max-w-2xl mx-auto space-y-4">
          {conversation.messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === 'user'
                    ? 'bg-gray-300 text-gray-900'
                    : 'bg-white text-gray-900 border border-gray-300'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap break-words">{message.message}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-gray-600' : 'text-gray-500'
                  }`}
                >
                  {formatMessageTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Reply Input */}
      {conversation.status === 'open' && (
        <div className="border-t bg-white p-4">
          <div className="max-w-2xl mx-auto flex gap-2">
            <Input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendReply();
                }
              }}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button
              onClick={handleSendReply}
              disabled={!replyText.trim()}
              size="icon"
              className="bg-black hover:bg-gray-800 text-white disabled:bg-gray-300 disabled:text-gray-500"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationPage;
