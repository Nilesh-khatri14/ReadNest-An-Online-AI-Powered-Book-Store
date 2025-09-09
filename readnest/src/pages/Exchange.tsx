
import React, { useEffect, useState } from 'react';
import { Book, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { UsedBook, ExchangeRequest } from '@/types';
import { toast } from 'sonner';

const Exchange = () => {
  const { user } = useAuth();
  const [usedBooks, setUsedBooks] = useState<UsedBook[]>([]);
  const [myBooks, setMyBooks] = useState<UsedBook[]>([]);
  const [exchangeRequests, setExchangeRequests] = useState<ExchangeRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUsedBooks();
      fetchMyBooks();
      fetchExchangeRequests();
    }
  }, [user]);

  const fetchUsedBooks = async () => {
    try {
      const { data, error } = await supabase
        .from('used_books')
        .select('*')
        .eq('status', 'available')
        .neq('user_id', user?.id);

      if (error) throw error;
      setUsedBooks(data as UsedBook[] || []);
    } catch (error) {
      toast.error('Error fetching books');
    }
  };

  const fetchMyBooks = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('used_books')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'available');

      if (error) throw error;
      setMyBooks(data as UsedBook[] || []);
    } catch (error) {
      toast.error('Error fetching your books');
    }
  };

  const fetchExchangeRequests = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('exchange_requests')
        .select('*')
        .or(`requester_id.eq.${user.id},owner_id.eq.${user.id}`);

      if (error) throw error;
      setExchangeRequests(data as ExchangeRequest[] || []);
      setLoading(false);
    } catch (error) {
      toast.error('Error fetching exchange requests');
      setLoading(false);
    }
  };

  const handleExchangeRequest = async (requestedBookId: string, offeredBookId: string, ownerId: string) => {
    try {
      const { error } = await supabase
        .from('exchange_requests')
        .insert([{
          requester_id: user?.id,
          owner_id: ownerId,
          requested_book_id: requestedBookId,
          offered_book_id: offeredBookId
        }]);

      if (error) throw error;
      toast.success('Exchange request sent!');
      fetchExchangeRequests();
    } catch (error) {
      toast.error('Error sending exchange request');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Book className="h-6 w-6 text-readnest-teal" />
        <h1 className="text-2xl font-bold text-readnest-teal">Book Exchange</h1>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Available for Exchange</h2>
            <div className="space-y-4">
              {usedBooks.map((book) => (
                <div key={book.id} className="border p-4 rounded-lg">
                  <h3 className="font-semibold">{book.title}</h3>
                  <p className="text-sm text-gray-600">by {book.author}</p>
                  <p className="text-sm">Condition: {book.condition}</p>
                  {myBooks.length > 0 ? (
                    <div className="mt-2">
                      <select
                        className="w-full rounded-md border border-input bg-background px-3 py-2 mb-2"
                        onChange={(e) => {
                          if (e.target.value) {
                            handleExchangeRequest(book.id, e.target.value, book.user_id);
                          }
                        }}
                        defaultValue=""
                      >
                        <option value="" disabled>Select a book to exchange</option>
                        {myBooks.map((myBook) => (
                          <option key={myBook.id} value={myBook.id}>
                            {myBook.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 mt-2">
                      List your books to propose exchanges
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Exchange Requests</h2>
            <div className="space-y-4">
              {exchangeRequests.map((request) => (
                <div key={request.id} className="border p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span>{request.requested_book_id}</span>
                    <ArrowRight className="h-4 w-4" />
                    <span>{request.offered_book_id}</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Status: {request.status}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Exchange;
