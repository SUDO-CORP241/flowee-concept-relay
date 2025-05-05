
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useUser } from '@/contexts/UserContext';
import { orders, stores } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Orders = () => {
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  // Filter orders based on user role
  const userOrders = React.useMemo(() => {
    if (!currentUser) return [];
    
    switch (currentUser.role) {
      case 'customer':
        return orders.filter(order => order.customerId === currentUser.id);
      case 'store':
        return orders.filter(order => order.storeId === currentUser.id);
      case 'driver':
        return orders.filter(order => 
          order.driverId === currentUser.id || 
          ['ready_for_pickup', 'preparing'].includes(order.status)
        );
      case 'admin':
        return orders;
      default:
        return [];
    }
  }, [currentUser]);

  // Apply status filter
  const filteredOrders = React.useMemo(() => {
    if (statusFilter === "all") return userOrders;
    return userOrders.filter(order => order.status === statusFilter);
  }, [userOrders, statusFilter]);

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

  const getFormattedDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Layout>
      <div className="container mx-auto p-4 pb-20">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl font-bold">Orders</h1>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Filter:</span>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="preparing">Preparing</SelectItem>
                  <SelectItem value="ready_for_pickup">Ready for Pickup</SelectItem>
                  <SelectItem value="picked_up">Picked Up</SelectItem>
                  <SelectItem value="in_delivery">In Delivery</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>{currentUser?.role === 'customer' ? 'Store' : 'Customer'}</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map(order => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      #{order.id.substring(0, 5)}
                    </TableCell>
                    <TableCell>
                      {getFormattedDate(order.createdAt)}
                    </TableCell>
                    <TableCell>
                      {currentUser?.role === 'customer' 
                        ? stores.find(s => s.id === order.storeId)?.name
                        : 'Customer #' + order.customerId.substring(0, 5)
                      }
                    </TableCell>
                    <TableCell>
                      ${order.total.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(order.status)}>
                        {order.status.replace(/_/g, ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button 
                        size="sm" 
                        onClick={() => navigate(`/orders/${order.id}`)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredOrders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      No orders found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
