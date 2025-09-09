
import { Book, Publisher } from '../types';

export const books: Book[] = [
  {
    id: '1',
    title: 'The Silent Echo',
    author: 'Elena Michaels',
    description: 'A haunting tale of loss, memory, and the echoes of the past that linger in the present.',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=387&auto=format&fit=crop',
    category: 'Fiction',
    publisher: 'Moonlight Press',
    publishedDate: '2023-06-12',
    inStock: true,
    rating: 4.5,
    reviewCount: 128
  },
  {
    id: '2',
    title: 'Quantum Possibilities',
    author: 'Dr. Nathan Reed',
    description: 'An exploration of quantum physics and its implications for our understanding of reality.',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1629992101753-56d196c8aabb?q=80&w=390&auto=format&fit=crop',
    category: 'Science',
    publisher: 'Enlighten Publishing',
    publishedDate: '2023-02-28',
    inStock: true,
    rating: 4.8,
    reviewCount: 75
  },
  {
    id: '3',
    title: 'Culinary Journeys',
    author: 'Sofia Rodriguez',
    description: 'A delightful collection of recipes and stories from around the world.',
    price: 29.95,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=387&auto=format&fit=crop',
    category: 'Cooking',
    publisher: 'Flavor House',
    publishedDate: '2022-11-15',
    inStock: true,
    rating: 4.7,
    reviewCount: 203
  },
  {
    id: '4',
    title: 'The Art of Mindfulness',
    author: 'Dr. Emma Chen',
    description: 'A practical guide to cultivating mindfulness in everyday life.',
    price: 18.50,
    image: 'https://images.unsplash.com/photo-1535398089889-dd807df1dfaa?q=80&w=464&auto=format&fit=crop',
    category: 'Self-Help',
    publisher: 'Serenity Publications',
    publishedDate: '2023-04-05',
    inStock: true,
    rating: 4.6,
    reviewCount: 156
  },
  {
    id: '5',
    title: 'Historical Horizons',
    author: 'Professor Jonathan Blake',
    description: 'An in-depth analysis of pivotal moments in world history and their lasting impact.',
    price: 27.99,
    image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=512&auto=format&fit=crop',
    category: 'History',
    publisher: 'Chronicle Books',
    publishedDate: '2022-09-22',
    inStock: true,
    rating: 4.4,
    reviewCount: 92
  },
  {
    id: '6',
    title: 'Digital Innovation',
    author: 'Alex Turner',
    description: 'A comprehensive overview of digital transformation and its impact on modern business.',
    price: 32.95,
    image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=387&auto=format&fit=crop',
    category: 'Business',
    publisher: 'Tech Trends Media',
    publishedDate: '2023-01-18',
    inStock: false,
    rating: 4.3,
    reviewCount: 64
  }
];

export const publishers: Publisher[] = [
  {
    id: '1',
    name: 'Moonlight Press',
    logo: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?q=80&w=870&auto=format&fit=crop',
    description: 'An independent publisher focused on literary fiction and poetry.',
    foundedYear: 2010,
    bookCount: 45,
    website: 'www.moonlightpress.com'
  },
  {
    id: '2',
    name: 'Enlighten Publishing',
    logo: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=873&auto=format&fit=crop',
    description: 'Dedicated to publishing cutting-edge science and philosophy books.',
    foundedYear: 2005,
    bookCount: 78,
    website: 'www.enlightenpublishing.com'
  },
  {
    id: '3',
    name: 'Flavor House',
    logo: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?q=80&w=869&auto=format&fit=crop',
    description: 'Specializing in cookbooks and culinary literature from diverse cultures.',
    foundedYear: 2012,
    bookCount: 35,
    website: 'www.flavorhouse.com'
  },
  {
    id: '4',
    name: 'Serenity Publications',
    logo: 'https://images.unsplash.com/photo-1531988042231-d39a9cc12a9a?q=80&w=870&auto=format&fit=crop',
    description: 'Publishers of mindfulness, wellness, and personal development books.',
    foundedYear: 2008,
    bookCount: 62,
    website: 'www.serenitypub.com'
  }
];

export const getBooksByCategory = (category: string): Book[] => {
  return books.filter(book => book.category === category);
};

export const getBooksByPublisher = (publisherId: string): Book[] => {
  const publisher = publishers.find(p => p.id === publisherId);
  if (!publisher) return [];
  
  return books.filter(book => book.publisher === publisher.name);
};

export const getRecommendedBooks = (bookId: string): Book[] => {
  // Mock recommendation algorithm
  // In a real app, this would use ML algorithms
  const selectedBook = books.find(book => book.id === bookId);
  if (!selectedBook) return books.slice(0, 3);
  
  return books
    .filter(book => book.id !== bookId)
    .filter(book => 
      book.category === selectedBook.category || 
      book.publisher === selectedBook.publisher
    )
    .slice(0, 3);
};
