import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { stores, products, calculateDeliveryFee, calculateDriverCommission } from '@/data/mockData';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MapPin, Phone, Mail, Star, Clock, Search, Plus, Minus, ShoppingCart, Package, AlertTriangle } from 'lucide-react';

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
          <h1>Magasin introuvable</h1>
          <Button onClick={() => navigate('/stores')}>Retour aux magasins</Button>
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
      title: "Ajouté au panier",
      description: `${product.name} ajouté à votre commande`,
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

  const getSubtotal = (): number => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getDeliveryFee = (): number => {
    if (cart.length === 0) return 0;
    return calculateDeliveryFee(getSubtotal());
  };

  const getTotalPrice = (): number => {
    return getSubtotal() + getDeliveryFee();
  };

  const getDriverCommission = (): number => {
    if (!store.currentPack || cart.length === 0) return 0;
    return calculateDriverCommission(getSubtotal(), store.currentPack.driverCommissionRate);
  };

  const canProcessOrder = (): boolean => {
    return store.remainingDeliveries > 0;
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: "Panier vide",
        description: "Ajoutez des produits à votre panier d'abord",
        variant: "destructive",
      });
      return;
    }

    if (!canProcessOrder()) {
      toast({
        title: "Livraisons épuisées",
        description: "Ce magasin n'a plus de livraisons disponibles dans son pack",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would navigate to checkout
    toast({
      title: "Commande passée",
      description: "Votre commande a été passée avec succès",
    });
    
    // Clear cart
    setCart([]);
  };

  const formatPrice = (price: number) => {
    return `${price.toFixed(2)} CDF`;
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
            ← Retour aux magasins
          </Button>
          
          <div className="h-40 md:h-60 bg-muted rounded-md mb-4 flex items-center justify-center">
            <img 
              src={store.image} 
              alt={store.name}
              className="w-full h-full object-cover rounded-md"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = 'none';
                // Make sure we're checking if nextElementSibling exists before accessing it
                if (target.nextElementSibling) {
                  (target.nextElementSibling as HTMLElement).style.display = 'flex';
                }
              }}
            />
            <div className="hidden w-full h-full bg-muted rounded-md items-center justify-center">
              <Package className="h-16 w-16 text-muted-foreground" />
            </div>
          </div>
          
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
              <Button variant="outline">Modifier le magasin</Button>
            )}
          </div>

          {/* Pack Status */}
          <div className="mt-4">
            {store.currentPack ? (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
                <Package className="h-4 w-4 text-green-600" />
                <span className="text-green-800">
                  Pack actif: {store.currentPack.name} - {store.remainingDeliveries} livraisons restantes
                </span>
                {store.remainingDeliveries <= 10 && (
                  <Badge variant="destructive" className="ml-2">Bientôt épuisé</Badge>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span className="text-red-800">Aucun pack de livraison actif</span>
              </div>
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
              <h2 className="text-xl font-semibold">Produits</h2>
              
              <div className="relative w-full max-w-xs">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                <Input
                  className="pl-10"
                  placeholder="Rechercher des produits..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredProducts.map(product => (
                <Card key={product.id} className="overflow-hidden">
                  <div className="h-40 bg-muted flex items-center justify-center">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = 'none';
                        // Make sure we're checking if nextElementSibling exists before accessing it
                        if (target.nextElementSibling) {
                          (target.nextElementSibling as HTMLElement).style.display = 'flex';
                        }
                      }}
                    />
                    <div className="hidden w-full h-full bg-muted items-center justify-center">
                      <Package className="h-12 w-12 text-muted-foreground" />
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{product.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {product.description}
                        </p>
                      </div>
                      <p className="font-semibold">{formatPrice(product.price)}</p>
                    </div>
                    
                    <div className="mt-4">
                      {getItemQuantity(product.id) === 0 ? (
                        <Button 
                          onClick={() => addToCart(product)}
                          className="w-full"
                          style={{ backgroundColor: '#622483' }}
                          disabled={!product.available || currentUser?.role !== 'customer' || !canProcessOrder()}
                        >
                          {!canProcessOrder() ? 'Livraisons épuisées' : 'Ajouter au panier'}
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
                  <h3 className="text-lg font-medium">Aucun produit trouvé</h3>
                  <p className="text-muted-foreground mt-1">
                    Essayez d'ajuster votre recherche
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
                    <ShoppingCart className="mr-2" size={18} /> Votre Commande
                  </h3>
                  
                  {cart.length === 0 ? (
                    <p className="text-muted-foreground py-4">
                      Votre panier est vide. Ajoutez des produits pour commencer votre commande.
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
                              <p>{formatPrice(item.price * item.quantity)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-6 pt-4 border-t space-y-2">
                        <div className="flex justify-between">
                          <p>Sous-total</p>
                          <p>{formatPrice(getSubtotal())}</p>
                        </div>
                        <div className="flex justify-between">
                          <p>Frais de livraison</p>
                          <p>{formatPrice(getDeliveryFee())}</p>
                        </div>
                        <div className="flex justify-between font-semibold text-lg border-t pt-2">
                          <p>Total</p>
                          <p>{formatPrice(getTotalPrice())}</p>
                        </div>
                        
                        {store.currentPack && (
                          <div className="text-xs text-muted-foreground mt-2">
                            Commission livreur: {formatPrice(getDriverCommission())}
                          </div>
                        )}
                        
                        <Button 
                          onClick={handleCheckout} 
                          className="w-full mt-4"
                          style={{ backgroundColor: '#622483' }}
                          disabled={!canProcessOrder()}
                        >
                          {canProcessOrder() ? 'Commander' : 'Livraisons épuisées'}
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
