
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useUser } from '@/contexts/UserContext';
import { orders, stores, users, pickupPoints } from '@/data/mockData';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Package, Store, Truck, User, MapPin } from 'lucide-react';

const Admin = () => {
  const { currentUser } = useUser();
  const navigate = useNavigate();
  
  // Redirect if not admin
  React.useEffect(() => {
    if (currentUser && currentUser.role !== 'admin') {
      navigate('/');
    }
  }, [currentUser, navigate]);

  // Filter users by role
  const customers = users.filter(u => u.role === 'customer');
  const storeUsers = users.filter(u => u.role === 'store');
  const drivers = users.filter(u => u.role === 'driver');
  
  // Statistics
  const totalOrders = orders.length;
  const completedOrders = orders.filter(o => o.status === 'completed').length;
  const activeOrders = orders.filter(o => !['completed', 'cancelled'].includes(o.status)).length;
  const totalStores = stores.length;
  
  return (
    <Layout>
      <div className="container mx-auto p-4 pb-20">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <Package className="mr-2" size={18} />
                Total Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalOrders}</p>
              <p className="text-sm text-muted-foreground">
                {completedOrders} completed
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <Truck className="mr-2" size={18} />
                Active Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{activeOrders}</p>
              <p className="text-sm text-muted-foreground">
                {orders.filter(o => o.status === 'in_delivery').length} in delivery
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <Store className="mr-2" size={18} />
                Stores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalStores}</p>
              <p className="text-sm text-muted-foreground">
                {stores.filter(s => s.rating >= 4.5).length} highly rated
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <User className="mr-2" size={18} />
                Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{users.length}</p>
              <p className="text-sm text-muted-foreground">
                {customers.length} customers
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none px-0 mb-4">
            <TabsTrigger value="users" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">Users</TabsTrigger>
            <TabsTrigger value="stores" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">Stores</TabsTrigger>
            <TabsTrigger value="pickupPoints" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">Pickup Points</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Users</CardTitle>
                <CardDescription>
                  Manage all users in the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map(user => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.id.substring(0, 5)}
                        </TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.phone}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="sm">Edit</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <Button>Add New User</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="stores" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Stores</CardTitle>
                <CardDescription>
                  Manage all partner stores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Categories</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stores.map(store => (
                      <TableRow key={store.id}>
                        <TableCell className="font-medium">{store.name}</TableCell>
                        <TableCell>{store.address}</TableCell>
                        <TableCell>{store.phone}</TableCell>
                        <TableCell>{store.categories.join(', ')}</TableCell>
                        <TableCell>{store.rating}</TableCell>
                        <TableCell>
                          <Button size="sm" onClick={() => navigate(`/stores/${store.id}`)}>
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <Button>Add New Store</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="pickupPoints" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Pickup Points</CardTitle>
                <CardDescription>
                  Manage external partner pickup points
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pickupPoints.map(point => (
                      <TableRow key={point.id}>
                        <TableCell className="font-medium">{point.name}</TableCell>
                        <TableCell>{point.address}</TableCell>
                        <TableCell>
                          {point.contactPerson} • {point.phone}
                        </TableCell>
                        <TableCell>
                          <Badge variant={point.isActive ? "success" : "secondary"}>
                            {point.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="sm">Edit</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <Button className="flex items-center gap-2">
                  <MapPin size={16} />
                  Add Pickup Point
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Admin;
