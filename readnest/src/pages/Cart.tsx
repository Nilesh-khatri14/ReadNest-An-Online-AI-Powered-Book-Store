
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { MinusCircle, PlusCircle, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { getRecommendedBooks } from '@/data/mock';
import BookCard from '@/components/BookCard';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Get recommended books based on the first book in the cart
  const recommendedBooks = items.length > 0 
    ? getRecommendedBooks(items[0].id)
    : [];

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <ShoppingBag className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h1 className="text-2xl font-bold text-readnest-teal mb-2">Your cart is waiting</h1>
            <p className="text-gray-600 mb-8">Please login to view your cart and complete your purchase</p>
            <Button onClick={() => navigate('/login')} className="btn-primary">
              Login to Continue
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <ShoppingBag className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h1 className="text-2xl font-bold text-readnest-teal mb-2">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">Browse our collection and discover your next favorite book</p>
            <Button onClick={() => navigate('/')} className="btn-primary">
              Continue Shopping
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-readnest-teal mb-8">Your Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center pb-4 border-b">
                  <h2 className="text-lg font-semibold">Items ({totalItems})</h2>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearCart}
                    className="text-red-500 hover:text-red-700 flex items-center"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Clear Cart
                  </Button>
                </div>
                
                <ul className="divide-y">
                  {items.map(item => (
                    <li key={item.id} className="py-6 flex flex-col sm:flex-row">
                      <div className="flex-shrink-0 w-24 h-32 sm:mb-0 mb-4 mx-auto sm:mx-0">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="sm:ml-6 flex-grow">
                        <h3 className="text-lg font-medium text-readnest-teal">{item.title}</h3>
                        <p className="text-sm text-gray-600">by {item.author}</p>
                        <p className="text-lg font-bold text-readnest-teal mt-2">${item.price.toFixed(2)}</p>
                        
                        <div className="flex justify-between items-center mt-4">
                          <div className="flex items-center">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="text-readnest-teal"
                              disabled={item.quantity <= 1}
                            >
                              <MinusCircle className="h-5 w-5" />
                            </Button>
                            <span className="mx-2 w-8 text-center">{item.quantity}</span>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="text-readnest-teal"
                            >
                              <PlusCircle className="h-5 w-5" />
                            </Button>
                          </div>
                          
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>$4.99</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span>${(totalPrice * 0.08).toFixed(2)}</span>
                  </div>
                  
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span className="text-readnest-teal">${(totalPrice + 4.99 + totalPrice * 0.08).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <Button 
                  className="w-full btn-primary mt-6" 
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </Button>
                
                <p className="text-xs text-gray-500 mt-4 text-center">
                  By proceeding, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {recommendedBooks.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-readnest-teal mb-6">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {recommendedBooks.map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
