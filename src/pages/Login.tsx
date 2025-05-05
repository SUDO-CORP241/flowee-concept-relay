
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useUser();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (await login(email, password)) {
      navigate('/');
    }
    
    setIsLoading(false);
  };

  // Demo login functions
  const loginAsCustomer = async () => {
    await login('customer@example.com', 'password');
    navigate('/');
  };
  
  const loginAsStore = async () => {
    await login('store@example.com', 'password');
    navigate('/');
  };
  
  const loginAsDriver = async () => {
    await login('driver@example.com', 'password');
    navigate('/');
  };
  
  const loginAsAdmin = async () => {
    await login('admin@example.com', 'password');
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-flowee-500">Flowee</h1>
          <p className="text-muted-foreground mt-2">NOUN CONCEPT Delivery Management</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Log in"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col">
            <p className="text-sm text-muted-foreground mb-4">Demo accounts:</p>
            <Tabs defaultValue="customer">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="customer">Customer</TabsTrigger>
                <TabsTrigger value="store">Store</TabsTrigger>
                <TabsTrigger value="driver">Driver</TabsTrigger>
                <TabsTrigger value="admin">Admin</TabsTrigger>
              </TabsList>
              <TabsContent value="customer" className="pt-2">
                <Button variant="outline" onClick={loginAsCustomer} className="w-full">
                  Login as Customer
                </Button>
              </TabsContent>
              <TabsContent value="store" className="pt-2">
                <Button variant="outline" onClick={loginAsStore} className="w-full">
                  Login as Store
                </Button>
              </TabsContent>
              <TabsContent value="driver" className="pt-2">
                <Button variant="outline" onClick={loginAsDriver} className="w-full">
                  Login as Driver
                </Button>
              </TabsContent>
              <TabsContent value="admin" className="pt-2">
                <Button variant="outline" onClick={loginAsAdmin} className="w-full">
                  Login as Admin
                </Button>
              </TabsContent>
            </Tabs>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
