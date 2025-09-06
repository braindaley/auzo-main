
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Phone, Star } from "lucide-react";

type ServiceConfirmationCardProps = {
    onCancel: () => void;
}

const ServiceConfirmationCard = ({ onCancel }: ServiceConfirmationCardProps) => {
  return (
    <Card className="rounded-t-2xl border-none shadow-2xl">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
            <div>
                <h3 className="text-lg font-bold">Meeting at Klubokawiarnia & Mała...</h3>
                <p className="text-sm text-muted-foreground">Show more</p>
            </div>
            <div className="text-center">
                <div className="p-2 rounded-full bg-primary text-primary-foreground font-bold">
                    6
                </div>
                <p className="text-xs">min</p>
            </div>
        </div>

        <div className="mb-4">
            <h4 className="font-semibold mb-2">PIN for your ride</h4>
            <div className="flex justify-center gap-2">
                {[3, 6, 2, 2].map((digit, index) => (
                    <div key={index} className="w-12 h-12 flex items-center justify-center bg-muted rounded-lg text-2xl font-bold">
                        {digit}
                    </div>
                ))}
            </div>
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 mb-4">
            <div className="flex items-center gap-4">
                <div className="relative">
                    <Avatar className="w-16 h-16 border-4 border-background">
                        <AvatarImage src="https://picsum.photos/100/100" data-ai-hint="person" />
                        <AvatarFallback>A</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2 flex items-center gap-1 px-2 py-1 rounded-full bg-card shadow-md">
                        <span className="font-bold text-sm">4.97</span>
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400"/>
                    </div>
                </div>
                <div>
                    <p className="font-bold">Andrzej</p>
                    <p className="text-sm text-primary">Highest rated driver</p>
                </div>
            </div>
            <div>
                <p className="font-bold text-right">AA 123AA</p>
                <p className="text-sm text-muted-foreground text-right">Toyota Auris</p>
            </div>
        </div>

        <div className="flex gap-2">
            <Button variant="secondary" className="flex-1">Notes for pickup</Button>
            <Button variant="secondary" size="icon"><Phone /></Button>
        </div>

         <Button variant="ghost" className="w-full mt-4 text-destructive" onClick={onCancel}>
            Cancel Service
        </Button>
      </CardContent>
    </Card>
  );
};

export default ServiceConfirmationCard;
