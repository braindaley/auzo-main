
import { Car, User } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';

type HeaderProps = {
  isTransparent?: boolean;
  disableLogoLink?: boolean;
  children?: React.ReactNode;
  hideAccountIcon?: boolean;
}

const Header = ({ isTransparent = true, disableLogoLink = false, children, hideAccountIcon = false }: HeaderProps) => {
  const LogoContent = () => (
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg">
        <Car className={cn("w-8 h-8", isTransparent ? "text-white" : "text-primary")} />
      </div>
      <span className={cn(
        "heading-2",
         isTransparent ? "text-white" : "text-foreground"
      )}>Auzo</span>
    </div>
  );
  
  return (
    <header className={cn(
      "flex items-center justify-between p-4 z-10",
      !isTransparent && "bg-background border-b"
    )}>
      <div className="flex-1">
        {children ? (
          children
        ) : disableLogoLink ? (
          <div className="cursor-default">
            <LogoContent />
          </div>
        ) : (
          <Link href="/home">
            <LogoContent />
          </Link>
        )}
      </div>
      {!hideAccountIcon && (
        <div className="flex-1 flex justify-end">
          <Link href="/account">
            <Button variant="ghost" size="icon">
              <Avatar className="w-8 h-8">
                  <AvatarFallback className='bg-muted'><User /></AvatarFallback>
              </Avatar>
            </Button>
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
