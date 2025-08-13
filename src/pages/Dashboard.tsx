import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserDashboard } from '@/components/dashboard/UserDashboard';
import { AdminDashboard } from '@/components/admin/AdminDashboard';

export const Dashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return user.role === 'admin' ? <AdminDashboard /> : <UserDashboard />;
};