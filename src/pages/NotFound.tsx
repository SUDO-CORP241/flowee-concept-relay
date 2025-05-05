
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-6xl font-bold text-flowee-500">404</h1>
      <p className="text-xl mt-4 mb-8">Oops! The page you're looking for doesn't exist.</p>
      <div className="space-y-2">
        <Button 
          onClick={() => navigate('/')}
          className="min-w-[200px]"
        >
          Go to Home
        </Button>
        <div>
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="min-w-[200px]"
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
