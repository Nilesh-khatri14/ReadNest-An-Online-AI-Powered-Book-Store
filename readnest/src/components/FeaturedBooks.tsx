
import React from 'react';
import { Book } from '@/types';
import BookCard from './BookCard';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface FeaturedBooksProps {
  title: string;
  books: Book[];
  linkTo?: string;
  maxDisplay?: number;
  viewAllLabel?: string;
  categoryFilter?: string;
}

const FeaturedBooks: React.FC<FeaturedBooksProps> = ({ 
  title, 
  books, 
  linkTo,
  maxDisplay = 4,
  viewAllLabel = "View all",
  categoryFilter
}) => {
  let displayBooks = books;
  
  // Apply category filter if provided
  if (categoryFilter) {
    displayBooks = books.filter(book => book.category === categoryFilter);
  }
  
  // Limit number of books displayed
  displayBooks = displayBooks.slice(0, maxDisplay);
  
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-readnest-teal">{title}</h2>
          {linkTo && (
            <Link 
              to={linkTo} 
              className="text-readnest-teal hover:text-readnest-darkTeal flex items-center"
            >
              {viewAllLabel} <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          )}
        </div>
        
        {displayBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayBooks.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No books found in this category</p>
            {linkTo && (
              <Button asChild variant="outline">
                <Link to={linkTo}>Browse all books</Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedBooks;
