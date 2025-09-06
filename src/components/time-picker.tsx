
"use client";

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface TimePickerProps {
    value: { hour: number; minute: number; period: 'AM' | 'PM' };
    onChange: (value: { hour: number; minute: number; period: 'AM' | 'PM' }) => void;
}

const hours = Array.from({ length: 12 }, (_, i) => i + 1);
const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
const periods = ['AM', 'PM'];

const ScrollColumn = ({ items, selectedValue, onSelect, itemHeight = 40, className }: { items: (string|number)[], selectedValue: string|number, onSelect: (value: any) => void, itemHeight?: number, className?: string }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isInteracting, setIsInteracting] = useState(false);
    
    useEffect(() => {
        if (ref.current && !isInteracting) {
            const selectedIndex = items.indexOf(selectedValue);
            if (selectedIndex !== -1) {
                const targetScrollTop = selectedIndex * itemHeight;
                ref.current.scrollTop = targetScrollTop;
            }
        }
    }, [selectedValue, items, itemHeight, isInteracting]);
    
    let scrollTimeout = useRef<NodeJS.Timeout | null>(null);

    const handleScroll = () => {
        if (scrollTimeout.current) clearTimeout(scrollTimeout.current);

        setIsInteracting(true);

        scrollTimeout.current = setTimeout(() => {
            if(ref.current) {
                const scrollTop = ref.current.scrollTop;
                const index = Math.round(scrollTop / itemHeight);
                const newScrollTop = index * itemHeight;
                ref.current.scrollTo({ top: newScrollTop, behavior: 'smooth' });
                onSelect(items[index]);
            }
            setIsInteracting(false);
        }, 150); 
    };
    
    return (
        <div 
            ref={ref} 
            className={cn("h-40 overflow-y-scroll snap-y snap-mandatory hide-scrollbar", className)}
            onScroll={handleScroll}
            onTouchStart={() => setIsInteracting(true)}
        >
            <div style={{ paddingTop: 'calc(50% - 20px)', paddingBottom: 'calc(50% - 20px)' }}>
                {items.map((item) => (
                    <div 
                        key={item} 
                        onClick={() => onSelect(item)}
                        className={cn(
                            "flex items-center justify-center text-2xl transition-all duration-300 snap-center cursor-pointer",
                            selectedValue === item ? "text-foreground font-bold scale-110" : "text-muted-foreground/50 scale-90"
                        )}
                        style={{ height: `${itemHeight}px` }}
                    >
                        {item}
                    </div>
                ))}
            </div>
        </div>
    );
};

export const TimePicker = ({ value, onChange }: TimePickerProps) => {
    return (
       <div className="relative grid grid-cols-[1fr,20px,1fr,1fr] items-center text-center gap-2">
            <ScrollColumn 
                items={hours} 
                selectedValue={value.hour} 
                onSelect={(h) => onChange({...value, hour: h})} 
            />
            <div className="text-2xl font-bold">:</div>
            <ScrollColumn 
                items={minutes} 
                selectedValue={String(value.minute).padStart(2,'0')} 
                onSelect={(m) => onChange({...value, minute: parseInt(m)})} 
            />
            <ScrollColumn 
                items={periods} 
                selectedValue={value.period} 
                onSelect={(p) => onChange({...value, period: p as 'AM' | 'PM'})} 
            />
            <div className="absolute top-1/2 left-0 w-full h-10 bg-primary/10 rounded-lg -translate-y-1/2 pointer-events-none" />
       </div>
    );
};
