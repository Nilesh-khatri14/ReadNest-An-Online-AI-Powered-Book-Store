
import React from 'react';
import { Book } from '@/types';
import { Star, ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const { addToCart } = useCart();
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
      <div className="h-48 overflow-hidden">
        <img 
          src={book.image} 
          alt={book.title} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <Link to={`/book/${book.id}`}>
          <h3 className="text-lg font-semibold text-readnest-teal truncate">{book.title}</h3>
        </Link>
        <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
        
        <div className="flex items-center mb-2">
          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
          <span className="text-sm ml-1">{book.rating?.toFixed(1) || "0.0"}</span>
          <span className="text-xs text-gray-500 ml-1">({book.reviewCount || 0} reviews)</span>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <span className="text-lg font-bold text-readnest-teal">${book.price.toFixed(2)}</span>
          <Button 
            size="sm" 
            className="btn-primary"
            onClick={() => addToCart(book)}
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
