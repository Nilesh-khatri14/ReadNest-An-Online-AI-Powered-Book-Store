import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, LogOut, Menu, Sun, Moon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');

  useEffect(() => {
    console.log("Auth state in Navbar:", { user, isAuthenticated });
  }, [user, isAuthenticated]);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate('/login');
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
  };

  const getUserInitials = () => {
    if (!user?.name) return '?';
    return user.name.charAt(0).toUpperCase();
  };

  return (
    <nav className="bg-background border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/readnest-logo.svg" alt="ReadNest Logo" className="w-10 h-10" />
              <span className="logo-text text-2xl">ReadNest</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground hover:text-primary">Home</Link>
            <Link to="/browse" className="text-foreground hover:text-primary">Browse Books</Link>
            <Link to="/sell-books" className="text-foreground hover:text-primary">Sell Books</Link>
            <Link to="/exchange" className="text-foreground hover:text-primary">Exchange</Link>
            <Link to="/publish" className="text-foreground hover:text-primary">Publish Book</Link>
            <Link to="/feedback" className="text-foreground hover:text-primary">Feedback</Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme}
              className="mr-2"
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5 text-foreground" />
              ) : (
                <Sun className="h-5 w-5 text-foreground" />
              )}
            </Button>

            {isAuthenticated && user ? (
              <>
                <Link to="/cart" className="relative">
                  <ShoppingCart className="h-6 w-6 text-readnest-teal" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-readnest-teal text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Link>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full border-2 border-readnest-teal overflow-hidden">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-readnest-teal text-white font-medium">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal bg-readnest-cream/20">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none text-readnest-teal">{user.name}</p>
                        <p className="text-xs leading-none text-readnest-gray">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => navigate('/profile')}
                      className="text-readnest-teal hover:text-readnest-darkTeal hover:bg-readnest-cream/30"
                    >
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => navigate('/orders')}
                      className="text-readnest-teal hover:text-readnest-darkTeal hover:bg-readnest-cream/30"
                    >
                      My Orders
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => navigate('/recommendations')}
                      className="text-readnest-teal hover:text-readnest-darkTeal hover:bg-readnest-cream/30"
                    >
                      My Recommendations
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={handleLogout}
                      className="text-readnest-teal hover:text-readnest-darkTeal hover:bg-readnest-cream/30"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button onClick={() => navigate('/login')} className="btn-primary">
                Login
              </Button>
            )}
          </div>

          <div className="md:hidden flex items-center">
            {isAuthenticated && user ? (
              <Link to="/cart" className="relative mr-4">
                <ShoppingCart className="h-6 w-6 text-readnest-teal" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-readnest-teal text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
            ) : null}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  {isAuthenticated && user ? (
                    <Avatar className="h-8 w-8 border-2 border-readnest-teal">
                      <AvatarFallback className="bg-readnest-teal text-white font-medium">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <Menu className="h-6 w-6 text-readnest-teal" />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col space-y-4 mt-8">
                  <Link to="/" className="text-readnest-teal hover:text-readnest-darkTeal text-lg">
                    Home
                  </Link>
                  <Link to="/browse" className="text-readnest-teal hover:text-readnest-darkTeal text-lg">
                    Browse Books
                  </Link>
                  <Link to="/sell-books" className="text-readnest-teal hover:text-readnest-darkTeal text-lg">
                    Sell Books
                  </Link>
                  <Link to="/exchange" className="text-readnest-teal hover:text-readnest-darkTeal text-lg">
                    Exchange
                  </Link>
                  <Link to="/publish" className="text-readnest-teal hover:text-readnest-darkTeal text-lg">
                    Publish Book
                  </Link>
                  <Link to="/feedback" className="text-readnest-teal hover:text-readnest-darkTeal text-lg">
                    Feedback
                  </Link>
                  
                  {isAuthenticated && user ? (
                    <>
                      <div className="flex items-center space-x-2 pt-4">
                        <Avatar className="h-8 w-8 border-2 border-readnest-teal">
                          <AvatarFallback className="bg-readnest-teal text-white font-medium">
                            {getUserInitials()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium text-readnest-teal">{user.name}</span>
                      </div>
                      <Link to="/profile" className="text-readnest-teal hover:text-readnest-darkTeal text-lg">
                        Profile
                      </Link>
                      <Link to="/orders" className="text-readnest-teal hover:text-readnest-darkTeal text-lg">
                        My Orders
                      </Link>
                      <Link to="/recommendations" className="text-readnest-teal hover:text-readnest-darkTeal text-lg">
                        My Recommendations
                      </Link>
                      <Button variant="ghost" onClick={handleLogout} className="justify-start px-0">
                        <LogOut className="h-5 w-5 text-readnest-teal mr-2" />
                        <span>Logout</span>
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => navigate('/login')} className="btn-primary mt-4">
                      Login
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
