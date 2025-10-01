"use client";

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "How do I update my account information?",
    answer: "You can update your account information by navigating to the Profile section in your account settings. There you can edit your name, email, and other personal details."
  },
  {
    question: "How long does it take to get a response from support?",
    answer: "Our support team typically responds within 24 hours during business days. For urgent issues, we prioritize based on severity and impact."
  },
  {
    question: "Can I reopen a closed conversation?",
    answer: "Yes, if you need to add more information to a closed conversation, simply start a new conversation and reference the previous ticket number."
  },
  {
    question: "What information should I include when contacting support?",
    answer: "Please include a clear description of your issue, any error messages you're seeing, and steps to reproduce the problem. Screenshots are also very helpful."
  },
  {
    question: "How do I manage users on my account?",
    answer: "Visit the Manage Users section in your account settings to add, remove, or modify user permissions and roles."
  }
];

export const FAQSection = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">Frequently Asked Questions</h2>
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <Card key={index} className="border">
            <CardContent className="p-0">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-4 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                {expandedIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-gray-600 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600 flex-shrink-0" />
                )}
              </button>
              {expandedIndex === index && (
                <div className="px-4 pb-4 text-gray-700 text-sm">
                  {faq.answer}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
