
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Star, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { books } from '@/data/mock';
import { toast } from 'sonner';

const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Get random purchased book for feedback
  const purchasedBook = books[Math.floor(Math.random() * books.length)];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Thank you for your feedback!');
      setIsSubmitted(true);
    } catch (error) {
      toast.error('Failed to submit feedback: ' + (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-12">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold text-readnest-teal mb-4">Share Your Feedback</h1>
            <p className="text-lg text-gray-600 mb-8">
              Please login to share your thoughts on your recent purchases
            </p>
            <Button onClick={() => navigate('/login')} className="btn-primary">
              Login to Continue
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ThumbsUp className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-readnest-teal mb-2">Thank You!</h2>
            <p className="text-gray-600 mb-6">
              We appreciate you taking the time to share your feedback. Your input helps us improve our services.
            </p>
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
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-readnest-teal mb-8 text-center">Share Your Feedback</h1>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-center mb-8">
                <div className="md:w-24 w-full flex-shrink-0 mb-4 md:mb-0">
                  <img 
                    src={purchasedBook.image} 
                    alt={purchasedBook.title} 
                    className="w-24 h-32 object-cover mx-auto md:mx-0"
                  />
                </div>
                <div className="md:ml-6">
                  <h2 className="text-xl font-semibold text-readnest-teal">{purchasedBook.title}</h2>
                  <p className="text-gray-600">by {purchasedBook.author}</p>
                  <p className="text-sm text-gray-500 mt-2">Purchased on {new Date().toLocaleDateString()}</p>
                </div>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    How would you rate this book?
                  </label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="focus:outline-none"
                      >
                        <Star 
                          className={`h-8 w-8 ${
                            star <= (hoveredRating || rating)
                              ? 'text-yellow-500 fill-yellow-500'
                              : 'text-gray-300'
                          }`} 
                        />
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="comment" className="block text-gray-700 font-medium mb-2">
                    Share your thoughts
                  </label>
                  <Textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="What did you like or dislike about this book?"
                    className="min-h-[120px]"
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    className="btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Feedback;
