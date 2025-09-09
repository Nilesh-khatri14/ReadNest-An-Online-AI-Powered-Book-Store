
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BookCard from '@/components/BookCard';
import { Book } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Search, SlidersHorizontal, Loader2 } from 'lucide-react';
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger, 
  SheetClose 
} from '@/components/ui/sheet';
import { fetchBooksByCategory, searchBooks, fetchBooks } from '@/services/booksApi';

const Browse = () => {
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Define categories we want to fetch
  const categories = [
    'all',
    'fiction',
    'science',
    'history',
    'biography',
    'fantasy',
    'mystery',
    'romance',
    'technology',
    'health',
    'business'
  ];
  
  useEffect(() => {
    const loadBooks = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log('Loading books from Google Books API...');
        
        // Fetch books from multiple categories to get at least 10 books per category
        const bookPromises = [
          fetchBooksByCategory('fiction', 12),
          fetchBooksByCategory('science', 12),
          fetchBooksByCategory('history', 12),
          fetchBooksByCategory('biography', 12),
          fetchBooksByCategory('fantasy', 12),
          fetchBooksByCategory('mystery', 12),
          fetchBooksByCategory('romance', 12),
          fetchBooksByCategory('technology', 12),
          fetchBooksByCategory('health', 12),
          fetchBooksByCategory('business', 12)
        ];
        
        const bookResults = await Promise.all(bookPromises);
        const allBooksData = bookResults.flat();
        
        console.log('Total books loaded:', allBooksData.length);
        setAllBooks(allBooksData);
        
        if (allBooksData.length === 0) {
          setError('No books could be loaded from the API');
        }
      } catch (error) {
        console.error('Error loading books:', error);
        setError('Failed to load books from API');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadBooks();
  }, []);
  
  // Handle search
  useEffect(() => {
    if (searchQuery.trim()) {
      const searchForBooks = async () => {
        setIsLoading(true);
        try {
          const searchResults = await searchBooks(searchQuery, 20);
          setAllBooks(searchResults);
        } catch (error) {
          console.error('Error searching books:', error);
        } finally {
          setIsLoading(false);
        }
      };
      
      const timeoutId = setTimeout(searchForBooks, 500); // Debounce search
      return () => clearTimeout(timeoutId);
    }
  }, [searchQuery]);
  
  // Extract unique categories from loaded books
  const availableCategories = ['all', ...Array.from(new Set(allBooks.map(book => book.category)))];
  
  // Filter and sort books
  const filteredBooks = allBooks.filter(book => {
    const matchesSearch = !searchQuery.trim() || 
                         book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = category === 'all' || book.category.toLowerCase() === category.toLowerCase();
    const matchesPrice = book.price >= priceRange[0] && book.price <= priceRange[1];
    
    return matchesSearch && matchesCategory && matchesPrice;
  });
  
  // Sort books based on selected option
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();
      default: // popular (by review count)
        return b.reviewCount - a.reviewCount;
    }
  });
  
  // Group books by category for display
  const booksByCategory: Record<string, Book[]> = {};
  
  if (category === 'all' && !searchQuery.trim()) {
    // If not filtering by category and not searching, group books by their categories
    sortedBooks.forEach(book => {
      if (!booksByCategory[book.category]) {
        booksByCategory[book.category] = [];
      }
      booksByCategory[book.category].push(book);
    });
  } else {
    // If filtering by category or searching, just use the filtered and sorted results
    const categoryKey = searchQuery.trim() ? 'Search Results' : category;
    booksByCategory[categoryKey] = sortedBooks;
  }
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <div className="container mx-auto px-4 py-12 flex justify-center items-center">
            <div className="text-center">
              <Loader2 className="h-8 w-8 text-readnest-teal dark:text-readnest-accent animate-spin mx-auto mb-4" />
              <div className="text-2xl text-readnest-teal dark:text-readnest-accent">Loading books from Google Books API...</div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <div className="container mx-auto px-4 py-12 flex justify-center items-center">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Retry Loading Books
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <section className="bg-readnest-cream dark:bg-gray-800 py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold text-readnest-teal dark:text-readnest-accent mb-8">Browse Books</h1>
            
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-grow">
                <Input
                  type="text"
                  placeholder="Search by title or author..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
                <Search className="absolute left-3 top-3 h-4 w-4 text-readnest-teal dark:text-readnest-accent opacity-70" />
              </div>
              
              <div className="flex gap-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[160px] dark:bg-gray-700 dark:text-white dark:border-gray-600">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
                
                <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="gap-2 dark:bg-gray-700 dark:text-white dark:border-gray-600">
                      <SlidersHorizontal className="h-4 w-4" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Filter Books</SheetTitle>
                      <SheetDescription>
                        Customize your book browsing experience
                      </SheetDescription>
                    </SheetHeader>
                    
                    <div className="py-6 space-y-6">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Category</h3>
                        <Select value={category} onValueChange={setCategory}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableCategories.map(cat => (
                              <SelectItem key={cat} value={cat}>
                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <h3 className="text-sm font-medium">Price Range</h3>
                          <span className="text-sm text-gray-600">
                            ${priceRange[0]} - ${priceRange[1]}
                          </span>
                        </div>
                        <Slider
                          defaultValue={[0, 100]}
                          max={100}
                          step={1}
                          value={priceRange}
                          onValueChange={setPriceRange}
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-4 space-x-2">
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setCategory('all');
                          setPriceRange([0, 100]);
                        }}
                      >
                        Reset
                      </Button>
                      <SheetClose asChild>
                        <Button onClick={() => setIsFilterSheetOpen(false)}>Apply Filters</Button>
                      </SheetClose>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
            
            {searchQuery && (
              <div className="mb-6">
                <h2 className="text-lg text-gray-600 dark:text-gray-300 mb-2">
                  {sortedBooks.length} results for "{searchQuery}"
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {sortedBooks.map(book => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>
              </div>
            )}
            
            {!searchQuery && Object.keys(booksByCategory).length === 0 && (
              <div className="text-center py-12">
                <h2 className="text-xl text-gray-600 dark:text-gray-300">No books found matching your filters</h2>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setCategory('all');
                    setPriceRange([0, 100]);
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            )}
            
            {!searchQuery && Object.keys(booksByCategory).map(cat => (
              <div key={cat} className="mb-12">
                <h2 className="text-2xl font-semibold text-readnest-teal dark:text-readnest-accent mb-6">
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {booksByCategory[cat].slice(0, 12).map(book => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>
                
                {booksByCategory[cat].length > 12 && (
                  <div className="mt-4 text-center">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setCategory(cat);
                        setSearchQuery('');
                      }}
                    >
                      View all {booksByCategory[cat].length} {cat.toLowerCase()} books
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Browse;
