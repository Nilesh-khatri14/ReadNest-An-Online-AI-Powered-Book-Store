
import { Book } from '@/types';

const API_BASE_URL = 'https://www.googleapis.com/books/v1/volumes';

// Helper function to generate realistic book prices based on category and publication date
const generateRealisticPrice = (category: string, publishedDate: string, hasRealPrice: boolean = false) => {
  if (hasRealPrice) return null; // Don't override real prices
  
  const currentYear = new Date().getFullYear();
  const pubYear = parseInt(publishedDate?.substring(0, 4)) || currentYear;
  const age = currentYear - pubYear;
  
  // Base prices by category
  const basePrices: { [key: string]: number } = {
    'Fiction': 12.99,
    'Science': 18.99,
    'History': 16.99,
    'Biography': 14.99,
    'Romance': 11.99,
    'Fantasy': 13.99,
    'Mystery': 12.99,
    'Thriller': 13.99,
    'Self-help': 15.99,
    'Business': 19.99,
    'Technology': 22.99,
    'Health': 17.99,
    'Travel': 16.99,
    'Cooking': 15.99,
    'Art': 24.99,
    'Religion': 14.99,
    'Philosophy': 17.99,
    'Education': 19.99,
    'Children': 9.99,
    'Young Adult': 11.99
  };
  
  const basePrice = basePrices[category] || 14.99;
  
  // Adjust price based on age (newer books cost more)
  let priceAdjustment = 1;
  if (age <= 1) priceAdjustment = 1.2; // New releases 20% more
  else if (age <= 3) priceAdjustment = 1.1; // Recent books 10% more
  else if (age > 10) priceAdjustment = 0.8; // Older books 20% less
  
  const finalPrice = basePrice * priceAdjustment;
  return Math.round(finalPrice * 100) / 100; // Round to 2 decimal places
};

export const fetchBooks = async (query: string = 'subject:fiction', maxResults: number = 12): Promise<Book[]> => {
  try {
    console.log('Fetching books with query:', query);
    const response = await fetch(`${API_BASE_URL}?q=${encodeURIComponent(query)}&maxResults=${maxResults}&key=`);
    
    if (!response.ok) {
      console.error('API response not ok:', response.status, response.statusText);
      throw new Error(`Failed to fetch books: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('API response data:', data);
    
    if (!data.items || data.items.length === 0) {
      console.log('No books found in API response');
      return [];
    }
    
    // Transform the Google Books API response to our Book type
    const books = data.items.map((item: any) => {
      const volumeInfo = item.volumeInfo || {};
      const imageLinks = volumeInfo.imageLinks || {};
      const saleInfo = item.saleInfo || {};
      
      // Try to get real price from API
      let price = null;
      let hasRealPrice = false;
      
      if (saleInfo.retailPrice?.amount) {
        price = saleInfo.retailPrice.amount;
        hasRealPrice = true;
        console.log(`Real price found for ${volumeInfo.title}: $${price}`);
      } else if (saleInfo.listPrice?.amount) {
        price = saleInfo.listPrice.amount;
        hasRealPrice = true;
        console.log(`List price found for ${volumeInfo.title}: $${price}`);
      }
      
      // If no real price, generate realistic one
      if (!price) {
        const category = volumeInfo.categories ? volumeInfo.categories[0] : 'General';
        price = generateRealisticPrice(category, volumeInfo.publishedDate, hasRealPrice);
      }
      
      return {
        id: item.id,
        title: volumeInfo.title || 'Unknown Title',
        author: volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Unknown Author',
        description: volumeInfo.description || 'No description available',
        price: price || 14.99,
        image: imageLinks.thumbnail || imageLinks.smallThumbnail || '/placeholder.svg',
        category: volumeInfo.categories ? volumeInfo.categories[0] : 'General',
        publisher: volumeInfo.publisher || 'Unknown Publisher',
        publishedDate: volumeInfo.publishedDate || 'Unknown',
        inStock: true,
        rating: volumeInfo.averageRating || Math.floor(Math.random() * 2) + 3.5, // 3.5-4.5 range
        reviewCount: volumeInfo.ratingsCount || Math.floor(Math.random() * 200) + 10
      };
    });
    
    console.log('Transformed books with realistic pricing:', books);
    return books;
  } catch (error) {
    console.error('Error fetching books:', error);
    // Return some fallback data so the UI doesn't break
    return [
      {
        id: 'fallback-1',
        title: 'Sample Book 1',
        author: 'Sample Author',
        description: 'This is a sample book while we fetch real data.',
        price: 12.99,
        image: '/placeholder.svg',
        category: 'Fiction',
        publisher: 'Sample Publisher',
        publishedDate: '2024',
        inStock: true,
        rating: 4.5,
        reviewCount: 123
      },
      {
        id: 'fallback-2',
        title: 'Sample Book 2',
        author: 'Another Author',
        description: 'Another sample book.',
        price: 15.99,
        image: '/placeholder.svg',
        category: 'Non-Fiction',
        publisher: 'Sample Publisher',
        publishedDate: '2024',
        inStock: true,
        rating: 4.2,
        reviewCount: 87
      }
    ];
  }
};

export const fetchBooksByCategory = async (category: string, maxResults: number = 12): Promise<Book[]> => {
  console.log(`Fetching books for category: ${category}`);
  return fetchBooks(`subject:${category}`, maxResults);
};

export const fetchFeaturedBooks = async (): Promise<Book[]> => {
  // Get a mix of popular books across different categories
  const categories = ['bestsellers', 'popular', 'trending'];
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  return fetchBooks(`${randomCategory}+orderBy:relevance`, 4);
};

export const fetchNewReleases = async (): Promise<Book[]> => {
  const currentYear = new Date().getFullYear();
  return fetchBooks(`publishedDate:${currentYear}`, 4);
};

export const fetchBookById = async (id: string): Promise<Book | null> => {
  try {
    console.log('Fetching book by ID:', id);
    const response = await fetch(`${API_BASE_URL}/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch book');
    }
    
    const item = await response.json();
    const volumeInfo = item.volumeInfo || {};
    const imageLinks = volumeInfo.imageLinks || {};
    
    return {
      id: item.id,
      title: volumeInfo.title || 'Unknown Title',
      author: volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Unknown Author',
      description: volumeInfo.description || 'No description available',
      price: item.saleInfo?.retailPrice?.amount || Math.floor(Math.random() * 30) + 5,
      image: imageLinks.thumbnail || imageLinks.smallThumbnail || '/placeholder.svg',
      category: volumeInfo.categories ? volumeInfo.categories[0] : 'General',
      publisher: volumeInfo.publisher || 'Unknown Publisher',
      publishedDate: volumeInfo.publishedDate || 'Unknown',
      inStock: true,
      rating: volumeInfo.averageRating || Math.floor(Math.random() * 5) + 1,
      reviewCount: volumeInfo.ratingsCount || Math.floor(Math.random() * 100) + 1
    };
  } catch (error) {
    console.error('Error fetching book:', error);
    return null;
  }
};

export const searchBooks = async (searchTerm: string, maxResults: number = 12): Promise<Book[]> => {
  console.log(`Searching for books with term: ${searchTerm}`);
  return fetchBooks(`intitle:${searchTerm} OR inauthor:${searchTerm}`, maxResults);
};
