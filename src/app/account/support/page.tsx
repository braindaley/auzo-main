"use client";

import { useState, useEffect } from 'react';
import { ArrowLeft, MessageCircle, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { supportStorage, SupportConversation } from '@/lib/support-storage';
import { FAQSection } from '@/components/support/faq-section';

const SupportPage = () => {
  const router = useRouter();
  const [conversations, setConversations] = useState<SupportConversation[]>([]);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = () => {
    const allConversations = supportStorage.getAllConversations();
    setConversations(allConversations);
  };

  const handleBack = () => {
    router.push('/account');
  };

  const handleStartConversation = () => {
    // Create a new conversation with default values
    const conversation = supportStorage.createConversation(
      'New Support Request',
      'How can we help you today?'
    );

    // Navigate to the conversation page
    router.push(`/account/support/${conversation.id}`);
  };

  const handleSelectConversation = (conversationId: string) => {
    router.push(`/account/support/${conversationId}`);
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

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
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

        {/* FAQ Section */}
        <FAQSection />

        {/* Conversations Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Your Conversations</h2>
          <div className="space-y-3">
            {conversations.length === 0 ? (
              <Card className="border">
                <CardContent className="p-8 text-center">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 mb-4">No support conversations yet</p>
                  <Button onClick={handleStartConversation} className="bg-black hover:bg-gray-800 text-white">
                    Start your first conversation
                  </Button>
                </CardContent>
              </Card>
            ) : (
              conversations.map((conversation) => (
                <Card
                  key={conversation.id}
                  className="cursor-pointer hover:bg-gray-50 transition-colors border"
                  onClick={() => handleSelectConversation(conversation.id)}
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
    </div>
  );
};

export default SupportPage;