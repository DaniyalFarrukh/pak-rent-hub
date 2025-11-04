import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Filter, MapPin, Heart, MessageCircle, LayoutDashboard, LogOut } from 'lucide-react';
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
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-card border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-2xl font-bold text-primary">Easy Lease</Link>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/user-dashboard')}>
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>Login</Button>
                  <Button size="sm" onClick={() => navigate('/signup')}>Sign Up</Button>
                </>
              )}
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Search and Filter */}
      <div className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search listings..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <select 
                className="w-full h-10 px-3 border border-input rounded-md bg-background"
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

      {/* Listings Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold mb-6">{filteredListings.length} Available Listings</h2>
        
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : filteredListings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No listings found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <img 
                  src={listing.photos?.[0] || '/placeholder.svg'} 
                  alt={listing.title}
                  className="w-full h-48 object-cover"
                />
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {listing.category}
                    </span>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{listing.title}</CardTitle>
                  <div className="flex items-center text-sm text-muted-foreground mt-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{listing.location}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold">PKR {listing.price?.toLocaleString()}</span>
                      <span className="text-muted-foreground">/day</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => navigate(`/listings/${listing.id}`)}
                    >
                      View Details
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleMessageOwner(listing.id, listing.owner)}
                    >
                      <MessageCircle className="w-4 h-4" />
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