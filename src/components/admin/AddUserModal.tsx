import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AddUserModalProps {
  onSuccess: (user: any) => void;
  onClose: () => void;
}

export const AddUserModal: React.FC<AddUserModalProps> = ({ onSuccess, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    pin: '',
    email: '',
    phone: '',
    department: '',
    designation: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser = {
      id: Date.now().toString(),
      ...formData,
      phone: `+880${formData.phone}`,
      status: 'active' as const
    };
    onSuccess(newUser);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="pin">PIN</Label>
        <Input
          id="pin"
          value={formData.pin}
          onChange={(e) => setFormData(prev => ({ ...prev, pin: e.target.value }))}
          required
        />
      </div>
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit">Add User</Button>
      </div>
    </form>
  );
};