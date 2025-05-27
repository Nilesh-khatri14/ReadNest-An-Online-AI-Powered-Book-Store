
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Upload, Book, CheckCircle, BookOpen, Library, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { publishers } from '@/data/mock';
import PublisherCard from '@/components/PublisherCard';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Publish = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    author: user?.name || '',
    description: '',
    price: '',
    category: '',
    isbn: '',
    pages: '',
    publishDate: '',
    coverImage: null as File | null
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, coverImage: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const requiredFields = ['title', 'author', 'description', 'price', 'category'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Book submitted successfully!');
      setIsSubmitted(true);
    } catch (error) {
      toast.error('Failed to submit book: ' + (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-readnest-teal mb-2">Submission Received!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for submitting your book. Our team will review your submission and get back to you shortly.
            </p>
            <Button onClick={() => navigate('/')} className="btn-primary">
              Return to Home
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
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-readnest-teal text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl font-bold mb-4">Publish Your Book with ReadNest</h1>
              <p className="text-xl mb-8">
                Join our community of authors and reach readers around the world.
                We support independent authors and small publishers with our dedicated platform.
              </p>
              <div className="flex flex-wrap justify-center gap-8 mt-12">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <BookOpen className="h-8 w-8" />
                  </div>
                  <p className="font-medium">Easy Publishing</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="h-8 w-8" />
                  </div>
                  <p className="font-medium">Global Reach</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Library className="h-8 w-8" />
                  </div>
                  <p className="font-medium">Author Support</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Publishers Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-readnest-teal mb-2 text-center">Featured Publishers</h2>
            <p className="text-lg text-gray-600 mb-12 text-center max-w-3xl mx-auto">
              Partner with our network of independent publishers to bring your work to a wider audience.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {publishers.map(publisher => (
                <PublisherCard key={publisher.id} publisher={publisher} />
              ))}
            </div>
          </div>
        </section>
        
        {/* Publish Form Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-readnest-teal mb-6 text-center">Submit Your Book</h2>
              
              {!isAuthenticated ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <p className="text-lg text-gray-600 mb-6">
                    Please login to submit your book for publication
                  </p>
                  <Button onClick={() => navigate('/login')} className="btn-primary">
                    Login to Continue
                  </Button>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <form onSubmit={handleSubmit}>
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <Label htmlFor="title">Book Title *</Label>
                            <Input
                              id="title"
                              name="title"
                              value={formData.title}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="author">Author *</Label>
                            <Input
                              id="author"
                              name="author"
                              value={formData.author}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="description">Book Description *</Label>
                          <Textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="min-h-[120px]"
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <Label htmlFor="price">Price (USD) *</Label>
                            <Input
                              id="price"
                              name="price"
                              type="number"
                              step="0.01"
                              value={formData.price}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="category">Category *</Label>
                            <select
                              id="category"
                              name="category"
                              value={formData.category}
                              onChange={handleChange}
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              required
                            >
                              <option value="">Select Category</option>
                              <option value="Fiction">Fiction</option>
                              <option value="Non-fiction">Non-fiction</option>
                              <option value="Science">Science</option>
                              <option value="History">History</option>
                              <option value="Business">Business</option>
                              <option value="Self-Help">Self-Help</option>
                              <option value="Cooking">Cooking</option>
                            </select>
                          </div>
                          
                          <div>
                            <Label htmlFor="isbn">ISBN (Optional)</Label>
                            <Input
                              id="isbn"
                              name="isbn"
                              value={formData.isbn}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <Label htmlFor="pages">Number of Pages (Optional)</Label>
                            <Input
                              id="pages"
                              name="pages"
                              type="number"
                              value={formData.pages}
                              onChange={handleChange}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="publishDate">Publish Date (Optional)</Label>
                            <Input
                              id="publishDate"
                              name="publishDate"
                              type="date"
                              value={formData.publishDate}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="coverImage">Cover Image (Optional)</Label>
                          <div className="mt-1 flex items-center">
                            <label
                              htmlFor="coverImage"
                              className="flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-readnest-teal focus:outline-none"
                            >
                              <span className="flex items-center space-x-2">
                                <Upload className="w-6 h-6 text-gray-600" />
                                <span className="font-medium text-gray-600">
                                  {formData.coverImage ? formData.coverImage.name : 'Click to upload cover image'}
                                </span>
                              </span>
                              <input
                                id="coverImage"
                                name="coverImage"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-8 flex justify-end">
                        <Button
                          type="submit"
                          className="btn-primary"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Submitting...' : 'Submit Book'}
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-readnest-teal mb-12 text-center">How It Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-16 h-16 bg-readnest-teal/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-8 w-8 text-readnest-teal" />
                </div>
                <h3 className="text-xl font-semibold text-readnest-teal mb-2">1. Submit Your Book</h3>
                <p className="text-gray-600">
                  Fill out our simple form with your book details and upload your manuscript.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-16 h-16 bg-readnest-teal/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Book className="h-8 w-8 text-readnest-teal" />
                </div>
                <h3 className="text-xl font-semibold text-readnest-teal mb-2">2. Review Process</h3>
                <p className="text-gray-600">
                  Our team reviews your submission and works with you to prepare it for publication.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-16 h-16 bg-readnest-teal/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-readnest-teal" />
                </div>
                <h3 className="text-xl font-semibold text-readnest-teal mb-2">3. Publish & Sell</h3>
                <p className="text-gray-600">
                  Your book is published on our platform and made available to readers worldwide.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Publish;
