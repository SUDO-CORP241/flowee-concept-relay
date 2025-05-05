
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import { orders, stores, products, users, pickupPoints } from '@/data/mockData';
import { useUser } from '@/contexts/UserContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { Check, MapPin, User, Store, Truck, Package } from 'lucide-react';

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const { toast } = useToast();
  
  const [order, setOrder] = React.useState(orders.find(o => o.id === id));
  const store = stores.find(s => s.storeId === order?.storeId);
  const customer = users.find(u => u.id === order?.customerId);
  const driver = users.find(u => u.id === order?.driverId);
  const pickupPoint = order?.pickupPointId ? pickupPoints.find(p => p.id === order.pickupPointId) : null;

  if (!order) {
    return (
      <Layout>
        <div className="container mx-auto p-4">
          <h1>Order not found</h1>
          <Button onClick={() => navigate('/orders')}>Back to Orders</Button>
        </div>
      </Layout>
    );
  }

  const handleStatusUpdate = (newStatus: string) => {
    // In a real app, this would make an API call
    const updatedOrder = { ...order, status: newStatus as any };
    setOrder(updatedOrder);
    toast({
      title: "Order updated",
      description: `Order status changed to ${newStatus.replace(/_/g, ' ')}`,
    });
  };

  const handleValidation = (type: 'customer' | 'driver') => {
    // In a real app, this would make an API call
    const updatedOrder = { 
      ...order, 
      ...(type === 'customer' ? { customerValidated: true } : { driverValidated: true })
    };
    setOrder(updatedOrder);
    toast({
      title: "Order validated",
      description: `Order has been validated by ${type}`,
    });

    // If both validations are done, mark as completed
    if (
      (type === 'customer' && order.driverValidated) || 
      (type === 'driver' && order.customerValidated)
    ) {
      setTimeout(() => {
        handleStatusUpdate('completed');
      }, 500);
    }
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

  return (
    <Layout>
      <div className="container mx-auto p-4 pb-20">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              Order #{order.id.substring(0, 5)}
              <Badge className="ml-3" variant={getStatusBadgeVariant(order.status)}>
                {order.status.replace(/_/g, ' ')}
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
                Mark as {nextStatus.replace(/_/g, ' ')}
              </Button>
            )}
            
            {currentUser?.role === 'admin' && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Cancel Order</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently cancel this order.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>No, keep it</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleStatusUpdate('cancelled')}>
                      Yes, cancel order
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
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div 
                      key={item.id}
                      className="flex items-center justify-between border-b pb-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-muted rounded"></div>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="font-medium">${item.subtotal.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <p className="font-medium">Total</p>
                <p className="font-bold text-lg">${order.total.toFixed(2)}</p>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Delivery Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.isPickup ? (
                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <p className="font-medium">Pickup from {pickupPoint?.name}</p>
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
                        <p className="font-medium">Delivery Address</p>
                        <p className="text-muted-foreground">{order.deliveryAddress}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      <Package size={18} />
                    </div>
                    <div>
                      <p className="font-medium">Payment Method</p>
                      <p className="text-muted-foreground capitalize">{order.paymentMethod} • {order.paymentStatus}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {(order.status === 'delivered' || order.status === 'completed') && (
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Validation</CardTitle>
                  <CardDescription>
                    Both the customer and driver need to validate the delivery
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <User size={18} />
                        <p>Customer Validation</p>
                      </div>
                      {order.customerValidated ? (
                        <Badge variant="success" className="flex items-center gap-1">
                          <Check size={14} /> Validated
                        </Badge>
                      ) : (
                        currentUser?.role === 'customer' ? (
                          <Button size="sm" onClick={() => handleValidation('customer')}>
                            Validate Delivery
                          </Button>
                        ) : (
                          <Badge variant="outline">Pending</Badge>
                        )
                      )}
                    </div>

                    <Separator />

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Truck size={18} />
                        <p>Driver Validation</p>
                      </div>
                      {order.driverValidated ? (
                        <Badge variant="success" className="flex items-center gap-1">
                          <Check size={14} /> Validated
                        </Badge>
                      ) : (
                        currentUser?.role === 'driver' ? (
                          <Button size="sm" onClick={() => handleValidation('driver')}>
                            Validate Delivery
                          </Button>
                        ) : (
                          <Badge variant="outline">Pending</Badge>
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
                <TabsTrigger value="store">Store</TabsTrigger>
                {(order.driverId || currentUser?.role === 'admin') && (
                  <TabsTrigger value="driver">Driver</TabsTrigger>
                )}
              </TabsList>
              
              <TabsContent value="info" className="space-y-4 pt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Order Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 mt-2 rounded-full bg-primary"></div>
                        <div>
                          <p className="text-sm font-medium">Order Placed</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(order.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      {order.status !== 'pending' && (
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 mt-2 rounded-full bg-primary"></div>
                          <div>
                            <p className="text-sm font-medium">Order Confirmed</p>
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
                    <CardTitle className="text-base">Payment</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <p className="text-sm text-muted-foreground">Method</p>
                      <p className="text-sm font-medium capitalize">{order.paymentMethod}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge variant={order.paymentStatus === 'paid' ? 'success' : 'secondary'}>
                        {order.paymentStatus}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="text-sm font-medium">${order.total.toFixed(2)}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="store" className="pt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Store Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                        <Store size={20} />
                      </div>
                      <div>
                        <p className="font-medium">{stores.find(s => s.id === order.storeId)?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {stores.find(s => s.id === order.storeId)?.phone}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Address</p>
                      <p className="text-sm">
                        {stores.find(s => s.id === order.storeId)?.address}
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" onClick={() => navigate(`/stores/${order.storeId}`)}>
                      View Store
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              {(order.driverId || currentUser?.role === 'admin') && (
                <TabsContent value="driver" className="pt-4">
                  {order.driverId ? (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Driver Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                            <Truck size={20} />
                          </div>
                          <div>
                            <p className="font-medium">{driver?.name}</p>
                            <p className="text-sm text-muted-foreground">{driver?.phone}</p>
                          </div>
                        </div>
                      </CardContent>
                      {currentUser?.role === 'customer' && order.status === 'in_delivery' && (
                        <CardFooter>
                          <Button className="w-full">Contact Driver</Button>
                        </CardFooter>
                      )}
                    </Card>
                  ) : currentUser?.role === 'admin' && ['ready_for_pickup', 'confirmed', 'preparing'].includes(order.status) ? (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Assign Driver</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          No driver has been assigned to this order yet.
                        </p>
                        <Button className="w-full">Assign Driver</Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Driver Information</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          No driver has been assigned to this order yet.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              )}
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderDetail;
