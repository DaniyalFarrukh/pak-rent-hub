
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Package, 
  Star, 
  Heart, 
  Settings, 
  LogOut, 
  LayoutDashboard,
  Download,
  RefreshCw,
  Edit,
  Trash2,
  Camera,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '@/components/ThemeToggle';

const CustomerDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Dummy user data
  const user = {
    name: 'Sarah Ahmed',
    email: 'sarah.ahmed@example.com',
    phone: '+92 300 1234567',
    address: 'Street 15, F-8 Markaz, Islamabad',
    avatar: '/placeholder.svg',
    memberSince: 'January 2023',
    totalOrders: 24,
    totalSpent: 89500,
    rewardPoints: 1250
  };

  // Dummy orders data
  const orders = [
    {
      id: 'ORD-2024-001',
      date: '2024-12-15',
      status: 'Delivered',
      total: 15000,
      items: [
        {
          id: '1',
          name: 'iPhone 15 Pro Max',
          image: '/placeholder.svg',
          price: 15000,
          quantity: 1
        }
      ]
    },
    {
      id: 'ORD-2024-002',
      date: '2024-12-10',
      status: 'In Transit',
      total: 8500,
      items: [
        {
          id: '2',
          name: 'Nike Air Max Sneakers',
          image: '/placeholder.svg',
          price: 8500,
          quantity: 1
        }
      ]
    },
    {
      id: 'ORD-2024-003',
      date: '2024-12-05',
      status: 'Canceled',
      total: 3200,
      items: [
        {
          id: '3',
          name: 'Wireless Bluetooth Headphones',
          image: '/placeholder.svg',
          price: 3200,
          quantity: 1
        }
      ]
    }
  ];

  // Dummy reviews data
  const reviews = [
    {
      id: '1',
      productId: '1',
      productName: 'iPhone 15 Pro Max',
      productImage: '/placeholder.svg',
      rating: 5,
      comment: 'Excellent phone with amazing camera quality. Fast delivery and great packaging.',
      date: '2024-12-16',
      helpful: 12
    },
    {
      id: '2',
      productId: '2',
      productName: 'Nike Air Max Sneakers',
      productImage: '/placeholder.svg',
      rating: 4,
      comment: 'Comfortable shoes, true to size. Good quality materials.',
      date: '2024-12-11',
      helpful: 8
    }
  ];

  // Dummy wishlist data
  const wishlist = [
    {
      id: '1',
      name: 'MacBook Pro 14-inch',
      image: '/placeholder.svg',
      price: 285000,
      originalPrice: 300000,
      discount: 5,
      inStock: true
    },
    {
      id: '2',
      name: 'Sony WH-1000XM5 Headphones',
      image: '/placeholder.svg',
      price: 45000,
      originalPrice: 50000,
      discount: 10,
      inStock: false
    }
  ];

  const StatusBadge = ({ status }: { status: string }) => {
    const colors = {
      'Delivered': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'In Transit': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Processing': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'Canceled': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    
    return (
      <Badge className={colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {status}
      </Badge>
    );
  };

  const StarRating = ({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} ${
              star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Account</h1>
              <p className="text-gray-600 dark:text-gray-300">Manage your orders and account settings</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link to="/browse">
                <Button variant="outline">Continue Shopping</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center mb-6">
                  <Avatar className="w-20 h-20 mb-4">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="text-lg">{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold text-lg dark:text-white">{user.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">Member since {user.memberSince}</p>
                </div>

                <Separator className="my-4" />

                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === 'dashboard' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('orders')}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === 'orders' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Package className="w-4 h-4" />
                    <span>My Orders</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === 'reviews' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Star className="w-4 h-4" />
                    <span>My Reviews</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('wishlist')}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === 'wishlist' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Heart className="w-4 h-4" />
                    <span>Wishlist</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === 'profile' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === 'settings' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                  
                  <Separator className="my-2" />
                  
                  <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400">
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Dashboard Overview */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Orders</p>
                          <p className="text-2xl font-bold dark:text-white">{user.totalOrders}</p>
                        </div>
                        <Package className="w-8 h-8 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Spent</p>
                          <p className="text-2xl font-bold dark:text-white">PKR {user.totalSpent.toLocaleString()}</p>
                        </div>
                        <Package className="w-8 h-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Reward Points</p>
                          <p className="text-2xl font-bold dark:text-white">{user.rewardPoints}</p>
                        </div>
                        <Star className="w-8 h-8 text-yellow-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Orders */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                    <CardDescription>Your latest purchases</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {orders.slice(0, 3).map((order) => (
                        <div key={order.id} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <img 
                            src={order.items[0].image} 
                            alt={order.items[0].name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold dark:text-white">{order.items[0].name}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Order #{order.id}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-500">{order.date}</p>
                          </div>
                          <StatusBadge status={order.status} />
                          <p className="font-bold dark:text-white">PKR {order.total.toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <Card>
                <CardHeader>
                  <CardTitle>My Orders</CardTitle>
                  <CardDescription>Track and manage your orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div key={order.id} className="border dark:border-gray-700 rounded-lg p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold dark:text-white">Order #{order.id}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Placed on {order.date}</p>
                          </div>
                          <StatusBadge status={order.status} />
                        </div>
                        
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center space-x-4 mb-4">
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-20 h-20 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium dark:text-white">{item.name}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Quantity: {item.quantity}</p>
                              <p className="font-semibold dark:text-white">PKR {item.price.toLocaleString()}</p>
                            </div>
                          </div>
                        ))}
                        
                        <Separator className="my-4" />
                        
                        <div className="flex justify-between items-center">
                          <p className="font-bold text-lg dark:text-white">Total: PKR {order.total.toLocaleString()}</p>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4 mr-2" />
                              Invoice
                            </Button>
                            {order.status === 'Delivered' && (
                              <Button variant="outline" size="sm">
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Reorder
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <Card>
                <CardHeader>
                  <CardTitle>My Reviews</CardTitle>
                  <CardDescription>Reviews you've written for products</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="border dark:border-gray-700 rounded-lg p-6">
                        <div className="flex items-start space-x-4">
                          <img 
                            src={review.productImage} 
                            alt={review.productName}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold dark:text-white">{review.productName}</h4>
                            <div className="flex items-center space-x-2 my-2">
                              <StarRating rating={review.rating} />
                              <span className="text-sm text-gray-600 dark:text-gray-400">{review.date}</span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">{review.helpful} people found this helpful</p>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <Card>
                <CardHeader>
                  <CardTitle>My Wishlist</CardTitle>
                  <CardDescription>Items you want to buy later</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {wishlist.map((item) => (
                      <div key={item.id} className="border dark:border-gray-700 rounded-lg p-4">
                        <div className="relative">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-48 rounded-lg object-cover"
                          />
                          {item.discount > 0 && (
                            <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                              -{item.discount}%
                            </Badge>
                          )}
                          <button className="absolute top-2 right-2 p-2 bg-white/80 dark:bg-gray-800/80 rounded-full">
                            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                          </button>
                        </div>
                        <div className="mt-4">
                          <h4 className="font-semibold dark:text-white">{item.name}</h4>
                          <div className="flex items-center space-x-2 mt-2">
                            <span className="font-bold text-lg dark:text-white">PKR {item.price.toLocaleString()}</span>
                            {item.originalPrice > item.price && (
                              <span className="text-sm text-gray-500 line-through">PKR {item.originalPrice.toLocaleString()}</span>
                            )}
                          </div>
                          <div className="mt-4 space-y-2">
                            <Button className="w-full" disabled={!item.inStock}>
                              {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                            </Button>
                            <Button variant="outline" className="w-full">
                              Remove from Wishlist
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Manage your personal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="text-xl">{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <Button variant="outline" size="sm">
                        <Camera className="w-4 h-4 mr-2" />
                        Change Photo
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                        <div className="flex items-center space-x-2 mt-1">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="dark:text-white">{user.name}</span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <span className="dark:text-white">{user.email}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <span className="dark:text-white">{user.phone}</span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
                        <div className="flex items-center space-x-2 mt-1">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span className="dark:text-white">{user.address}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-4">
                    <Button>Edit Profile</Button>
                    <Button variant="outline">Change Password</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage your account preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium dark:text-white">Email Notifications</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Receive order updates via email</p>
                      </div>
                      <Button variant="outline" size="sm">Toggle</Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium dark:text-white">SMS Notifications</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Receive delivery updates via SMS</p>
                      </div>
                      <Button variant="outline" size="sm">Toggle</Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium dark:text-white">Marketing Emails</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Receive promotional offers</p>
                      </div>
                      <Button variant="outline" size="sm">Toggle</Button>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h4 className="font-medium dark:text-white">Account Management</h4>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start">
                          Download My Data
                        </Button>
                        <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                          Delete Account
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
