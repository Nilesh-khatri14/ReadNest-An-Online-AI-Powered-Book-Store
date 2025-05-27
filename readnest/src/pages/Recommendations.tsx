
import React, { useEffect, useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import Navbar from '@/components/Navbar';
import BookCard from '@/components/BookCard';
import Footer from '@/components/Footer';
import { Book } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { generatePersonalizedRecommendations } from '@/services/recommendationService';
import { useCart } from '@/contexts/CartContext';
import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const { addToCart } = useCart();

  const loadRecommendations = async () => {
    setIsLoading(true);
    try {
      console.log('Loading personalized recommendations...');
      const books = await generatePersonalizedRecommendations();
      setRecommendations(books);
      
      toast({
        description: "Recommendations updated based on your reading history!",
      });
    } catch (error) {
      console.error('Failed to load recommendations:', error);
      toast({
        title: "Error",
        description: "Failed to load recommendations. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRecommendations();
  }, [user]);

  const handleAddToCart = (book: Book) => {
    addToCart(book);
    toast({
      description: `${book.title} added to cart`,
    });
  };

  const handleRefreshRecommendations = () => {
    loadRecommendations();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-readnest-teal dark:text-readnest-accent mb-2">
                Your Personalized Recommendations
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Books selected using AI-powered recommendation engine based on your reading preferences and purchase history.
              </p>
            </div>
            <Button
              onClick={handleRefreshRecommendations}
              variant="outline"
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                AI-Powered Recommendations
              </span>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              Using KNN algorithm and cosine similarity to match your preferences
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 text-readnest-teal dark:text-readnest-accent animate-spin mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-300">
                Analyzing your reading patterns...
              </p>
            </div>
          </div>
        ) : recommendations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recommendations.map(book => (
              <div key={book.id} className="flex flex-col h-full">
                <BookCard book={book} />
                <button 
                  onClick={() => handleAddToCart(book)}
                  className="mt-2 px-4 py-2 bg-readnest-teal hover:bg-readnest-darkTeal dark:bg-readnest-accent dark:hover:bg-readnest-accent/80 text-white rounded transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-4">
              No recommendations available at this time.
            </p>
            <Button onClick={handleRefreshRecommendations} variant="outline">
              Try Again
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Recommendations;
