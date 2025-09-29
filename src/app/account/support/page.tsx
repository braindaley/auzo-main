"use client";

import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, MessageCircle, X, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supportStorage, SupportConversation, SupportMessage } from '@/lib/support-storage';

const SupportPage = () => {
  const router = useRouter();
  const [conversations, setConversations] = useState<SupportConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<SupportConversation | null>(null);
  const [showNewMessageForm, setShowNewMessageForm] = useState(false);
  const [newMessageSubject, setNewMessageSubject] = useState('');
  const [newMessageText, setNewMessageText] = useState('');
  const [replyText, setReplyText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      scrollToBottom();
    }
  }, [selectedConversation?.messages]);

  const loadConversations = () => {
    const allConversations = supportStorage.getAllConversations();
    setConversations(allConversations);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleBack = () => {
    if (selectedConversation) {
      setSelectedConversation(null);
      loadConversations();
    } else {
      router.push('/account');
    }
  };

  const handleCreateConversation = () => {
    if (!newMessageSubject.trim() || !newMessageText.trim()) return;

    const conversation = supportStorage.createConversation(newMessageSubject, newMessageText);
    supportStorage.simulateSupportResponse(conversation.id);

    setNewMessageSubject('');
    setNewMessageText('');
    setShowNewMessageForm(false);
    loadConversations();
    setSelectedConversation(conversation);
  };

  const handleSendReply = () => {
    if (!selectedConversation || !replyText.trim()) return;

    supportStorage.addMessage(selectedConversation.id, replyText, 'user');
    supportStorage.simulateSupportResponse(selectedConversation.id);

    setReplyText('');

    // Reload the conversation to show the new message
    const updatedConversation = supportStorage.getConversationById(selectedConversation.id);
    if (updatedConversation) {
      setSelectedConversation(updatedConversation);
    }
    loadConversations();
  };

  const handleSelectConversation = (conversation: SupportConversation) => {
    setSelectedConversation(conversation);
  };

  const handleCloseConversation = (conversationId: string) => {
    supportStorage.closeConversation(conversationId);
    loadConversations();
    if (selectedConversation?.id === conversationId) {
      setSelectedConversation(null);
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  // Conversation List View
  if (!selectedConversation && !showNewMessageForm) {
    return (
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                className="mr-3"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <h1 className="text-2xl font-semibold">Support</h1>
            </div>
            <Button onClick={() => setShowNewMessageForm(true)} className="bg-black hover:bg-gray-800 text-white">
              <MessageCircle className="w-4 h-4 mr-2" />
              New Message
            </Button>
          </div>

          <div className="space-y-3">
            {conversations.length === 0 ? (
              <Card className="border-none shadow-none">
                <CardContent className="p-8 text-center">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 mb-4">No support conversations yet</p>
                  <Button onClick={() => setShowNewMessageForm(true)} className="bg-black hover:bg-gray-800 text-white">
                    Start a conversation
                  </Button>
                </CardContent>
              </Card>
            ) : (
              conversations.map((conversation) => (
                <Card
                  key={conversation.id}
                  className="cursor-pointer hover:bg-gray-50 transition-colors border"
                  onClick={() => handleSelectConversation(conversation)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{conversation.subject}</h3>
                          {conversation.status === 'closed' && (
                            <CheckCircle className="w-4 h-4 text-gray-600" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {conversation.messages[conversation.messages.length - 1]?.message}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-gray-500">
                            {formatDate(conversation.lastMessageAt)}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            conversation.status === 'open'
                              ? 'bg-gray-900 text-white'
                              : 'bg-gray-200 text-gray-700'
                          }`}>
                            {conversation.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  // New Message Form
  if (showNewMessageForm) {
    return (
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowNewMessageForm(false)}
              className="mr-3"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-2xl font-semibold">New Support Message</h1>
          </div>

          <Card className="border-none shadow-none">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  type="text"
                  value={newMessageSubject}
                  onChange={(e) => setNewMessageSubject(e.target.value)}
                  placeholder="What do you need help with?"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                  placeholder="Describe your issue in detail..."
                  rows={8}
                  className="resize-none"
                />
              </div>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => setShowNewMessageForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateConversation}
                  disabled={!newMessageSubject.trim() || !newMessageText.trim()}
                  className="flex-1 bg-black hover:bg-gray-800 text-white disabled:bg-gray-300 disabled:text-gray-500"
                >
                  Send Message
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Conversation View
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
                {selectedConversation.subject}
              </h1>
              <p className="text-xs text-gray-500">
                {selectedConversation.status === 'open' ? 'Active conversation' : 'Closed'}
              </p>
            </div>
          </div>
          {selectedConversation.status === 'open' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCloseConversation(selectedConversation.id)}
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
          {selectedConversation.messages.map((message) => (
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
      {selectedConversation.status === 'open' && (
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

export default SupportPage;