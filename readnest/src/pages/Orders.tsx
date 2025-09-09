import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingBag, Calendar, CreditCard, AlertCircle, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Order as OrderType, OrderItem as OrderItemType } from '@/types'; // Renamed to avoid conflict
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton'; // For loading state
import { Button } from '@/components/ui/button'; // Import Button

const Orders = () => {
  const { user, authLoading } = useAuth(); // Use authLoading
  const navigate = useNavigate();
  
  const fetchOrders = async (userId: string | undefined): Promise<OrderType[]> => {
    if (!userId) return [];
    
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *
        )
      `)
      .eq('user_id', userId)
      .order('order_date', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      throw new Error('Failed to fetch orders');
    }
    return data as OrderType[];
  };

  const { data: orders, isLoading: ordersLoading, error: ordersError } = useQuery({
    queryKey: ['orders', user?.id],
    queryFn: () => fetchOrders(user?.id),
    enabled: !!user && !authLoading, // Only run query if user is available and auth is done
  });
  
  React.useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login?redirect=/orders');
    }
  }, [user, authLoading, navigate]);
  
  if (authLoading || (!!user && ordersLoading)) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-readnest-teal">My Orders</h1>
          <Button variant="outline" onClick={() => navigate('/')}>
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  
  if (!user && !authLoading) { // Ensure auth is done before deciding to redirect or show error
    return null; 
  }

  if (ordersError) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <div className="flex justify-end mb-6">
            <Button variant="outline" onClick={() => navigate('/')}>
                <Home className="mr-2 h-4 w-4" />
                Back to Home
            </Button>
        </div>
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-red-700">Error loading orders</h2>
        <p className="text-gray-600">There was a problem fetching your order history. Please try again later.</p>
      </div>
    );
  }
    
  const getStatusColor = (status: OrderType['status']) => { // Use OrderType['status'] for better type safety
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Processing':
        return 'bg-blue-100 text-blue-800';
      case 'Shipped':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-readnest-teal">My Orders</h1>
        <Button variant="outline" onClick={() => navigate('/')} className="bg-readnest-teal hover:bg-readnest-darkTeal text-white">
          <Home className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </div>
      
      <div className="space-y-6">
        {orders && orders.map(order => (
          <Card key={order.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg text-readnest-teal">Order #{order.id.substring(0,8)}...</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(order.order_date).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(order.status)}>
                  {order.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Order items */}
                <div className="space-y-2">
                  {order.order_items && order.order_items.map((item: OrderItemType) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="h-16 w-12 flex-shrink-0 overflow-hidden rounded-sm">
                        <img 
                          src={item.image_url || 'https://via.placeholder.com/48x64?text=No+Image'} 
                          alt={item.title} 
                          className="h-full w-full object-cover" 
                        />
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-medium text-readnest-teal">{item.title}</h3>
                        <p className="text-sm text-gray-500">by {item.author}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${item.price_at_purchase.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Separator />
                
                {/* Order details */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm text-gray-600">
                    <CreditCard className="h-4 w-4 mr-1" />
                    {order.payment_method}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-600">
                      {order.order_items?.reduce((acc, item) => acc + item.quantity, 0) || 0} {order.order_items?.reduce((acc, item) => acc + item.quantity, 0) === 1 ? 'item' : 'items'}
                    </div>
                    <div className="font-bold text-readnest-teal text-lg">
                      Total: ${order.total_amount.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {orders && orders.length === 0 && !ordersLoading && ( // Add !ordersLoading here
          <Card>
            <CardContent className="flex flex-col items-center py-8">
              <ShoppingBag className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-700">No orders yet</h3>
              <p className="text-gray-500 mt-2">Browse our catalog and make your first purchase!</p>
              <Button onClick={() => navigate('/browse')} className="mt-4 bg-readnest-teal hover:bg-readnest-darkTeal text-white">Browse Books</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Orders;
