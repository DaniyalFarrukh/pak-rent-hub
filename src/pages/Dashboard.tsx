
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MessageSquare, Star, Plus, Eye, Edit, Trash2, TrendingUp, DollarSign, Users, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThemeToggle } from '@/components/ThemeToggle';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Sample user data
  const user = {
    name: 'Ahmed Ali',
    email: 'ahmed@example.com',
    type: 'renter', // 'customer' or 'renter'
    verified: true,
    memberSince: 'March 2023',
    totalEarnings: 125000,
    activeListings: 5,
    totalBookings: 23,
    rating: 4.9
  };

  const myBookings = [
    {
      id: '1',
      title: 'Toyota Corolla 2020',
      renter: 'Ahmad Ali',
      startDate: '2024-12-20',
      endDate: '2024-12-23',
      status: 'confirmed',
      total: 10500,
      image: '/placeholder.svg'
    },
    {
      id: '2',
      title: 'Designer Bridal Lehenga',
      renter: 'Fatima Collection',
      startDate: '2024-12-15',
      endDate: '2024-12-16',
      status: 'completed',
      total: 15000,
      image: '/placeholder.svg'
    }
  ];

  const myListings = [
    {
      id: '1',
      title: 'Honda Civic 2021 - Automatic',
      category: 'Vehicles',
      price: 4000,
      priceType: 'day',
      status: 'active',
      views: 45,
      bookings: 8,
      image: '/placeholder.svg'
    },
    {
      id: '2',
      title: 'Professional Camera Setup',
      category: 'Electronics',
      price: 2500,
      priceType: 'day',
      status: 'active',
      views: 23,
      bookings: 3,
      image: '/placeholder.svg'
    }
  ];

  const recentMessages = [
    {
      id: '1',
      name: 'Sarah Khan',
      lastMessage: 'Is the car available for next weekend?',
      time: '2 hours ago',
      unread: true
    },
    {
      id: '2',
      name: 'Hassan Ali',
      lastMessage: 'Thank you for the smooth rental experience!',
      time: '1 day ago',
      unread: false
    }
  ];

  const StatusBadge = ({ status }: { status: string }) => {
    const colors = {
      confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      paused: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[status as keyof typeof colors]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-300">Welcome back, {user.name}!</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link to="/add-listing">
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Post New Item
                </Button>
              </Link>
              <Link to="/browse">
                <Button variant="outline">Browse Items</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bookings">My Bookings</TabsTrigger>
            <TabsTrigger value="listings">My Listings</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {user.type === 'renter' ? (
                <>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">PKR {user.totalEarnings.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">+12% from last month</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
                      <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{user.activeListings}</div>
                      <p className="text-xs text-muted-foreground">2 pending approval</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{user.totalBookings}</div>
                      <p className="text-xs text-muted-foreground">+3 this month</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                      <Star className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{user.rating}/5</div>
                      <p className="text-xs text-muted-foreground">Based on 23 reviews</p>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">3</div>
                      <p className="text-xs text-muted-foreground">1 upcoming</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">PKR 45,000</div>
                      <p className="text-xs text-muted-foreground">This year</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Saved Items</CardTitle>
                      <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">12</div>
                      <p className="text-xs text-muted-foreground">In wishlist</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Reviews Given</CardTitle>
                      <Star className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">8</div>
                      <p className="text-xs text-muted-foreground">Average: 4.7/5</p>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Bookings */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Bookings</CardTitle>
                  <CardDescription>Your latest rental activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {myBookings.slice(0, 3).map((booking) => (
                      <div key={booking.id} className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <img 
                          src={booking.image} 
                          alt={booking.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white">{booking.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{booking.startDate} - {booking.endDate}</p>
                        </div>
                        <StatusBadge status={booking.status} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Messages */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Messages</CardTitle>
                  <CardDescription>Latest conversations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentMessages.map((message) => (
                      <div key={message.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg cursor-pointer">
                        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                          <span className="text-gray-600 dark:text-gray-300 font-semibold text-sm">
                            {message.name.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-gray-900 dark:text-white">{message.name}</h4>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{message.time}</span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{message.lastMessage}</p>
                        </div>
                        {message.unread && (
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>My Bookings</CardTitle>
                <CardDescription>All your rental bookings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center space-x-4 p-4 border dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow">
                      <img 
                        src={booking.image} 
                        alt={booking.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 dark:text-white">{booking.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300">Rented from {booking.renter}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{booking.startDate} - {booking.endDate}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg dark:text-white">PKR {booking.total.toLocaleString()}</p>
                        <StatusBadge status={booking.status} />
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Button size="sm" variant="outline">View Details</Button>
                        {booking.status === 'completed' && (
                          <Button size="sm" variant="outline">
                            <Star className="w-4 h-4 mr-1" />
                            Review
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Listings Tab (for renters) */}
          <TabsContent value="listings">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>My Listings</CardTitle>
                    <CardDescription>Manage your rental items</CardDescription>
                  </div>
                  <Link to="/add-listing">
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Item
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myListings.map((listing) => (
                    <div key={listing.id} className="flex items-center space-x-4 p-4 border dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow">
                      <img 
                        src={listing.image} 
                        alt={listing.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 dark:text-white">{listing.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300">{listing.category}</p>
                        <p className="text-lg font-semibold dark:text-white">PKR {listing.price.toLocaleString()}/{listing.priceType}</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 mb-1">
                          <Eye className="w-4 h-4" />
                          <span className="text-sm">{listing.views}</span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{listing.bookings} bookings</p>
                      </div>
                      <StatusBadge status={listing.status} />
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>Messages</CardTitle>
                <CardDescription>Chat with customers and renters</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentMessages.map((message) => (
                    <div key={message.id} className="flex items-center space-x-4 p-4 border dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 dark:text-gray-300 font-bold">
                          {message.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{message.name}</h3>
                          <span className="text-sm text-gray-500 dark:text-gray-400">{message.time}</span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300">{message.lastMessage}</p>
                      </div>
                      {message.unread && (
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      )}
                      <Button variant="outline" size="sm">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Reply
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle>Reviews & Ratings</CardTitle>
                <CardDescription>Feedback from your rental experiences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Star className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No reviews yet</h3>
                  <p className="text-gray-600 dark:text-gray-300">Reviews will appear here after completed rentals</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
