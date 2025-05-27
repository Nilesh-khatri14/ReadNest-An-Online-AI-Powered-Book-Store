
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import FeaturedBooks from '@/components/FeaturedBooks';
import FeaturedPublishers from '@/components/FeaturedPublishers';
import Footer from '@/components/Footer';
import { publishers } from '@/data/mock';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Book } from '@/types';
import { fetchFeaturedBooks, fetchNewReleases } from '@/services/booksApi';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [newReleases, setNewReleases] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const featuredPublishers = publishers.slice(0, 4);

  useEffect(() => {
    const loadBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('Loading books from API...');
        
        const [featured, newBooks] = await Promise.all([
          fetchFeaturedBooks(),
          fetchNewReleases()
        ]);
        
        console.log('Featured books loaded:', featured);
        console.log('New releases loaded:', newBooks);
        
        setFeaturedBooks(featured);
        setNewReleases(newBooks);
        
        if (featured.length === 0 && newBooks.length === 0) {
          setError('No books could be loaded from the API');
        }
      } catch (error) {
        console.error('Error loading books:', error);
        setError('Failed to load books from API');
      } finally {
        setLoading(false);
      }
    };
    
    loadBooks();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        
        {loading ? (
          <div className="py-12 flex justify-center">
            <Loader2 className="h-8 w-8 text-readnest-teal dark:text-readnest-accent animate-spin" />
          </div>
        ) : error ? (
          <div className="py-12 flex justify-center">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Retry Loading Books
              </Button>
            </div>
          </div>
        ) : (
          <>
            <FeaturedBooks 
              title="Featured Books" 
              books={featuredBooks} 
              linkTo="/browse"
            />
            
            <FeaturedBooks 
              title="New Releases" 
              books={newReleases} 
              linkTo="/browse"
              viewAllLabel="View all new releases"
            />
          </>
        )}
        
        <FeaturedPublishers publishers={featuredPublishers} />
        
        <section className="py-16 bg-readnest-cream dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-bold text-readnest-teal dark:text-readnest-accent mb-4">
                    AI-Powered Book Recommendations
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Discover books tailored just for you with our advanced recommendation engine.
                    Our AI analyzes your reading preferences to suggest books you'll love.
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start">
                      <span className="text-readnest-teal dark:text-readnest-accent font-bold mr-2">✓</span>
                      <span className="dark:text-gray-300">Personalized suggestions based on your reading history</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-readnest-teal dark:text-readnest-accent font-bold mr-2">✓</span>
                      <span className="dark:text-gray-300">Discover new authors and genres you might enjoy</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-readnest-teal dark:text-readnest-accent font-bold mr-2">✓</span>
                      <span className="dark:text-gray-300">Recommendations improve as you use the platform</span>
                    </li>
                  </ul>
                  
                  <Button asChild className="btn-primary">
                    <Link to="/recommendations">View My Recommendations</Link>
                  </Button>
                </div>
                
                <div className="relative">
                  <div className="bg-readnest-cream dark:bg-gray-700 p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold text-readnest-teal dark:text-readnest-accent mb-4">Because you liked "Quantum Possibilities"</h3>
                    <div className="space-y-4">
                      {featuredBooks.slice(0, 3).map(book => (
                        <div key={book.id} className="flex items-center space-x-4">
                          <img 
                            src={book.image} 
                            alt={book.title} 
                            className="w-16 h-20 object-cover rounded"
                          />
                          <div>
                            <h4 className="font-medium text-readnest-teal dark:text-readnest-accent">{book.title}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{book.author}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="absolute -bottom-6 -right-6 bg-readnest-teal dark:bg-readnest-accent text-white py-2 px-4 rounded shadow-lg transform rotate-3">
                    AI Recommended
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
