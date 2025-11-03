import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Star, MapPin, Loader2, Search, Menu, X, Key, Plus, LogOut, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LocationInput } from '@/components/LocationInput';
import { MapDisplay } from '@/components/MapDisplay';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Listing {
  id: number;
  title: string;
  category: string;
  location: string;
  price: number;
  photos: string[];
  average_rating?: number;
  owner: string;
}

const Listings = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [ownerNames, setOwnerNames] = useState<Map<string, string>>(new Map());

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: 'Signed out successfully',
      description: 'You have been logged out of your account'
    });
    navigate('/');
  };

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchListings();
  }, [debouncedSearch, selectedLocation]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      setError('');

      // Build query with filters
      let query = supabase
        .from('listings')
        .select('*')
        .eq('available', true);

      // Apply search filter
      if (debouncedSearch) {
        query = query.or(
          `title.ilike.%${debouncedSearch}%,category.ilike.%${debouncedSearch}%,description.ilike.%${debouncedSearch}%`
        );
      }

      // Apply location filter
      if (selectedLocation) {
        query = query.ilike('location', `%${selectedLocation}%`);
      }

      query = query.order('created_at', { ascending: false });

      const { data: listingsData, error: listingsError } = await query;

      if (listingsError) throw listingsError;

      // Fetch reviews to calculate average ratings
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select('listing_id, rating');

      if (reviewsError) throw reviewsError;

      // Calculate average ratings
      const ratingsMap = new Map<number, number>();
      if (reviewsData) {
        const grouped = reviewsData.reduce((acc, review) => {
          if (!acc[review.listing_id]) {
            acc[review.listing_id] = [];
          }
          acc[review.listing_id].push(review.rating);
          return acc;
        }, {} as Record<number, number[]>);

        Object.entries(grouped).forEach(([listingId, ratings]) => {
          const avg = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
          ratingsMap.set(Number(listingId), avg);
        });
      }

      // Combine data
      const listingsWithRatings = listingsData?.map(listing => ({
        ...listing,
        average_rating: ratingsMap.get(listing.id)
      })) || [];

      // Fetch owner names
      const ownerIds = [...new Set(listingsWithRatings.map(l => l.owner))];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('user_id, display_name')
        .in('user_id', ownerIds);

      const namesMap = new Map(profilesData?.map(p => [p.user_id, p.display_name || 'Owner']) || []);
      setOwnerNames(namesMap);

      setListings(listingsWithRatings);
    } catch (err: any) {
      setError(err.message || 'Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating?: number) => {
    if (!rating) return <span className="text-sm text-muted-foreground">No reviews</span>;
    
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < Math.floor(rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-sm font-medium ml-1">{rating.toFixed(1)}</span>
      </div>
    );
  };

  const handleMessageOwner = async (listing: Listing, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication required',
        description: 'Please sign in to message the owner'
      });
      navigate('/login');
      return;
    }

    if (user.id === listing.owner) {
      toast({
        variant: 'destructive',
        title: 'Cannot message yourself',
        description: 'This is your own listing'
      });
      return;
    }

    try {
      // Check if chat already exists
      const { data: existingChat, error: chatError } = await supabase
        .from('chats')
        .select('id')
        .eq('listing_id', listing.id)
        .eq('renter_id', user.id)
        .eq('owner_id', listing.owner)
        .maybeSingle();

      if (chatError && chatError.code !== 'PGRST116') {
        throw chatError;
      }

      if (existingChat) {
        navigate('/messages');
      } else {
        // Create new chat
        const { error: createError } = await supabase
          .from('chats')
          .insert({
            listing_id: listing.id,
            renter_id: user.id,
            owner_id: listing.owner
          });

        if (createError) throw createError;

        toast({
          title: 'Chat started',
          description: `You can now message ${ownerNames.get(listing.owner) || 'the owner'}`
        });
        navigate('/messages');
      }
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to start chat'
      });
    }
  };

  // Prepare map markers
  const mapMarkers = listings
    .filter(listing => listing.location)
    .map(listing => ({
      position: { lat: 31.5497, lng: 74.3436 }, // Default to Lahore center - in real app, use geocoding
      title: listing.title,
      info: `
        <div style="min-width: 200px;">
          <img src="${listing.photos?.[0] || ''}" alt="${listing.title}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" />
          <h3 style="font-weight: 600; margin-bottom: 4px;">${listing.title}</h3>
          <p style="color: #16a34a; font-weight: 600; margin-bottom: 4px;">Rs ${listing.price?.toLocaleString()}/day</p>
          <p style="color: #64748b; font-size: 14px;">${listing.location}</p>
          <a href="/listings/${listing.id}" style="display: inline-block; margin-top: 8px; padding: 6px 12px; background: #16a34a; color: white; text-decoration: none; border-radius: 6px; font-size: 14px;">View Details</a>
        </div>
      `
    }));

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-900 shadow-lg border-b dark:border-gray-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
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
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/browse" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">Browse</Link>
              <Link to="/add-listing" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">List Your Item</Link>
              <Link to="/contact" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">Support</Link>
              <div className="flex items-center space-x-3">
                {user && (
                  <Link to="/messages">
                    <Button variant="outline" size="sm" className="border-gray-300 dark:border-gray-600">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Messages
                    </Button>
                  </Link>
                )}
                <ThemeToggle />
                {user ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSignOut}
                    className="border-gray-300 dark:border-gray-600"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                ) : (
                  <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Link to="/add-listing">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Listing
                    </Link>
                  </Button>
                )}
              </div>
            </div>
            <div className="md:hidden flex items-center space-x-3">
              <ThemeToggle />
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-900 border-t dark:border-gray-800 shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link to="/browse" className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">Browse</Link>
              <Link to="/add-listing" className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">List Your Item</Link>
              <Link to="/contact" className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">Support</Link>
              {user && (
                <Link to="/messages" className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">
                  <MessageCircle className="w-4 h-4 inline mr-2" />
                  Messages
                </Link>
              )}
              <div className="border-t dark:border-gray-800 pt-4 mt-4">
                {user ? (
                  <Button
                    variant="outline"
                    onClick={handleSignOut}
                    className="w-full mx-3 border-gray-300 dark:border-gray-600"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                ) : (
                  <Link 
                    to="/add-listing" 
                    className="block mx-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium text-center"
                  >
                    Add Listing
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
              Browse <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Rental Listings</span>
            </h2>
            <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 mb-8">
              Find exactly what you need from verified renters across Pakistan
            </p>
          </div>

          {/* Search and Filter Section - Better Aligned */}
          <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border dark:border-gray-700">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                <Input
                  type="text"
                  placeholder="Search by title, category, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-14 text-base border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 dark:bg-gray-700 dark:text-white rounded-xl shadow-sm"
                />
              </div>
              <div className="flex-1">
                <LocationInput
                  placeholder="Filter by location..."
                  value={selectedLocation}
                  onChange={(value) => setSelectedLocation(value)}
                />
              </div>
              <Button 
                className="h-14 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg font-semibold rounded-xl whitespace-nowrap"
              >
                <Search className="w-5 h-5 mr-2" />
                Search Now
              </Button>
            </div>
            
            {/* Results count */}
            <div className="mt-4 text-center text-gray-600 dark:text-gray-400">
              <span className="font-semibold text-blue-600 dark:text-blue-400">{listings.length}</span> {listings.length === 1 ? 'listing' : 'listings'} found
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Map Display */}
          {listings.length > 0 && (
            <Card className="mb-8 border-2 dark:border-gray-700">
              <CardContent className="p-0">
                <MapDisplay
                  center={{ lat: 31.5497, lng: 74.3436 }}
                  zoom={12}
                  markers={mapMarkers}
                  height="400px"
                />
              </CardContent>
            </Card>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {listings.length === 0 ? (
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="py-16 text-center">
                <div className="max-w-md mx-auto">
                  <Search className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    {debouncedSearch || selectedLocation ? 'No Results Found' : 'No Listings Yet'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {debouncedSearch || selectedLocation 
                      ? "Try adjusting your search or location filters to find what you're looking for."
                      : "Be the first to add a listing and start earning!"}
                  </p>
                  {!debouncedSearch && !selectedLocation && (
                    <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      <Link to="/add-listing">
                        <Plus className="w-4 h-4 mr-2" />
                        Add First Listing
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {listings.map((listing) => (
                <div key={listing.id} className="relative">
                  <Link to={`/listings/${listing.id}`}>
                    <Card className="group h-full hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 hover:border-blue-200 dark:hover:border-blue-700 dark:bg-gray-800 dark:border-gray-700">
                      <div className="aspect-video w-full overflow-hidden rounded-t-lg bg-gray-100 dark:bg-gray-700">
                        {listing.photos && listing.photos.length > 0 ? (
                          <img
                            src={listing.photos[0]}
                            alt={listing.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-600">
                            <Search className="w-12 h-12" />
                          </div>
                        )}
                      </div>
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start mb-2">
                          <CardTitle className="text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors dark:text-white">{listing.title}</CardTitle>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Rs {listing.price?.toLocaleString()}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">/day</span>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <CardDescription className="flex items-center gap-2 mb-3 dark:text-gray-400">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{listing.location || 'Location not specified'}</span>
                        </CardDescription>
                        <div className="flex justify-between items-center pt-3 border-t dark:border-gray-700 mb-3">
                          <span className="text-sm px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full font-medium">{listing.category}</span>
                          {renderStars(listing.average_rating)}
                        </div>
                        {/* Message Owner Button */}
                        {(!user || user.id !== listing.owner) && (
                          <Button
                            onClick={(e) => handleMessageOwner(listing, e)}
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-md hover:shadow-lg transition-all"
                            size="sm"
                          >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            {user ? 'Chat Now' : 'Sign In to Chat'}
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Listings;
