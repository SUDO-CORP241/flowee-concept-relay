
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { orders, stores } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Truck, Calendar, Package } from 'lucide-react';

const Deliveries = () => {
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [driverOrdersState, setDriverOrdersState] = useState(orders);
  
  // Redirect if not driver or admin
  React.useEffect(() => {
    if (currentUser && !['driver', 'admin'].includes(currentUser.role)) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  // Get orders that are relevant to drivers
  const driverOrders = React.useMemo(() => {
    if (!currentUser) return [];
    
    if (currentUser.role === 'admin') {
      return driverOrdersState.filter(o => 
        ['ready_for_pickup', 'picked_up', 'in_delivery'].includes(o.status)
      );
    } else {
      // For drivers: orders assigned to them + orders ready for pickup that could be assigned
      return driverOrdersState.filter(o => 
        (o.driverId === currentUser.id) || 
        (['ready_for_pickup'].includes(o.status) && !o.driverId)
      );
    }
  }, [currentUser, driverOrdersState]);

  // Split orders into categories
  const readyForPickup = driverOrders.filter(o => o.status === 'ready_for_pickup');
  const pickedUp = driverOrders.filter(o => o.status === 'picked_up');
  const inDelivery = driverOrders.filter(o => o.status === 'in_delivery');

  const handleClaimOrder = (orderId: string) => {
    if (!currentUser) return;
    
    // Dans une vraie application, ceci ferait un appel API
    const updatedOrders = driverOrdersState.map(order => 
      order.id === orderId ? { ...order, driverId: currentUser.id } : order
    );
    
    setDriverOrdersState(updatedOrders);
    
    toast({
      title: "Commande acceptée",
      description: "Vous avez pris en charge cette commande",
    });
    
    // Naviguer vers les détails de la commande
    navigate(`/orders/${orderId}`);
  };

  return (
    <Layout>
      <div className="container mx-auto p-4 pb-20">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Tableau de bord des livraisons</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <Package className="mr-2" size={18} />
                Prêt pour le ramassage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{readyForPickup.length}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <Truck className="mr-2" size={18} />
                En livraison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{inDelivery.length}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <Calendar className="mr-2" size={18} />
                Livraisons du jour
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {driverOrders.filter(o => 
                  new Date(o.createdAt).toDateString() === new Date().toDateString()
                ).length}
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          {readyForPickup.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Prêt pour le ramassage</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {readyForPickup.map(order => {
                  const store = stores.find(s => s.id === order.storeId);
                  return (
                    <Card key={order.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">
                          Commande #{order.id.substring(0, 5)}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </CardHeader>
                      <CardContent className="pb-4">
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium">Magasin</p>
                            <div className="flex items-center gap-2">
                              {store?.logoUrl && (
                                <div className="w-6 h-6 rounded overflow-hidden">
                                  <img src={store.logoUrl} alt={store.name} className="w-full h-full object-cover" />
                                </div>
                              )}
                              <p className="text-sm">{store?.name}</p>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium">Articles</p>
                            <p className="text-sm">
                              {order.items.length} article(s) • {order.total.toFixed(2)} €
                            </p>
                          </div>
                          
                          <div className="pt-2">
                            <Button 
                              size="sm" 
                              className="w-full" 
                              onClick={() => 
                                order.driverId === currentUser?.id || currentUser?.role === 'admin' 
                                  ? navigate(`/orders/${order.id}`)
                                  : handleClaimOrder(order.id)
                              }
                            >
                              {currentUser?.role === 'admin' 
                                ? 'Voir détails' 
                                : (order.driverId === currentUser?.id 
                                  ? 'Voir livraison' 
                                  : 'Accepter le ramassage')}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
          
          {inDelivery.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Livraisons actives</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {inDelivery.map(order => (
                  <Card key={order.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">
                            Commande #{order.id.substring(0, 5)}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <Badge>En livraison</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium">Adresse de livraison</p>
                          <p className="text-sm">
                            {order.deliveryAddress}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium">Paiement</p>
                          <div className="flex items-center gap-2">
                            <p className="text-sm capitalize">
                              {order.paymentMethod === 'cash' ? 'espèces' : 
                               order.paymentMethod === 'online' ? 'en ligne' : 'airtel'}
                            </p>
                            <Badge variant={order.paymentStatus === 'paid' ? 'success' : 'outline'} className="text-xs">
                              {order.paymentStatus === 'paid' ? 'payé' : 
                               order.paymentStatus === 'pending' ? 'en attente' : 'échec'}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="pt-2">
                          <Button size="sm" className="w-full" onClick={() => navigate(`/orders/${order.id}`)}>
                            Gérer la livraison
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
          
          {readyForPickup.length === 0 && inDelivery.length === 0 && (
            <div className="text-center py-16">
              <h3 className="text-lg font-medium">Pas de livraisons actives</h3>
              <p className="text-muted-foreground mt-1">
                Il n'y a aucune commande prête pour le ramassage ou en cours de livraison pour le moment.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Deliveries;
