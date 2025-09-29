export interface SupportMessage {
  id: string;
  conversationId: string;
  sender: 'user' | 'support';
  message: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
}

export interface SupportConversation {
  id: string;
  subject: string;
  createdAt: string;
  lastMessageAt: string;
  status: 'open' | 'closed';
  messages: SupportMessage[];
}

class SupportStorage {
  private readonly STORAGE_KEY = 'auzo_support_conversations';

  private generateConversationId(): string {
    return `conv_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  }

  private getConversations(): SupportConversation[] {
    if (typeof window === 'undefined') return [];

    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load support conversations:', error);
      return [];
    }
  }

  private saveConversations(conversations: SupportConversation[]): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(conversations));
    } catch (error) {
      console.error('Failed to save support conversations:', error);
    }
  }

  createConversation(subject: string, initialMessage: string): SupportConversation {
    const conversationId = this.generateConversationId();
    const timestamp = new Date().toISOString();

    const firstMessage: SupportMessage = {
      id: this.generateMessageId(),
      conversationId,
      sender: 'user',
      message: initialMessage,
      timestamp,
      status: 'sent'
    };

    const conversation: SupportConversation = {
      id: conversationId,
      subject,
      createdAt: timestamp,
      lastMessageAt: timestamp,
      status: 'open',
      messages: [firstMessage]
    };

    const conversations = this.getConversations();
    conversations.unshift(conversation);
    this.saveConversations(conversations);

    return conversation;
  }

  addMessage(conversationId: string, message: string, sender: 'user' | 'support'): SupportMessage | null {
    const conversations = this.getConversations();
    const conversation = conversations.find(c => c.id === conversationId);

    if (!conversation) return null;

    const newMessage: SupportMessage = {
      id: this.generateMessageId(),
      conversationId,
      sender,
      message,
      timestamp: new Date().toISOString(),
      status: 'sent'
    };

    conversation.messages.push(newMessage);
    conversation.lastMessageAt = newMessage.timestamp;

    this.saveConversations(conversations);
    return newMessage;
  }

  getConversationById(id: string): SupportConversation | null {
    const conversations = this.getConversations();
    return conversations.find(c => c.id === id) || null;
  }

  getAllConversations(): SupportConversation[] {
    return this.getConversations();
  }

  closeConversation(id: string): void {
    const conversations = this.getConversations();
    const conversation = conversations.find(c => c.id === id);

    if (conversation) {
      conversation.status = 'closed';
      this.saveConversations(conversations);
    }
  }

  reopenConversation(id: string): void {
    const conversations = this.getConversations();
    const conversation = conversations.find(c => c.id === id);

    if (conversation) {
      conversation.status = 'open';
      this.saveConversations(conversations);
    }
  }

  // Simulate support response (for demo purposes)
  simulateSupportResponse(conversationId: string): void {
    const supportResponses = [
      "Thank you for contacting Auzo support. We've received your message and will respond shortly.",
      "We're looking into your issue. Our team will get back to you within 24 hours.",
      "Your issue has been escalated to our technical team. We'll update you soon.",
      "Thank you for your patience. We're working on resolving this for you."
    ];

    setTimeout(() => {
      const randomResponse = supportResponses[Math.floor(Math.random() * supportResponses.length)];
      this.addMessage(conversationId, randomResponse, 'support');
    }, 2000); // Simulate 2-second delay
  }
}

export const supportStorage = new SupportStorage();