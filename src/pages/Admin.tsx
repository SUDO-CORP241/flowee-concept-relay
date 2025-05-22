
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
          <h1 className="text-2xl font-bold">Tableau de bord administrateur</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <Package className="mr-2" size={18} />
                Commandes totales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalOrders}</p>
              <p className="text-sm text-muted-foreground">
                {completedOrders} terminées
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <Truck className="mr-2" size={18} />
                Commandes actives
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{activeOrders}</p>
              <p className="text-sm text-muted-foreground">
                {orders.filter(o => o.status === 'in_delivery').length} en livraison
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <Store className="mr-2" size={18} />
                Magasins
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalStores}</p>
              <p className="text-sm text-muted-foreground">
                {stores.filter(s => s.rating >= 4.5).length} bien notés
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <User className="mr-2" size={18} />
                Utilisateurs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{users.length}</p>
              <p className="text-sm text-muted-foreground">
                {customers.length} clients
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none px-0 mb-4">
            <TabsTrigger value="users" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">Utilisateurs</TabsTrigger>
            <TabsTrigger value="stores" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">Magasins</TabsTrigger>
            <TabsTrigger value="pickupPoints" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">Points de retrait</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Utilisateurs</CardTitle>
                <CardDescription>
                  Gérer tous les utilisateurs du système
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nom</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Téléphone</TableHead>
                      <TableHead>Rôle</TableHead>
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
                            {user.role === 'customer' ? 'client' : 
                             user.role === 'store' ? 'magasin' : 
                             user.role === 'driver' ? 'livreur' : 'admin'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="sm">Modifier</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <Button>Ajouter un utilisateur</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="stores" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Magasins</CardTitle>
                <CardDescription>
                  Gérer tous les magasins partenaires
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Adresse</TableHead>
                      <TableHead>Téléphone</TableHead>
                      <TableHead>Catégories</TableHead>
                      <TableHead>Note</TableHead>
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
                            Voir
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <Button>Ajouter un magasin</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="pickupPoints" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Points de retrait</CardTitle>
                <CardDescription>
                  Gérer les points de retrait partenaires externes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Adresse</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Statut</TableHead>
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
                            {point.isActive ? "Actif" : "Inactif"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="sm">Modifier</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <Button className="flex items-center gap-2">
                  <MapPin size={16} />
                  Ajouter un point de retrait
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
