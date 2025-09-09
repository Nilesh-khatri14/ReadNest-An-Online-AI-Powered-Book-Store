
import { Book } from '@/types';

// Simple in-memory storage for user order history
let userOrderHistory: Array<{
  book: Book;
  rating: number;
  timestamp: Date;
}> = [];

// Get user order history
export const getUserOrderHistory = () => {
  return userOrderHistory;
};

// Save a user order
export const saveUserOrder = (book: Book, rating: number) => {
  userOrderHistory.push({
    book,
    rating,
    timestamp: new Date()
  });
  
  console.log('Order saved to history:', { book: book.title, rating });
  console.log('Total orders in history:', userOrderHistory.length);
};

// Calculate cosine similarity between two books based on their features
const calculateCosineSimilarity = (book1: Book, book2: Book): number => {
  // Convert book features to vectors
  const getBookVector = (book: Book): number[] => {
    // Category similarity (convert to numerical values)
    const categoryScore = book.category === book1.category ? 1 : 0;
    
    // Price similarity (normalized to 0-1 scale)
    const priceScore = 1 - Math.abs(book.price - book1.price) / Math.max(book.price, book1.price);
    
    // Rating similarity
    const ratingScore = 1 - Math.abs(book.rating - book1.rating) / 5;
    
    // Publisher similarity
    const publisherScore = book.publisher === book1.publisher ? 1 : 0;
    
    return [categoryScore, priceScore, ratingScore, publisherScore];
  };
  
  const vector1 = getBookVector(book1);
  const vector2 = getBookVector(book2);
  
  // Calculate dot product
  const dotProduct = vector1.reduce((sum, val, i) => sum + val * vector2[i], 0);
  
  // Calculate magnitudes
  const magnitude1 = Math.sqrt(vector1.reduce((sum, val) => sum + val * val, 0));
  const magnitude2 = Math.sqrt(vector2.reduce((sum, val) => sum + val * val, 0));
  
  // Avoid division by zero
  if (magnitude1 === 0 || magnitude2 === 0) return 0;
  
  return dotProduct / (magnitude1 * magnitude2);
};

// Get book recommendations using collaborative filtering and content-based filtering
export const generatePersonalizedRecommendations = async (): Promise<Book[]> => {
  try {
    // Fetch books from the API
    const response = await fetch('https://www.googleapis.com/books/v1/volumes?q=fiction&maxResults=40&printType=books&langRestrict=en');
    const data = await response.json();
    
    if (!data.items) {
      console.log('No books found from API, using fallback data');
      return [];
    }
    
    const allBooks: Book[] = data.items
      .filter((item: any) => item.volumeInfo && item.volumeInfo.title && item.volumeInfo.authors)
      .map((item: any) => ({
        id: item.id,
        title: item.volumeInfo.title,
        author: item.volumeInfo.authors ? item.volumeInfo.authors.join(', ') : 'Unknown Author',
        description: item.volumeInfo.description || 'No description available',
        price: Math.round((Math.random() * 25 + 10) * 100) / 100, // Random price between $10-35
        image: item.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/400x600?text=No+Cover',
        category: item.volumeInfo.categories ? item.volumeInfo.categories[0] : 'Fiction',
        publisher: item.volumeInfo.publisher || 'Unknown Publisher',
        publishedDate: item.volumeInfo.publishedDate || 'Unknown',
        inStock: true,
        rating: Math.round((Math.random() * 2 + 3) * 10) / 10, // Random rating between 3.0-5.0
        reviewCount: Math.floor(Math.random() * 200) + 10
      }));
    
    console.log('Fetched books for recommendations:', allBooks.length);
    
    // If no order history, return random recommendations
    if (userOrderHistory.length === 0) {
      console.log('No order history found, returning random recommendations');
      return allBooks.slice(0, 8);
    }
    
    console.log('Generating recommendations based on', userOrderHistory.length, 'previous orders');
    
    // Calculate recommendations based on user's order history
    const bookScores = new Map<string, number>();
    
    // Content-based filtering: find books similar to previously ordered books
    userOrderHistory.forEach(order => {
      const userBook = order.book;
      const userRating = order.rating;
      const daysSincePurchase = Math.floor((Date.now() - order.timestamp.getTime()) / (1000 * 60 * 60 * 24));
      
      // Time decay factor (recent orders have more weight)
      const timeWeight = Math.exp(-daysSincePurchase / 30); // Decay over 30 days
      
      allBooks.forEach(book => {
        if (book.id !== userBook.id) { // Don't recommend books already purchased
          const similarity = calculateCosineSimilarity(userBook, book);
          const score = similarity * userRating * timeWeight;
          
          const currentScore = bookScores.get(book.id) || 0;
          bookScores.set(book.id, currentScore + score);
        }
      });
    });
    
    // Sort books by score and return top recommendations
    const recommendations = allBooks
      .filter(book => bookScores.has(book.id))
      .sort((a, b) => (bookScores.get(b.id) || 0) - (bookScores.get(a.id) || 0))
      .slice(0, 8);
    
    console.log('Generated recommendations:', recommendations.length);
    console.log('Top recommendation scores:', 
      recommendations.slice(0, 3).map(book => ({
        title: book.title,
        score: bookScores.get(book.id)
      }))
    );
    
    return recommendations;
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return [];
  }
};

// KNN-based recommendation function
export const getKNNRecommendations = (targetBook: Book, allBooks: Book[], k: number = 5): Book[] => {
  // Calculate similarities and sort
  const similarities = allBooks
    .filter(book => book.id !== targetBook.id)
    .map(book => ({
      book,
      similarity: calculateCosineSimilarity(targetBook, book)
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, k);
  
  return similarities.map(item => item.book);
};
