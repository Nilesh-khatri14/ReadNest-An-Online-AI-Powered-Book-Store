import React, { createContext, useContext, useState, useEffect } from 'react';
import { Book, Order, ShippingAddress } from '@/types';
import { saveUserOrder as saveOrderToRecommendationHistory } from '@/services/recommendationService';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { TablesInsert } from '@/integrations/supabase/types';
import { toast } from 'sonner';

interface CartItem extends Book {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (book: Book) => void;
  removeFromCart: (bookId: string) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  totalItems: number;
  totalPrice: number;
  processOrder: (shippingDetails: ShippingAddress, paymentMethod: string) => Promise<Order | null>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { user, session, authLoading } = useAuth();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (book: Book) => {
    console.log('Adding book to cart:', book);
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === book.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === book.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...book, quantity: 1 }];
    });
  };

  const removeFromCart = (bookId: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== bookId));
  };

  const updateQuantity = (bookId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(bookId);
      return;
    }
    
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === bookId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('cart'); // Also clear from localStorage
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  const processOrder = async (shippingDetails: ShippingAddress, paymentMethod: string): Promise<Order | null> => {
    if (authLoading) {
      toast.error('Authentication in progress. Please wait.');
      console.error('Auth in progress. Cannot process order.');
      return null;
    }

    if (!user || !session) {
      toast.error('You must be logged in to place an order.');
      console.error('User not authenticated. Cannot process order.');
      return null;
    }

    if (items.length === 0) {
      console.error('Cart is empty. Cannot process order.');
      return null;
    }

    const newOrderData: TablesInsert<'orders'> = {
      user_id: user.id,
      total_amount: getTotalPrice(),
      payment_method: paymentMethod,
      shipping_address: shippingDetails,
      status: 'Processing', // Default status
    };

    console.log('Attempting to insert order:', newOrderData);

    const { data: createdOrder, error: orderError } = await supabase
      .from('orders')
      .insert(newOrderData)
      .select()
      .single();

    if (orderError || !createdOrder) {
      console.error('Error creating order:', orderError);
      // Consider showing a toast to the user here
      return null;
    }

    console.log('Order created successfully:', createdOrder);

    const orderItemsData: TablesInsert<'order_items'>[] = items.map(item => ({
      order_id: createdOrder.id,
      book_id: item.id,
      title: item.title,
      author: item.author,
      image_url: item.image,
      quantity: item.quantity,
      price_at_purchase: item.price,
    }));

    console.log('Attempting to insert order items:', orderItemsData);

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsData);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      // Potentially roll back order creation or mark order as problematic
      // For now, log and continue, but in production, this needs robust handling.
      // Consider showing a toast to the user here
      return null; // Or return the order with a flag indicating item insertion failed
    }

    console.log('Order items created successfully for order:', createdOrder.id);

    // Save each item to recommendation history (existing logic)
    items.forEach(item => {
      for (let i = 0; i < item.quantity; i++) {
        const rating = Math.floor(Math.random() * 3) + 3;
        saveOrderToRecommendationHistory(item, rating);
      }
    });
    
    console.log('Order processed and saved to recommendation history');
    clearCart();
    return createdOrder as Order; // Cast because Supabase types might not perfectly match our extended Order type
  };

  const value: CartContextType = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
    totalItems,
    totalPrice,
    processOrder,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
