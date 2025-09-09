
import React from 'react';
import { Publisher } from '@/types';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

interface PublisherCardProps {
  publisher: Publisher;
}

const PublisherCard: React.FC<PublisherCardProps> = ({ publisher }) => {
  return (
    <Link to={`/publisher/${publisher.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
        <div className="h-32 overflow-hidden bg-gray-100 flex items-center justify-center">
          <img 
            src={publisher.logo} 
            alt={publisher.name} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-readnest-teal">{publisher.name}</h3>
          <p className="text-sm text-gray-600 mb-2">Est. {publisher.foundedYear}</p>
          
          <div className="flex items-center mt-2 text-sm text-gray-500">
            <BookOpen className="h-4 w-4 mr-1" />
            <span>{publisher.bookCount} published books</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PublisherCard;
