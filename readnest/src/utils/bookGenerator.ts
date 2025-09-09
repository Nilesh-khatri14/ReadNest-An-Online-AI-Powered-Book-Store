
import { Book } from '@/types';

// Generate a random number between min and max (inclusive)
const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Generate a random date in the last 5 years
const getRandomDate = () => {
  const start = new Date();
  start.setFullYear(start.getFullYear() - 5);
  const end = new Date();
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().split('T')[0];
};

// List of book cover image URLs that are guaranteed to work
const bookCovers = [
  'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=300&auto=format',
  'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=300&auto=format',
  'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=300&auto=format',
  'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=300&auto=format',
  'https://images.unsplash.com/photo-1610116306796-6fea9f4fae38?q=80&w=300&auto=format',
  'https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=300&auto=format',
  'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=300&auto=format',
  'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=300&auto=format',
  'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=300&auto=format',
  'https://images.unsplash.com/photo-1495640452828-3df6795cf69b?q=80&w=300&auto=format',
];

// List of fictional book titles
const bookTitles = [
  "The Silent Echo", "Quantum Possibilities", "Culinary Journeys", "The Art of Mindfulness", 
  "Historical Horizons", "Digital Innovation", "Shadows in the Mist", "The Last Frontier", 
  "Echoes of Eternity", "Beyond the Stars", "The Forgotten Path", "Whispers in the Wind", 
  "Secrets of the Deep", "The Hidden Kingdom", "Twilight Chronicles", "Dawn of Darkness", 
  "Eternal Flame", "The Crystal Cave", "Legends of the Fall", "The Golden Thread", 
  "Silver Linings", "The Emerald Forest", "Ruby Skies", "Sapphire Dreams", "Amber Waves", 
  "The Diamond Desert", "Pearl Harbor", "The Bronze Age", "Iron Will", "Copper Canyon", 
  "The Platinum Rule", "Golden Opportunities", "The Silver Bullet", "Bronze Medal", 
  "Iron Curtain", "Copper Wire", "The Platinum Standard", "The Golden Ratio", 
  "Whispers of the Past", "Echoes of Tomorrow", "Shadows of Yesterday", "Reflections of Today", 
  "Dreams of the Future", "Nightmares of Reality", "The Silent Treatment", "The Loud Silence", 
  "The Empty Fullness", "The Full Emptiness", "The Dark Light", "The Light Darkness", 
  "The Lost Find", "The Found Loss", "Virtual Reality", "Augmented Dreams"
];

// List of fictional author names
const authorNames = [
  "Elena Michaels", "Dr. Nathan Reed", "Sofia Rodriguez", "Dr. Emma Chen", "Professor Jonathan Blake", 
  "Alex Turner", "Maria Garcia", "John Smith", "Emily Johnson", "Michael Brown", 
  "Jessica Davis", "David Miller", "Sarah Wilson", "James Moore", "Lisa Taylor", 
  "Robert Anderson", "Jennifer Thomas", "William Jackson", "Amanda White", "Christopher Harris", 
  "Michelle Martin", "Daniel Thompson", "Stephanie Robinson", "Matthew Lewis", "Nicole Clark", 
  "Andrew Walker", "Melissa Hall", "Joshua Allen", "Rebecca Young", "Brandon King", 
  "Elizabeth Wright", "Ryan Scott", "Laura Green", "Justin Baker", "Megan Adams"
];

// List of book categories
const categories = [
  "Fiction", "Science", "Cooking", "Self-Help", "History", "Business", "Fantasy", 
  "Mystery", "Romance", "Science Fiction", "Biography", "Thriller", "Horror", 
  "Adventure", "Poetry", "Young Adult", "Children", "Travel", "Art", "Philosophy"
];

// List of publishers
const publishers = [
  "Moonlight Press", "Enlighten Publishing", "Flavor House", "Serenity Publications", 
  "Chronicle Books", "Tech Trends Media", "Golden Quill Publishers", "Emerald Ink Press", 
  "Silver Pages Publishing", "Diamond Books", "Ruby Red Publishing", "Sapphire Sky Press", 
  "Amber Light Books", "Crystal Clear Publishing", "Bronze Age Media", "Iron Will Press"
];

// Generate a large number of books
export const generateBooks = (count: number): Book[] => {
  const books: Book[] = [];
  
  for (let i = 1; i <= count; i++) {
    const title = bookTitles[getRandomInt(0, bookTitles.length - 1)];
    const category = categories[getRandomInt(0, categories.length - 1)];
    
    books.push({
      id: i.toString(),
      title: title + (i > bookTitles.length ? ` ${Math.ceil(i / bookTitles.length)}` : ''),
      author: authorNames[getRandomInt(0, authorNames.length - 1)],
      description: `A captivating ${category.toLowerCase()} book that will keep you engaged from start to finish.`,
      price: getRandomInt(999, 3499) / 100, // Price between $9.99 and $34.99
      image: bookCovers[i % bookCovers.length], // Use a guaranteed working image
      category: category,
      publisher: publishers[getRandomInt(0, publishers.length - 1)],
      publishedDate: getRandomDate(),
      inStock: Math.random() > 0.1, // 90% chance of being in stock
      rating: (getRandomInt(30, 50) / 10), // Rating between 3.0 and 5.0
      reviewCount: getRandomInt(5, 250) // Between 5 and 250 reviews
    });
  }
  
  return books;
};
