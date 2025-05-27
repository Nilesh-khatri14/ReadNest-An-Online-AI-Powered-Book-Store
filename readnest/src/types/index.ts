export type Book = {
  id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  image: string;
  category: string;
  publisher: string;
  publishedDate: string;
  inStock: boolean;
  rating: number;
  reviewCount: number;
};

export type Publisher = {
  id: string;
  name: string;
  logo: string;
  description: string;
  foundedYear: number;
  bookCount: number;
  website: string;
};

export type Feedback = {
  id: string;
  userId: string;
  bookId: string;
  rating: number;
  comment: string;
  date: string;
};

export type UsedBook = {
  id: string;
  user_id: string;
  title: string;
  author: string;
  description?: string;
  price: number;
  condition: string;
  image_url?: string;
  created_at: string;
  status: 'available' | 'sold' | 'exchanged';
};

export type ExchangeRequest = {
  id: string;
  requester_id: string;
  owner_id: string;
  requested_book_id: string;
  offered_book_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
};

export type ShippingAddress = {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
};

export type OrderStatus = 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface OrderItem {
  id: string;
  order_id: string;
  book_id: string;
  title: string;
  author: string;
  image_url?: string | null;
  quantity: number;
  price_at_purchase: number;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  order_date: string;
  status: OrderStatus;
  total_amount: number;
  payment_method: string;
  shipping_address: ShippingAddress;
  created_at: string;
  order_items: OrderItem[]; // For joining with order_items table
}
