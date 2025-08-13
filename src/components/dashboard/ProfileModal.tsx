import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface ProfileModalProps {
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ onClose }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone.replace('+880', '') || '',
    department: user?.department || '',
    designation: user?.designation || ''
  });

  const departments = [
    'Human Resource Management',
    'Software Development',
    'Business Development',
    'Software Quality Assurance',
    'Operations & Management',
    'UI & Graphics Design',
    'TechCare',
    'Requirement Analysis & UX Design',
    'Top Management',
    'DevOps & Network',
    'Finance & Accounts',
    'Internal Audit',
    'Graphics & Creative',
    'Organization Development',
    'IT & Hardware',
    'Legal & Compliance',
    'Operations (Asset Management)'
  ];

  const handleSave = () => {
    // In real app, would make API call to update user data
    toast({
      title: "Profile Updated",
      description: "Your profile information has been updated successfully.",
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone.replace('+880', '') || '',
      department: user?.department || '',
      designation: user?.designation || ''
    });
    setIsEditing(false);
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Name</Label>
          {isEditing ? (
            <Input
              value={editData.name}
              onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
            />
          ) : (
            <div className="p-2 bg-muted rounded-md">{user.name}</div>
          )}
        </div>

        <div className="space-y-2">
          <Label>PIN</Label>
          <div className="p-2 bg-muted rounded-md text-muted-foreground">{user.pin}</div>
        </div>

        <div className="space-y-2">
          <Label>Email</Label>
          {isEditing ? (
            <Input
              type="email"
              value={editData.email}
              onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
            />
          ) : (
            <div className="p-2 bg-muted rounded-md">{user.email}</div>
          )}
        </div>

        <div className="space-y-2">
          <Label>Phone Number</Label>
          {isEditing ? (
            <div className="flex">
              <div className="bg-muted px-3 py-2 border border-r-0 rounded-l-md text-muted-foreground">
                +880
              </div>
              <Input
                value={editData.phone}
                onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                className="rounded-l-none"
              />
            </div>
          ) : (
            <div className="p-2 bg-muted rounded-md">{user.phone}</div>
          )}
        </div>

        <div className="space-y-2">
          <Label>Department</Label>
          {isEditing ? (
            <Select value={editData.department} onValueChange={(value) => setEditData(prev => ({ ...prev, department: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="p-2 bg-muted rounded-md">{user.department || 'Not specified'}</div>
          )}
        </div>

        <div className="space-y-2">
          <Label>Designation</Label>
          {isEditing ? (
            <Input
              value={editData.designation}
              onChange={(e) => setEditData(prev => ({ ...prev, designation: e.target.value }))}
            />
          ) : (
            <div className="p-2 bg-muted rounded-md">{user.designation || 'Not specified'}</div>
          )}
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        {isEditing ? (
          <>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-gradient-primary">
              Save Changes
            </Button>
          </>
        ) : (
          <Button onClick={() => setIsEditing(true)} className="bg-gradient-primary">
            Edit Profile
          </Button>
        )}
      </div>
    </div>
  );
};