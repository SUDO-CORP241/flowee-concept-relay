
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { users } from '@/data/mockData';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Truck, User } from 'lucide-react';

interface AssignDriverModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssign: (driverId: string) => void;
  orderId: string;
}

const AssignDriverModal = ({ open, onOpenChange, onAssign, orderId }: AssignDriverModalProps) => {
  const [selectedDriverId, setSelectedDriverId] = useState<string>("");
  const { toast } = useToast();

  // Filtrer uniquement les livreurs
  const drivers = users.filter(user => user.role === 'driver');

  const handleAssign = () => {
    if (!selectedDriverId) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un livreur",
        variant: "destructive",
      });
      return;
    }

    onAssign(selectedDriverId);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Attribuer un livreur</DialogTitle>
          <DialogDescription>
            Attribuez cette commande à un livreur disponible.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <Select value={selectedDriverId} onValueChange={setSelectedDriverId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionner un livreur" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Livreurs disponibles</SelectLabel>
                {drivers.map((driver) => (
                  <SelectItem key={driver.id} value={driver.id} className="cursor-pointer">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center">
                        <User size={12} />
                      </div>
                      <span>{driver.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        <DialogFooter className="flex sm:justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleAssign} className="gap-2">
            <Truck size={16} /> Assigner
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignDriverModal;
