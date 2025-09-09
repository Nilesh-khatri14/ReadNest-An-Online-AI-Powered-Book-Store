
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const SellBooks = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [bookData, setBookData] = useState({
    title: '',
    author: '',
    description: '',
    price: '',
    condition: 'new',
    imageUrl: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to sell books');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('used_books')
        .insert([{
          user_id: user.id,
          title: bookData.title,
          author: bookData.author,
          description: bookData.description,
          price: parseFloat(bookData.price),
          condition: bookData.condition,
          image_url: bookData.imageUrl
        }]);

      if (error) throw error;
      
      toast.success('Book listed successfully!');
      navigate('/exchange');
    } catch (error) {
      toast.error('Error listing book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Package className="h-6 w-6 text-readnest-teal" />
          <h1 className="text-2xl font-bold text-readnest-teal">Sell Your Books</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Book Title</label>
            <Input
              required
              value={bookData.title}
              onChange={(e) => setBookData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter book title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Author</label>
            <Input
              required
              value={bookData.author}
              onChange={(e) => setBookData(prev => ({ ...prev, author: e.target.value }))}
              placeholder="Enter author name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Textarea
              value={bookData.description}
              onChange={(e) => setBookData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the condition and other details of your book"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Price ($)</label>
            <Input
              required
              type="number"
              min="0"
              step="0.01"
              value={bookData.price}
              onChange={(e) => setBookData(prev => ({ ...prev, price: e.target.value }))}
              placeholder="Enter price"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Condition</label>
            <select
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              value={bookData.condition}
              onChange={(e) => setBookData(prev => ({ ...prev, condition: e.target.value }))}
              required
            >
              <option value="new">New</option>
              <option value="like-new">Like New</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Image URL</label>
            <Input
              type="url"
              value={bookData.imageUrl}
              onChange={(e) => setBookData(prev => ({ ...prev, imageUrl: e.target.value }))}
              placeholder="Enter image URL (optional)"
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Listing...' : 'List Book for Sale'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SellBooks;
