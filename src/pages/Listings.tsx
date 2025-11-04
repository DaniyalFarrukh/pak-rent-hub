import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Filter, MapPin, Heart, MessageCircle, LayoutDashboard, LogOut, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useToast } from '@/components/ui/use-toast';

interface Listing {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  location: string;
  photos: string[];
  available: boolean;
  rating: number;
  owner: string;
}

const Listings = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Vehicles', 'Wedding Dresses', 'Electronics', 'Tools & Equipment', 'Event Equipment'];

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('available', true);
      
      if (error) throw error;
      setListings(data || []);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleMessageOwner = async (listingId: number, ownerId: string) => {
    if (!user) {
      toast({
        title: 'Please login',
        description: 'You need to be logged in to message owners',
        variant: 'destructive'
      });
      navigate('/login');
      return;
    }

    try {
      const { data: existingChat, error: checkError } = await supabase
        .from('chats')
        .select('id')
        .eq('listing_id', listingId)
        .eq('renter_id', user.id)
        .eq('owner_id', ownerId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingChat) {
        navigate(`/messages?chat=${existingChat.id}`);
      } else {
        const { data: newChat, error: createError } = await supabase
          .from('chats')
          .insert({
            listing_id: listingId,
            renter_id: user.id,
            owner_id: ownerId
          })
          .select()
          .single();

        if (createError) throw createError;
        navigate(`/messages?chat=${newChat.id}`);
      }
    } catch (error) {
      console.error('Error creating chat:', error);
      toast({
        title: 'Error',
        description: 'Failed to start chat',
        variant: 'destructive'
      });
    }
  };

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         listing.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || listing.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-900 shadow-lg border-b dark:border-gray-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transform rotate-12">
                  <Key className="w-6 h-6 text-white transform -rotate-12" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">R</span>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Easy Lease
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">Rental Made Simple</p>
              </div>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link to="/browse">
                <Button variant="ghost" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                  Browse
                </Button>
              </Link>
              <Link to="/add-listing">
                <Button variant="ghost" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                  List Item
                </Button>
              </Link>
              {user ? (
                <>
                  <Button variant="outline" size="sm" onClick={() => navigate('/user-dashboard')} className="border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600">
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleLogout} className="border-red-200 dark:border-red-800 text-red-600 dark:text-red-400">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/login')} className="text-gray-700 dark:text-gray-300">
                    Sign In
                  </Button>
                  <Button size="sm" onClick={() => navigate('/signup')} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md">
                    Join Now
                  </Button>
                </>
              )}
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Search Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 dark:from-blue-900 dark:via-blue-800 dark:to-purple-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-white mb-4">Browse Available Listings</h2>
            <p className="text-xl text-white/90">Find the perfect rental for your needs</p>
          </div>
          
          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-3">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search for cars, tools, dresses, equipment..."
                    className="pl-12 h-14 text-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <select 
                  className="w-full h-14 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-lg focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none dark:bg-gray-700 dark:text-white"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Listings Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {filteredListings.length} Available Listings
          </h2>
        </div>
        
        {loading ? (
          <div className="text-center py-16">
            <div className="text-gray-600 dark:text-gray-400 text-lg">Loading listings...</div>
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600 dark:text-gray-400 text-lg">No listings found matching your criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredListings.map((listing) => (
              <Card key={listing.id} className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 hover:border-blue-200 dark:hover:border-blue-700 dark:bg-gray-800 dark:border-gray-700">
                <div className="relative">
                  <img 
                    src={listing.photos?.[0] || '/placeholder.svg'} 
                    alt={listing.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                      {listing.category}
                    </span>
                  </div>
                </div>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-gray-900 dark:text-white">
                    {listing.title}
                  </CardTitle>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{listing.location}</span>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="mb-4">
                    <div className="flex items-baseline">
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        PKR {listing.price?.toLocaleString()}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 ml-1">/day</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md"
                      onClick={() => navigate(`/listings/${listing.id}`)}
                    >
                      View Details
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="border-2 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      onClick={() => handleMessageOwner(listing.id, listing.owner)}
                    >
                      <MessageCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Listings;