
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import { orders, stores, products, users, pickupPoints } from '@/data/mockData';
import { useUser } from '@/contexts/UserContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AssignDriverModal from '@/components/AssignDriverModal';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';
import { Check, MapPin, User, Store as StoreIcon, Truck, Package } from 'lucide-react';

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const { toast } = useToast();
  
  const [order, setOrder] = useState(orders.find(o => o.id === id));
  const [assignDriverOpen, setAssignDriverOpen] = useState(false);
  
  const store = stores.find(s => s.id === order?.storeId);
  const customer = users.find(u => u.id === order?.customerId);
  const driver = users.find(u => u.id === order?.driverId);
  const pickupPoint = order?.pickupPointId ? pickupPoints.find(p => p.id === order.pickupPointId) : null;

  if (!order) {
    return (
      <Layout>
        <div className="container mx-auto p-4">
          <h1>Commande introuvable</h1>
          <Button onClick={() => navigate('/orders')}>Retour aux commandes</Button>
        </div>
      </Layout>
    );
  }

  const handleStatusUpdate = (newStatus: string) => {
    // Dans une vraie application, ceci ferait un appel API
    const updatedOrder = { ...order, status: newStatus as any };
    setOrder(updatedOrder);
    toast({
      title: "Commande mise à jour",
      description: `Statut de la commande changé en ${getStatusTranslation(newStatus)}`,
    });
  };

  const handleValidation = (type: 'customer' | 'driver') => {
    // Dans une vraie application, ceci ferait un appel API
    const updatedOrder = { 
      ...order, 
      ...(type === 'customer' ? { customerValidated: true } : { driverValidated: true })
    };
    setOrder(updatedOrder);
    toast({
      title: "Commande validée",
      description: `La commande a été validée par ${type === 'customer' ? 'le client' : 'le livreur'}`,
    });

    // Si les deux validations sont faites, marquer comme terminé
    if (
      (type === 'customer' && order.driverValidated) || 
      (type === 'driver' && order.customerValidated)
    ) {
      setTimeout(() => {
        handleStatusUpdate('completed');
      }, 500);
    }
  };

  const handleAssignDriver = (driverId: string) => {
    // Dans une vraie application, ceci ferait un appel API
    const updatedOrder = { ...order, driverId: driverId };
    setOrder(updatedOrder);
    
    const driverName = users.find(u => u.id === driverId)?.name;
    
    toast({
      title: "Livreur assigné",
      description: `${driverName} a été assigné à cette commande`,
    });
  };

  const handleClaimOrder = () => {
    if (!currentUser) return;
    
    // Dans une vraie application, ceci ferait un appel API
    const updatedOrder = { ...order, driverId: currentUser.id };
    setOrder(updatedOrder);
    
    toast({
      title: "Commande acceptée",
      description: "Vous avez pris en charge cette commande",
    });
  };

  const canUpdateStatus = () => {
    if (!currentUser) return false;
    
    switch (currentUser.role) {
      case 'store':
        return ['pending', 'confirmed', 'preparing'].includes(order.status);
      case 'driver':
        return ['ready_for_pickup', 'picked_up', 'in_delivery'].includes(order.status);
      case 'admin':
        return true;
      default:
        return false;
    }
  };

  const getNextStatus = () => {
    switch (order.status) {
      case 'pending':
        return 'confirmed';
      case 'confirmed':
        return 'preparing';
      case 'preparing':
        return 'ready_for_pickup';
      case 'ready_for_pickup':
        return 'picked_up';
      case 'picked_up':
        return 'in_delivery';
      case 'in_delivery':
        return 'delivered';
      default:
        return null;
    }
  };

  const getStatusTranslation = (status: string) => {
    const translations: Record<string, string> = {
      'pending': 'en attente',
      'confirmed': 'confirmée',
      'preparing': 'en préparation',
      'ready_for_pickup': 'prête pour le ramassage',
      'picked_up': 'ramassée',
      'in_delivery': 'en livraison',
      'delivered': 'livrée',
      'completed': 'terminée',
      'cancelled': 'annulée'
    };
    
    return translations[status] || status;
  };

  const nextStatus = getNextStatus();

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'confirmed':
      case 'preparing':
        return 'default';
      case 'ready_for_pickup':
      case 'picked_up':
      case 'in_delivery':
        return 'outline';
      case 'delivered':
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const showAssignDriverButton = currentUser?.role === 'admin' && 
    ['ready_for_pickup', 'confirmed', 'preparing'].includes(order.status) && 
    !order.driverId;

  const showClaimOrderButton = currentUser?.role === 'driver' && 
    order.status === 'ready_for_pickup' && 
    !order.driverId;

  // Le reste du code reste inchangé...

  return (
    <Layout>
      <div className="container mx-auto p-4 pb-20">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              Commande #{order.id.substring(0, 5)}
              <Badge className="ml-3" variant={getStatusBadgeVariant(order.status)}>
                {getStatusTranslation(order.status)}
              </Badge>
            </h1>
            <p className="text-muted-foreground">
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          
          <div className="flex gap-2">
            {canUpdateStatus() && nextStatus && (
              <Button
                onClick={() => handleStatusUpdate(nextStatus)}
                variant="default"
              >
                Marquer comme {getStatusTranslation(nextStatus)}
              </Button>
            )}
            
            {currentUser?.role === 'admin' && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Annuler la commande</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Cette action ne peut pas être annulée. Elle annulera définitivement cette commande.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Non, garder</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleStatusUpdate('cancelled')}>
                      Oui, annuler la commande
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Articles de la commande</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => {
                    const product = products.find(p => p.id === item.productId);
                    return (
                      <div 
                        key={item.id}
                        className="flex items-center justify-between border-b pb-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 overflow-hidden rounded bg-muted">
                            <img 
                              src={product?.image || "https://placehold.co/200x200?text=Produit"} 
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Quantité: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <p className="font-medium">{item.subtotal.toFixed(2)} €</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <p className="font-medium">Total</p>
                <p className="font-bold text-lg">{order.total.toFixed(2)} €</p>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Détails de livraison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.isPickup ? (
                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <p className="font-medium">Retrait depuis {pickupPoint?.name}</p>
                        <p className="text-muted-foreground">{pickupPoint?.address}</p>
                        <p className="text-muted-foreground">{pickupPoint?.contactPerson} • {pickupPoint?.phone}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <p className="font-medium">Adresse de livraison</p>
                        <p className="text-muted-foreground">{order.deliveryAddress}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      <Package size={18} />
                    </div>
                    <div>
                      <p className="font-medium">Méthode de paiement</p>
                      <p className="text-muted-foreground capitalize">
                        {order.paymentMethod === 'cash' ? 'espèces' : 
                         order.paymentMethod === 'online' ? 'en ligne' : 'airtel'} 
                        • {order.paymentStatus === 'paid' ? 'payé' : 
                            order.paymentStatus === 'pending' ? 'en attente' : 'échec'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {(order.status === 'delivered' || order.status === 'completed') && (
              <Card>
                <CardHeader>
                  <CardTitle>Validation de livraison</CardTitle>
                  <CardDescription>
                    Le client et le livreur doivent tous deux valider la livraison
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <User size={18} />
                        <p>Validation du client</p>
                      </div>
                      {order.customerValidated ? (
                        <Badge variant="success" className="flex items-center gap-1">
                          <Check size={14} /> Validé
                        </Badge>
                      ) : (
                        currentUser?.role === 'customer' ? (
                          <Button size="sm" onClick={() => handleValidation('customer')}>
                            Valider la livraison
                          </Button>
                        ) : (
                          <Badge variant="outline">En attente</Badge>
                        )
                      )}
                    </div>

                    <Separator />

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Truck size={18} />
                        <p>Validation du livreur</p>
                      </div>
                      {order.driverValidated ? (
                        <Badge variant="success" className="flex items-center gap-1">
                          <Check size={14} /> Validé
                        </Badge>
                      ) : (
                        currentUser?.role === 'driver' ? (
                          <Button size="sm" onClick={() => handleValidation('driver')}>
                            Valider la livraison
                          </Button>
                        ) : (
                          <Badge variant="outline">En attente</Badge>
                        )
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Tabs defaultValue="info">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="info">Info</TabsTrigger>
                <TabsTrigger value="store">Magasin</TabsTrigger>
                {(order.driverId || currentUser?.role === 'admin' || currentUser?.role === 'driver') && (
                  <TabsTrigger value="driver">Livreur</TabsTrigger>
                )}
              </TabsList>
              
              <TabsContent value="info" className="space-y-4 pt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Chronologie de la commande</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 mt-2 rounded-full bg-primary"></div>
                        <div>
                          <p className="text-sm font-medium">Commande passée</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(order.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      {order.status !== 'pending' && (
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 mt-2 rounded-full bg-primary"></div>
                          <div>
                            <p className="text-sm font-medium">Commande confirmée</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(order.updatedAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Paiement</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <p className="text-sm text-muted-foreground">Méthode</p>
                      <p className="text-sm font-medium capitalize">
                        {order.paymentMethod === 'cash' ? 'espèces' : 
                         order.paymentMethod === 'online' ? 'en ligne' : 'airtel'}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-muted-foreground">Statut</p>
                      <Badge variant={order.paymentStatus === 'paid' ? 'success' : 'secondary'}>
                        {order.paymentStatus === 'paid' ? 'payé' : 
                         order.paymentStatus === 'pending' ? 'en attente' : 'échec'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="text-sm font-medium">{order.total.toFixed(2)} €</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="store" className="pt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Informations du magasin</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center overflow-hidden">
                        {store?.logoUrl ? (
                          <img src={store.logoUrl} alt={store.name} className="w-full h-full object-cover" />
                        ) : (
                          <StoreIcon size={20} />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{store?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {store?.phone}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Adresse</p>
                      <p className="text-sm">
                        {store?.address}
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" onClick={() => navigate(`/stores/${order.storeId}`)}>
                      Voir le magasin
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              {(order.driverId || currentUser?.role === 'admin' || currentUser?.role === 'driver') && (
                <TabsContent value="driver" className="pt-4">
                  {order.driverId ? (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Informations du livreur</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center overflow-hidden">
                            {driver?.avatar ? (
                              <img src={driver.avatar} alt={driver.name} className="w-full h-full object-cover" />
                            ) : (
                              <Truck size={20} />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{driver?.name}</p>
                            <p className="text-sm text-muted-foreground">{driver?.phone}</p>
                          </div>
                        </div>
                      </CardContent>
                      {currentUser?.role === 'customer' && order.status === 'in_delivery' && (
                        <CardFooter>
                          <Button className="w-full">Contacter le livreur</Button>
                        </CardFooter>
                      )}
                    </Card>
                  ) : showAssignDriverButton ? (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Assigner un livreur</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          Aucun livreur n'a encore été assigné à cette commande.
                        </p>
                        <Button className="w-full" onClick={() => setAssignDriverOpen(true)}>
                          Assigner un livreur
                        </Button>
                      </CardContent>
                    </Card>
                  ) : showClaimOrderButton ? (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Prendre en charge la commande</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          Cette commande est prête pour le ramassage et n'a pas encore de livreur assigné.
                        </p>
                        <Button className="w-full" onClick={handleClaimOrder}>
                          Prendre en charge cette commande
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Information du livreur</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Aucun livreur n'a encore été assigné à cette commande.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              )}
            </Tabs>
            
            {/* Modal d'assignation de livreur */}
            <AssignDriverModal
              open={assignDriverOpen}
              onOpenChange={setAssignDriverOpen}
              onAssign={handleAssignDriver}
              orderId={order.id}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderDetail;
