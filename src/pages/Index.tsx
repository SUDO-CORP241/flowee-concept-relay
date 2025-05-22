
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Store, Truck, Clock } from 'lucide-react';
import Layout from '@/components/Layout';
import { orders, stores } from '@/data/mockData';

const Index = () => {
  const { currentUser } = useUser();
  const navigate = useNavigate();
  
  const role = currentUser?.role;

  // Filter orders based on user role
  const userOrders = React.useMemo(() => {
    if (!currentUser) return [];
    
    switch (role) {
      case 'customer':
        return orders.filter(order => order.customerId === currentUser.id);
      case 'store':
        return orders.filter(order => order.storeId === currentUser.id);
      case 'driver':
        return orders.filter(order => order.driverId === currentUser.id);
      case 'admin':
        return orders;
      default:
        return [];
    }
  }, [currentUser, role]);

  // Get recent orders
  const recentOrders = userOrders.slice(0, 3);

  // Customer Dashboard
  const CustomerDashboard = () => (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold">Bienvenue, {currentUser?.name}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="mr-2" /> Commandes récentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map(order => (
                  <div key={order.id} className="flex justify-between border-b pb-3">
                    <div>
                      <p className="font-medium">Commande #{order.id.substring(0, 5)}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{order.total.toFixed(2)} €</p>
                      <p className="text-sm capitalize text-muted-foreground">
                        {order.status === 'pending' ? 'en attente' :
                         order.status === 'confirmed' ? 'confirmée' :
                         order.status === 'preparing' ? 'en préparation' :
                         order.status === 'ready_for_pickup' ? 'prête pour le ramassage' :
                         order.status === 'picked_up' ? 'ramassée' :
                         order.status === 'in_delivery' ? 'en livraison' :
                         order.status === 'delivered' ? 'livrée' :
                         order.status === 'completed' ? 'terminée' : 'annulée'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>Aucune commande récente</p>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => navigate('/orders')}>
              Voir toutes les commandes
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Store className="mr-2" /> Magasins en vedette
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stores.slice(0, 3).map(store => (
                <div key={store.id} className="flex items-center gap-3 border-b pb-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-md"></div>
                  <div>
                    <p className="font-medium">{store.name}</p>
                    <p className="text-sm text-muted-foreground">{store.categories.join(', ')}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => navigate('/stores')}>
              Parcourir tous les magasins
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );

  // Store Dashboard
  const StoreDashboard = () => (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold">Tableau de bord du magasin</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Package className="mr-2" size={18} /> Nouvelles commandes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{userOrders.filter(o => o.status === 'pending').length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Clock className="mr-2" size={18} /> En préparation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{userOrders.filter(o => o.status === 'preparing').length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Truck className="mr-2" size={18} /> Prêtes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{userOrders.filter(o => o.status === 'ready_for_pickup').length}</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Commandes récentes</CardTitle>
          <CardDescription>Gérer les commandes récentes de votre magasin</CardDescription>
        </CardHeader>
        <CardContent>
          {recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map(order => (
                <div key={order.id} className="flex justify-between items-center border-b pb-3">
                  <div>
                    <p className="font-medium">Commande #{order.id.substring(0, 5)}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <Button size="sm" onClick={() => navigate(`/orders/${order.id}`)}>
                      Gérer
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>Aucune commande récente</p>
          )}
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" onClick={() => navigate('/orders')}>
            Voir toutes les commandes
          </Button>
        </CardFooter>
      </Card>
    </div>
  );

  // Driver Dashboard
  const DriverDashboard = () => (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold">Tableau de bord du livreur</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="mr-2" /> Commandes à ramasser
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userOrders.filter(o => o.status === 'ready_for_pickup').map(order => (
                <div key={order.id} className="flex justify-between border-b pb-3">
                  <div>
                    <p className="font-medium">Commande #{order.id.substring(0, 5)}</p>
                    <p className="text-sm text-muted-foreground">
                      Magasin: {stores.find(s => s.id === order.storeId)?.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <Button size="sm" onClick={() => navigate(`/orders/${order.id}`)}>
                      Voir
                    </Button>
                  </div>
                </div>
              ))}
              {userOrders.filter(o => o.status === 'ready_for_pickup').length === 0 && (
                <p>Aucune commande prête pour le ramassage</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Truck className="mr-2" /> Livraisons actives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userOrders.filter(o => o.status === 'in_delivery').map(order => (
                <div key={order.id} className="flex justify-between border-b pb-3">
                  <div>
                    <p className="font-medium">Commande #{order.id.substring(0, 5)}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.deliveryAddress}
                    </p>
                  </div>
                  <div className="text-right">
                    <Button size="sm" onClick={() => navigate(`/orders/${order.id}`)}>
                      Gérer
                    </Button>
                  </div>
                </div>
              ))}
              {userOrders.filter(o => o.status === 'in_delivery').length === 0 && (
                <p>Aucune livraison active</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Admin Dashboard
  const AdminDashboard = () => (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold">Tableau de bord administrateur</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Commandes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{orders.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Magasins</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stores.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Livraisons actives</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {orders.filter(o => o.status === 'in_delivery').length}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Terminées aujourd'hui</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {orders.filter(o => o.status === 'completed').length}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Commandes récentes</CardTitle>
          <CardDescription>Surveiller les commandes dans tout le système</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {orders.slice(0, 5).map(order => (
              <div key={order.id} className="flex justify-between border-b pb-3">
                <div>
                  <p className="font-medium">Commande #{order.id.substring(0, 5)}</p>
                  <p className="text-sm text-muted-foreground">
                    {stores.find(s => s.id === order.storeId)?.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{order.total.toFixed(2)} €</p>
                  <p className="text-sm capitalize text-muted-foreground">
                    {order.status === 'pending' ? 'en attente' :
                     order.status === 'confirmed' ? 'confirmée' :
                     order.status === 'preparing' ? 'en préparation' :
                     order.status === 'ready_for_pickup' ? 'prête pour le ramassage' :
                     order.status === 'picked_up' ? 'ramassée' :
                     order.status === 'in_delivery' ? 'en livraison' :
                     order.status === 'delivered' ? 'livrée' :
                     order.status === 'completed' ? 'terminée' : 'annulée'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" onClick={() => navigate('/orders')}>
            Voir toutes les commandes
          </Button>
        </CardFooter>
      </Card>
    </div>
  );

  const renderDashboard = () => {
    switch (role) {
      case 'customer':
        return <CustomerDashboard />;
      case 'store':
        return <StoreDashboard />;
      case 'driver':
        return <DriverDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <div>Chargement...</div>;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-4 pb-20">
        {renderDashboard()}
      </div>
    </Layout>
  );
};

export default Index;
