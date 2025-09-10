"use client";

import { useState } from 'react';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM'
];

const generateDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        dates.push(date);
    }
    
    return dates;
};

const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
        return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
        return 'Tomorrow';
    } else {
        return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    }
};

export default function ChooseTimePage() {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const dates = generateDates();
    
    // Get the referrer to know which page to return to
    const referrer = searchParams.get('from') || 'deliver';
    // Preserve service parameters when returning
    const serviceParam = searchParams.get('service');

    const handleTimeSelect = (time: string) => {
        setSelectedTime(time);
        // Store date and time in sessionStorage for confirm-booking page
        if (selectedDate) {
            sessionStorage.setItem('selectedDate', formatDate(selectedDate));
            sessionStorage.setItem('selectedTime', time);
        }
        // Navigate back to the referring page with preserved service parameters
        setTimeout(() => {
            const params = new URLSearchParams();
            params.set('pickup', 'later');
            if (serviceParam) {
                params.set('service', serviceParam);
            }
            router.push(`/${referrer}?${params.toString()}`);
        }, 300);
    };

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <div className="border-b bg-white px-4 py-4">
                <div className="flex items-center gap-4">
                    <Link href={`/${referrer}`} className="p-1">
                        <ArrowLeft className="w-6 h-6 text-gray-600" />
                    </Link>
                    <div className="flex-1">
                        <h1 className="text-lg font-semibold text-gray-900">Choose a time</h1>
                    </div>
                </div>
            </div>

            <div className="flex-1 p-4 space-y-6">
                {/* Date Selection - Only show if no date selected */}
                {!selectedDate && (
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Calendar className="w-5 h-5 text-gray-600" />
                            <h2 className="text-base font-medium text-gray-900">Select Date</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {dates.map((date, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedDate(date)}
                                    className="p-3 border rounded-lg text-left transition-colors border-gray-300 bg-white hover:bg-gray-50"
                                >
                                    <div className="font-medium">{formatDate(date)}</div>
                                    <div className="text-sm text-gray-500">
                                        {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Time Selection - Show after date is selected */}
                {selectedDate && (
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Clock className="w-5 h-5 text-gray-600" />
                            <h2 className="text-base font-medium text-gray-900">
                                Select Time for {formatDate(selectedDate)}
                            </h2>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {timeSlots.map((time) => (
                                <button
                                    key={time}
                                    onClick={() => handleTimeSelect(time)}
                                    className="p-3 border rounded-lg text-center transition-colors border-gray-300 bg-white hover:bg-gray-50"
                                >
                                    <div className="text-sm font-medium">{time}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}