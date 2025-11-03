import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { 
  LayoutDashboard, 
  Package, 
  Calendar, 
  MessageCircle, 
  User, 
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  TrendingUp,
  DollarSign,
  Eye,
  Edit,
  Trash2,
  Plus,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { ThemeToggle } from '@/components/ThemeToggle';
import ChatList from '@/components/Chat/ChatList';

const UserDashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [listings, setListings] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    activeListings: 0,
    totalBookings: 0,
    pendingRequests: 0
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      // Fetch user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (profileData) setProfile(profileData);

      // Fetch user listings
      const { data: listingsData } = await supabase
        .from('listings')
        .select('*')
        .eq('owner', user.id)
        .order('created_at', { ascending: false });
      
      if (listingsData) {
        setListings(listingsData);
        setStats(prev => ({
          ...prev,
          activeListings: listingsData.filter(l => l.available).length,
          totalEarnings: listingsData.reduce((sum, l) => sum + (l.price || 0), 0) * 30 // Estimate
        }));
      }

      // Fetch bookings (chats as proxy for bookings)
      const { data: chatsData } = await supabase
        .from('chats')
        .select('*')
        .or(`renter_id.eq.${user.id},owner_id.eq.${user.id}`)
        .order('updated_at', { ascending: false });
      
      if (chatsData) {
        setBookings(chatsData);
        setStats(prev => ({
          ...prev,
          totalBookings: chatsData.length,
          pendingRequests: chatsData.filter(c => c.updated_at > new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()).length
        }));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: 'Signed out successfully',
      description: 'You have been logged out of your account'
    });
    navigate('/');
  };

  const handleDeleteListing = async (listingId: number) => {
    try {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', listingId);

      if (error) throw error;

      toast({
        title: 'Listing deleted',
        description: 'Your listing has been removed successfully'
      });
      fetchDashboardData();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete listing'
      });
    }
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'listings', label: 'My Listings', icon: Package },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
    { id: 'profile', label: 'Profile Settings', icon: User },
  ];

  const StatCard = ({ title, value, icon: Icon, trend }: any) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-2">{value}</p>
            {trend && (
              <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                {trend}
              </p>
            )}
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      {/* Top Navbar */}
      <nav className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 sticky top-0 z-40 shadow-sm">
        <div className="px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">EL</span>
                </div>
                <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hidden sm:inline">
                  Easy Lease
                </span>
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>
              <ThemeToggle />
              <Avatar className="w-9 h-9 border-2 border-blue-200 dark:border-blue-800">
                <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-600 text-white font-semibold">
                  {profile?.display_name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 
          transition-transform duration-300 z-30 overflow-y-auto
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-6">
            <div className="mb-6">
              <h3 className="font-semibold text-sm text-muted-foreground mb-1">NAVIGATION</h3>
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      activeSection === item.id
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <Separator className="my-6" />

            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="w-full justify-start text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sign Out
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {/* Overview Section */}
            {activeSection === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold">Welcome back, {profile?.display_name || 'User'}!</h1>
                  <p className="text-muted-foreground">Here's what's happening with your rentals today.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard
                    title="Total Earnings"
                    value={`Rs ${stats.totalEarnings.toLocaleString()}`}
                    icon={DollarSign}
                    trend="+12% this month"
                  />
                  <StatCard
                    title="Active Listings"
                    value={stats.activeListings}
                    icon={Package}
                  />
                  <StatCard
                    title="Total Bookings"
                    value={stats.totalBookings}
                    icon={Calendar}
                    trend="+3 this week"
                  />
                  <StatCard
                    title="Pending Requests"
                    value={stats.pendingRequests}
                    icon={MessageCircle}
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Listings</CardTitle>
                      <CardDescription>Your latest rental items</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {listings.slice(0, 3).map((listing) => (
                          <div key={listing.id} className="flex items-center gap-4 p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg">
                            {listing.photos && listing.photos[0] ? (
                              <img src={listing.photos[0]} alt={listing.title} className="w-16 h-16 rounded-lg object-cover" />
                            ) : (
                              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-lg"></div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold truncate">{listing.title}</h4>
                              <p className="text-sm text-muted-foreground">Rs {listing.price?.toLocaleString()}/day</p>
                            </div>
                            <Badge variant={listing.available ? 'default' : 'secondary'}>
                              {listing.available ? 'Active' : 'Paused'}
                            </Badge>
                          </div>
                        ))}
                        {listings.length === 0 && (
                          <div className="text-center py-8 text-muted-foreground">
                            <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p>No listings yet</p>
                            <Button asChild className="mt-4">
                              <Link to="/add-listing">
                                <Plus className="w-4 h-4 mr-2" />
                                Create Your First Listing
                              </Link>
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>Latest messages and bookings</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {bookings.slice(0, 4).map((booking, index) => (
                          <div key={booking.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                            <div className="w-2 h-2 mt-2 bg-blue-500 rounded-full"></div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">New message received</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(booking.updated_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        ))}
                        {bookings.length === 0 && (
                          <div className="text-center py-8 text-muted-foreground">
                            <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p>No recent activity</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* My Listings Section */}
            {activeSection === 'listings' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold">My Listings</h1>
                    <p className="text-muted-foreground">Manage your rental items</p>
                  </div>
                  <Button asChild className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                    <Link to="/add-listing">
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Listing
                    </Link>
                  </Button>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {listings.map((listing) => (
                    <Card key={listing.id} className="hover:shadow-xl transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                          {listing.photos && listing.photos[0] ? (
                            <img 
                              src={listing.photos[0]} 
                              alt={listing.title}
                              className="w-full md:w-48 h-48 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-full md:w-48 h-48 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                          )}
                          
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="text-xl font-bold">{listing.title}</h3>
                                <p className="text-sm text-muted-foreground">{listing.category}</p>
                              </div>
                              <Badge variant={listing.available ? 'default' : 'secondary'}>
                                {listing.available ? 'Active' : 'Paused'}
                              </Badge>
                            </div>
                            
                            <p className="text-muted-foreground mb-4 line-clamp-2">{listing.description}</p>
                            
                            <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                              <div className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                <span>234 views</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(listing.created_at).toLocaleDateString()}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                Rs {listing.price?.toLocaleString()}/day
                              </div>
                              
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" asChild>
                                  <Link to={`/listings/${listing.id}`}>
                                    <Eye className="w-4 h-4 mr-2" />
                                    View
                                  </Link>
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleDeleteListing(listing.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {listings.length === 0 && (
                    <Card>
                      <CardContent className="py-16 text-center">
                        <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                        <h3 className="text-xl font-semibold mb-2">No listings yet</h3>
                        <p className="text-muted-foreground mb-6">Start earning by listing your first item!</p>
                        <Button asChild>
                          <Link to="/add-listing">
                            <Plus className="w-4 h-4 mr-2" />
                            Create Your First Listing
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            )}

            {/* Bookings Section */}
            {activeSection === 'bookings' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold">Bookings</h1>
                  <p className="text-muted-foreground">View and manage your rental bookings</p>
                </div>

                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {bookings.map((booking) => (
                        <div key={booking.id} className="flex items-center gap-4 p-4 border dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                            {booking.id.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold">Booking #{booking.id.slice(0, 8)}</h4>
                            <p className="text-sm text-muted-foreground">
                              Updated: {new Date(booking.updated_at).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge>Active</Badge>
                          <Button variant="outline" size="sm">
                            View Details
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                      ))}
                      {bookings.length === 0 && (
                        <div className="text-center py-12">
                          <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                          <h3 className="text-xl font-semibold mb-2">No bookings yet</h3>
                          <p className="text-muted-foreground">Your bookings will appear here</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Messages Section */}
            {activeSection === 'messages' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold">Messages</h1>
                  <p className="text-muted-foreground">Chat with renters and owners</p>
                </div>

                <ChatList />
              </div>
            )}

            {/* Profile Settings Section */}
            {activeSection === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold">Profile Settings</h1>
                  <p className="text-muted-foreground">Manage your account information</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>Update your personal details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Display Name</label>
                        <input 
                          type="text"
                          value={profile?.display_name || ''}
                          className="w-full mt-1 px-4 py-2 border dark:border-gray-700 rounded-lg dark:bg-gray-800"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Email</label>
                        <input 
                          type="email"
                          value={user?.email || ''}
                          disabled
                          className="w-full mt-1 px-4 py-2 border dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-900"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Phone Number</label>
                        <input 
                          type="tel"
                          value={profile?.phone || ''}
                          className="w-full mt-1 px-4 py-2 border dark:border-gray-700 rounded-lg dark:bg-gray-800"
                          placeholder="+92 300 1234567"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Location</label>
                        <input 
                          type="text"
                          value={profile?.location || ''}
                          className="w-full mt-1 px-4 py-2 border dark:border-gray-700 rounded-lg dark:bg-gray-800"
                          placeholder="Your city"
                        />
                      </div>
                      <Button className="w-full">Save Changes</Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Payment Methods</CardTitle>
                      <CardDescription>Manage how you receive payments</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 border dark:border-gray-700 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                              <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <p className="font-semibold">EasyPaisa</p>
                              <p className="text-sm text-muted-foreground">03XX XXXXXXX</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">Edit</Button>
                        </div>
                      </div>

                      <div className="p-4 border dark:border-gray-700 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                              <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                              <p className="font-semibold">JazzCash</p>
                              <p className="text-sm text-muted-foreground">03XX XXXXXXX</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">Edit</Button>
                        </div>
                      </div>

                      <Button variant="outline" className="w-full">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Payment Method
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Security</CardTitle>
                      <CardDescription>Update your password and security settings</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Current Password</label>
                        <input 
                          type="password"
                          className="w-full mt-1 px-4 py-2 border dark:border-gray-700 rounded-lg dark:bg-gray-800"
                          placeholder="••••••••"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">New Password</label>
                        <input 
                          type="password"
                          className="w-full mt-1 px-4 py-2 border dark:border-gray-700 rounded-lg dark:bg-gray-800"
                          placeholder="••••••••"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Confirm New Password</label>
                        <input 
                          type="password"
                          className="w-full mt-1 px-4 py-2 border dark:border-gray-700 rounded-lg dark:bg-gray-800"
                          placeholder="••••••••"
                        />
                      </div>
                      <Button className="w-full">Update Password</Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default UserDashboard;