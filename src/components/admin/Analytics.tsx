import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Users, Calendar, Star, TrendingUp } from 'lucide-react';

const mockBarData = [
  { room: 'Meeting Room 1', bookings: 45 },
  { room: 'Conference Hall', bookings: 32 },
  { room: 'Executive Room', bookings: 28 },
  { room: 'Training Room', bookings: 38 }
];

const mockLineData = [
  { date: 'Jan', 'Meeting Room 1': 12, 'Conference Hall': 8, 'Executive Room': 6, 'Training Room': 10 },
  { date: 'Feb', 'Meeting Room 1': 15, 'Conference Hall': 12, 'Executive Room': 8, 'Training Room': 14 },
  { date: 'Mar', 'Meeting Room 1': 18, 'Conference Hall': 15, 'Executive Room': 12, 'Training Room': 16 },
  { date: 'Apr', 'Meeting Room 1': 22, 'Conference Hall': 18, 'Executive Room': 15, 'Training Room': 20 },
  { date: 'May', 'Meeting Room 1': 25, 'Conference Hall': 22, 'Executive Room': 18, 'Training Room': 24 },
  { date: 'Jun', 'Meeting Room 1': 28, 'Conference Hall': 25, 'Executive Room': 20, 'Training Room': 26 }
];

export const Analytics = () => {
  const [selectedRoom, setSelectedRoom] = useState('all');
  const [dateRange, setDateRange] = useState('6months');

  const stats = [
    {
      title: 'Total Users',
      value: '156',
      description: 'Registered users',
      icon: Users,
      trend: '+12%',
      trendUp: true
    },
    {
      title: 'Total Bookings',
      value: '2,340',
      description: 'All time bookings',
      icon: Calendar,
      trend: '+8%',
      trendUp: true
    },
    {
      title: "Today's Bookings",
      value: '18',
      description: 'Active today',
      icon: TrendingUp,
      trend: '+3',
      trendUp: true
    },
    {
      title: 'System Rating',
      value: '4.6',
      description: 'User satisfaction',
      icon: Star,
      trend: '★★★★★',
      trendUp: true
    }
  ];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Room:</label>
              <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Rooms</SelectItem>
                  <SelectItem value="room1">Meeting Room 1</SelectItem>
                  <SelectItem value="room2">Conference Hall</SelectItem>
                  <SelectItem value="room3">Executive Room</SelectItem>
                  <SelectItem value="room4">Training Room</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Date Range:</label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1month">Last Month</SelectItem>
                  <SelectItem value="3months">Last 3 Months</SelectItem>
                  <SelectItem value="6months">Last 6 Months</SelectItem>
                  <SelectItem value="1year">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button variant="outline" size="sm">
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-medium transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
              <div className={`text-xs flex items-center gap-1 mt-1 ${
                stat.trendUp ? 'text-green-600' : 'text-red-600'
              }`}>
                <span>{stat.trend}</span>
                <span className="text-muted-foreground">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Room Bookings Overview</CardTitle>
            <CardDescription>Total bookings per room</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockBarData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="room" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="bookings" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Line Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Trends</CardTitle>
            <CardDescription>Monthly booking growth by room</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockLineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="Meeting Room 1" stroke="#3B82F6" strokeWidth={2} />
                <Line type="monotone" dataKey="Conference Hall" stroke="#10B981" strokeWidth={2} />
                <Line type="monotone" dataKey="Executive Room" stroke="#8B5CF6" strokeWidth={2} />
                <Line type="monotone" dataKey="Training Room" stroke="#F59E0B" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};