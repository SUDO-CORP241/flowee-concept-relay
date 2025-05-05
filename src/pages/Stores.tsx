
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Star } from 'lucide-react';
import { stores } from '@/data/mockData';

const Stores = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Extract unique categories
  const categories = Array.from(
    new Set(stores.flatMap(store => store.categories))
  );

  // Filter stores based on search and category
  const filteredStores = stores.filter(store => {
    const matchesSearch = 
      searchQuery === '' || 
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      !selectedCategory || 
      store.categories.includes(selectedCategory);
    
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <div className="container mx-auto p-4 pb-20">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-2xl font-bold">Browse Stores</h1>
            
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                className="pl-10"
                placeholder="Search stores..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              All
            </Button>
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStores.map(store => (
              <Card key={store.id} className="overflow-hidden h-full hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/stores/${store.id}`)}>
                <div className="h-40 bg-muted"></div>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">{store.name}</h3>
                  <div className="flex items-center text-yellow-500 mb-3">
                    <Star size={16} className="fill-yellow-500" />
                    <span className="ml-1 text-sm">{store.rating}</span>
                    <span className="mx-2 text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">{store.categories.join(', ')}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {store.description}
                  </p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin size={14} className="mr-1" />
                    {store.address}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredStores.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">No stores found</h3>
              <p className="text-muted-foreground mt-1">Try adjusting your search or filter</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Stores;
