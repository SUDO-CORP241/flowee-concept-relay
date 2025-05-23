
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { deliveryPacks, stores } from '@/data/mockData';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Package, Truck, Clock, DollarSign, CheckCircle, AlertCircle } from 'lucide-react';

const PackManagement = () => {
  const { currentUser } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedPack, setSelectedPack] = useState<string | null>(null);

  // Find current store if user is a store
  const currentStore = currentUser?.role === 'store' 
    ? stores.find(s => s.email === currentUser.email)
    : null;

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  if (currentUser.role !== 'store' && currentUser.role !== 'admin') {
    return (
      <Layout>
        <div className="container mx-auto p-4">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Accès non autorisé</h1>
            <p className="text-muted-foreground">Cette page est réservée aux magasins.</p>
            <Button onClick={() => navigate('/')} className="mt-4">
              Retour à l'accueil
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const handlePurchasePack = (packId: string) => {
    const pack = deliveryPacks.find(p => p.id === packId);
    if (!pack) return;

    // Simulate purchase
    toast({
      title: "Pack acheté avec succès!",
      description: `Vous avez acheté le ${pack.name} pour ${pack.price.toLocaleString()} CDF`,
    });

    // In a real app, this would update the database
    setSelectedPack(null);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-CD', {
      style: 'currency',
      currency: 'CDF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getProgressPercentage = () => {
    if (!currentStore || !currentStore.currentPack) return 0;
    return ((currentStore.totalDeliveries - currentStore.remainingDeliveries) / currentStore.totalDeliveries) * 100;
  };

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Gestion des Packs de Livraison</h1>
          <p className="text-muted-foreground">
            Achetez des packs pour accéder aux services de livraison
          </p>
        </div>

        {/* Current Pack Status */}
        {currentStore && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Mon Pack Actuel
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentStore.currentPack ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold">{currentStore.currentPack.name}</h3>
                      <p className="text-muted-foreground">{currentStore.currentPack.description}</p>
                    </div>
                    <Badge variant="success">Actif</Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-muted-foreground" />
                      <span>{currentStore.remainingDeliveries} livraisons restantes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span>{currentStore.currentPack.driverCommissionRate * 100}% commission livreur</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{currentStore.currentPack.validity} jours de validité</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progression</span>
                      <span>{currentStore.totalDeliveries - currentStore.remainingDeliveries}/{currentStore.totalDeliveries}</span>
                    </div>
                    <Progress value={getProgressPercentage()} className="h-2" />
                  </div>

                  {currentStore.remainingDeliveries <= 10 && (
                    <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <span className="text-yellow-800">
                        Attention: Il vous reste peu de livraisons. Pensez à renouveler votre pack.
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Aucun pack actif</h3>
                  <p className="text-muted-foreground mb-4">
                    Achetez un pack pour commencer à utiliser nos services de livraison
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Available Packs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {deliveryPacks.map(pack => (
            <Card key={pack.id} className="relative overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{pack.name}</CardTitle>
                <div className="text-2xl font-bold text-[#622483]">
                  {formatPrice(pack.price)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{pack.description}</p>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{pack.deliveriesCount} livraisons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{pack.driverCommissionRate * 100}% commission livreur</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{pack.validity} jours de validité</span>
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  style={{ backgroundColor: '#622483' }}
                  onClick={() => setSelectedPack(pack.id)}
                  disabled={currentStore?.currentPack?.id === pack.id}
                >
                  {currentStore?.currentPack?.id === pack.id ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Pack Actuel
                    </>
                  ) : (
                    'Acheter ce pack'
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Purchase Confirmation Modal */}
        {selectedPack && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Confirmer l'achat</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(() => {
                  const pack = deliveryPacks.find(p => p.id === selectedPack);
                  if (!pack) return null;
                  
                  return (
                    <>
                      <div>
                        <h3 className="font-semibold">{pack.name}</h3>
                        <p className="text-sm text-muted-foreground">{pack.description}</p>
                      </div>
                      
                      <div className="bg-muted p-4 rounded-md">
                        <div className="flex justify-between mb-2">
                          <span>Prix:</span>
                          <span className="font-semibold">{formatPrice(pack.price)}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span>Livraisons:</span>
                          <span>{pack.deliveriesCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Validité:</span>
                          <span>{pack.validity} jours</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => setSelectedPack(null)}
                        >
                          Annuler
                        </Button>
                        <Button 
                          className="flex-1"
                          style={{ backgroundColor: '#622483' }}
                          onClick={() => handlePurchasePack(selectedPack)}
                        >
                          Confirmer l'achat
                        </Button>
                      </div>
                    </>
                  );
                })()}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PackManagement;
