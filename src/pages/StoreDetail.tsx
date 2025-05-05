
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { stores, products } from '@/data/mockData';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MapPin, Phone, Mail, Star, Clock, Search, Plus, Minus, ShoppingCart } from 'lucide-react';

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

const StoreDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  
  const store = stores.find(s => s.id === id);
  const storeProducts = products.filter(p => p.storeId === id);
  
  if (!store) {
    return (
      <Layout>
        <div className="container mx-auto p-4">
          <h1>Store not found</h1>
          <Button onClick={() => navigate('/stores')}>Back to Stores</Button>
        </div>
      </Layout>
    );
  }

  // Filter products based on search
  const filteredProducts = storeProducts.filter(product => 
    searchQuery === '' || 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCart = (product: typeof products[0]) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.productId === product.id);
      
      if (existingItem) {
        return prev.map(item => 
          item.productId === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        return [...prev, {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1
        }];
      }
    });
    
    toast({
      title: "Added to cart",
      description: `${product.name} added to your order`,
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.productId === productId);
      
      if (existingItem && existingItem.quantity > 1) {
        return prev.map(item => 
          item.productId === productId 
            ? { ...item, quantity: item.quantity - 1 } 
            : item
        );
      } else {
        return prev.filter(item => item.productId !== productId);
      }
    });
  };

  const getItemQuantity = (productId: string): number => {
    const item = cart.find(item => item.productId === productId);
    return item ? item.quantity : 0;
  };

  const getTotalPrice = (): number => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add some products to your cart first",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would navigate to checkout
    toast({
      title: "Order placed",
      description: "Your order has been placed successfully",
    });
    
    // Clear cart
    setCart([]);
  };

  return (
    <Layout>
      <div className="container mx-auto p-4 pb-20">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/stores')} 
            className="mb-4"
          >
            ← Back to Stores
          </Button>
          
          <div className="h-40 md:h-60 bg-muted rounded-md mb-4"></div>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <h1 className="text-2xl font-bold">{store.name}</h1>
              <div className="flex items-center mt-1">
                <div className="flex items-center text-yellow-500">
                  <Star size={16} className="fill-yellow-500" />
                  <span className="ml-1">{store.rating}</span>
                </div>
                <span className="mx-2 text-muted-foreground">•</span>
                <span className="text-muted-foreground">{store.categories.join(', ')}</span>
              </div>
            </div>
            
            {currentUser?.role === 'admin' && (
              <Button variant="outline">Edit Store</Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="flex items-center">
              <MapPin size={16} className="mr-2 text-muted-foreground" />
              <span>{store.address}</span>
            </div>
            
            <div className="flex items-center">
              <Phone size={16} className="mr-2 text-muted-foreground" />
              <span>{store.phone}</span>
            </div>
            
            <div className="flex items-center">
              <Mail size={16} className="mr-2 text-muted-foreground" />
              <span>{store.email}</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Products</h2>
              
              <div className="relative w-full max-w-xs">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                <Input
                  className="pl-10"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredProducts.map(product => (
                <Card key={product.id} className="overflow-hidden">
                  <div className="h-40 bg-muted"></div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{product.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {product.description}
                        </p>
                      </div>
                      <p className="font-semibold">${product.price.toFixed(2)}</p>
                    </div>
                    
                    <div className="mt-4">
                      {getItemQuantity(product.id) === 0 ? (
                        <Button 
                          onClick={() => addToCart(product)}
                          className="w-full"
                          disabled={!product.available || currentUser?.role !== 'customer'}
                        >
                          Add to Cart
                        </Button>
                      ) : (
                        <div className="flex items-center justify-between">
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => removeFromCart(product.id)}
                          >
                            <Minus size={16} />
                          </Button>
                          
                          <span className="mx-2 min-w-[2rem] text-center">
                            {getItemQuantity(product.id)}
                          </span>
                          
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => addToCart(product)}
                          >
                            <Plus size={16} />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {filteredProducts.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <h3 className="text-lg font-medium">No products found</h3>
                  <p className="text-muted-foreground mt-1">
                    Try adjusting your search query
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {currentUser?.role === 'customer' && (
            <div className="space-y-6">
              <Card className="sticky top-20">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4 flex items-center">
                    <ShoppingCart className="mr-2" size={18} /> Your Order
                  </h3>
                  
                  {cart.length === 0 ? (
                    <p className="text-muted-foreground py-4">
                      Your cart is empty. Add some products to start your order.
                    </p>
                  ) : (
                    <>
                      <div className="space-y-3 divide-y">
                        {cart.map(item => (
                          <div key={item.productId} className="pt-3 first:pt-0">
                            <div className="flex justify-between">
                              <div className="flex items-baseline">
                                <span className="font-medium">
                                  {item.name}
                                </span>
                                <span className="ml-2 text-sm text-muted-foreground">
                                  x{item.quantity}
                                </span>
                              </div>
                              <p>${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-6 pt-4 border-t">
                        <div className="flex justify-between font-semibold">
                          <p>Total</p>
                          <p>${getTotalPrice().toFixed(2)}</p>
                        </div>
                        
                        <Button onClick={handleCheckout} className="w-full mt-4">
                          Checkout
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default StoreDetail;
