
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { 
  Home, 
  Package, 
  Store, 
  Truck, 
  User, 
  LogOut, 
  Bell,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { currentUser, logout, isAuthenticated } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // If not authenticated and not on login page, redirect to login
  React.useEffect(() => {
    if (!isAuthenticated && location.pathname !== '/login') {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, location.pathname, navigate]);

  const getNavItems = () => {
    const role = currentUser?.role;
    
    const items = [
      { label: 'Home', path: '/', icon: Home, roles: ['customer', 'store', 'driver', 'admin'] },
      { label: 'Stores', path: '/stores', icon: Store, roles: ['customer', 'admin'] },
      { label: 'Orders', path: '/orders', icon: Package, roles: ['customer', 'store', 'driver', 'admin'] },
      { label: 'Deliveries', path: '/deliveries', icon: Truck, roles: ['driver', 'admin'] },
      { label: 'Management', path: '/admin', icon: Settings, roles: ['admin'] },
    ];

    return items.filter(item => role && item.roles.includes(role));
  };

  return (
    <div className="min-h-screen flex flex-col">
      {isAuthenticated && (
        <header className="border-b bg-white sticky top-0 z-10">
          <div className="container mx-auto flex justify-between items-center py-3">
            <div className="flex items-center">
              <button onClick={() => navigate('/')} className="flex items-center">
                <h1 className="text-2xl font-bold text-flowee-500">Flowee</h1>
              </button>
            </div>

            {!isMobile && (
              <nav className="hidden md:flex items-center gap-6">
                {getNavItems().map((item) => (
                  <Button
                    key={item.path}
                    variant="ghost"
                    onClick={() => navigate(item.path)}
                    className={cn(
                      "flex items-center gap-2",
                      isActive(item.path) && "bg-flowee-100 text-flowee-700"
                    )}
                  >
                    <item.icon size={18} />
                    <span>{item.label}</span>
                  </Button>
                ))}
              </nav>
            )}

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Bell size={20} />
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User size={20} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>{currentUser?.name}</span>
                      <span className="text-xs text-muted-foreground">{currentUser?.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => logout()}>
                    <LogOut className="mr-2" size={16} />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
      )}

      <main className="flex-1">
        {children}
      </main>

      {isAuthenticated && isMobile && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-10 bg-white border-t">
          <div className="flex justify-around py-3">
            {getNavItems().map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                size="icon"
                onClick={() => navigate(item.path)}
                className={cn(
                  "rounded-full",
                  isActive(item.path) ? "text-flowee-500 bg-flowee-100" : "text-muted-foreground"
                )}
              >
                <item.icon size={20} />
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
