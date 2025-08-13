import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface User {
  id: string;
  name: string;
  pin: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  status: 'active' | 'blocked';
}

interface EditUserModalProps {
  user: User;
  onSuccess: (user: User) => void;
  onClose: () => void;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({ user, onSuccess, onClose }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    department: user.department,
    designation: user.designation
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess({ ...user, ...formData });
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
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit">Update User</Button>
      </div>
    </form>
  );
};