import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Star, MapPin, Loader2, Search, Menu, X, Key, Plus, LogOut, MessageCircle, LayoutDashboard } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LocationInput } from '@/components/LocationInput';
import { MapDisplay } from '@/components/MapDisplay';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Separator } from '@/components/ui/separator';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Modern Navigation */}
      <nav className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-lg border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl transform group-hover:scale-105 transition-transform duration-300">
                  <Key className="w-7 h-7 text-white transform -rotate-12" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-xs font-bold">R</span>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Easy Lease
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium -mt-0.5">Rental Made Simple</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              <Link to="/browse">
                <Button variant="ghost" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-medium">
                  Browse
                </Button>
              </Link>
              <Link to="/add-listing">
                <Button variant="ghost" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-medium">
                  List Your Item
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="ghost" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-medium">
                  Support
                </Button>
              </Link>
              
              <div className="w-px h-8 bg-gray-200 dark:bg-gray-700 mx-2"></div>
              
              {user && (
                <>
                  <Link to="/user-dashboard">
                    <Button variant="outline" size="sm" className="border-2 border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                  <Link to="/messages">
                    <Button variant="outline" size="sm" className="border-2 border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Messages
                    </Button>
                  </Link>
                </>
              )}
              
              <ThemeToggle />
              
              {user ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="border-2 border-red-200 dark:border-red-800 hover:border-red-400 dark:hover:border-red-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              ) : (
                <Button asChild className="bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 hover:from-blue-700 hover:via-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300">
                  <Link to="/login">
                    <Plus className="w-4 h-4 mr-2" />
                    Get Started
                  </Link>
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-3">
              <ThemeToggle />
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-900 border-t dark:border-gray-800 shadow-xl">
            <div className="px-4 pt-2 pb-4 space-y-2">
              <Link to="/browse" className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg font-medium transition-colors">Browse</Link>
              <Link to="/add-listing" className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg font-medium transition-colors">List Your Item</Link>
              <Link to="/contact" className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg font-medium transition-colors">Support</Link>
              {user && (
                <>
                  <Separator className="my-2" />
                  <Link to="/user-dashboard" className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg font-medium transition-colors">
                    <LayoutDashboard className="w-4 h-4 inline mr-2" />
                    Dashboard
                  </Link>
                  <Link to="/messages" className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg font-medium transition-colors">
                    <MessageCircle className="w-4 h-4 inline mr-2" />
                    Messages
                  </Link>
                </>
              )}
              <Separator className="my-2" />
              {user ? (
                <Button
                  variant="outline"
                  onClick={handleSignOut}
                  className="w-full border-2 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              ) : (
                <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Link to="/login">
                    Get Started
                  </Link>
                </Button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section with Search */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 dark:from-blue-900 dark:via-blue-800 dark:to-purple-900 py-20 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-300 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-5xl lg:text-6xl font-extrabold text-white mb-6 drop-shadow-2xl">
              Find Your Perfect <span className="text-yellow-300">Rental</span>
            </h2>
            <p className="text-xl lg:text-2xl text-white/90 mb-2 font-medium">
              Browse through thousands of verified listings
            </p>
            <p className="text-lg text-white/80">
              Cars • Tools • Dresses • Equipment & More
            </p>
          </div>

          {/* Enhanced Search Bar */}
          <div className="max-w-5xl mx-auto">
            <Card className="border-4 border-white/20 shadow-2xl backdrop-blur-sm bg-white/95 dark:bg-gray-900/95">
              <CardContent className="p-8">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Search Input */}
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      What are you looking for?
                    </label>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                      <Input
                        type="text"
                        placeholder="Search cars, tools, dresses, equipment..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-12 h-16 text-base border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 dark:bg-gray-800 dark:text-white rounded-xl shadow-sm hover:shadow-md transition-all"
                      />
                    </div>
                  </div>

                  {/* Location Filter */}
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Location
                    </label>
                    <LocationInput
                      placeholder="Enter city or area..."
                      value={selectedLocation}
                      onChange={(value) => setSelectedLocation(value)}
                    />
                  </div>

                  {/* Search Button */}
                  <div className="lg:flex lg:items-end">
                    <Button 
                      className="h-16 px-10 bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 hover:from-blue-700 hover:via-blue-600 hover:to-purple-700 shadow-xl hover:shadow-2xl font-bold text-lg rounded-xl transition-all duration-300 transform hover:scale-105 w-full lg:w-auto"
                    >
                      <Search className="w-6 h-6 mr-2" />
                      Search
                    </Button>
                  </div>
                </div>
                
                {/* Results count */}
                <div className="mt-6 text-center">
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    <span className="font-bold text-2xl text-blue-600 dark:text-blue-400">{listings.length}</span> 
                    <span className="ml-2">{listings.length === 1 ? 'listing' : 'listings'} available</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Wave Separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z" fill="currentColor" className="text-gray-50 dark:text-gray-900"/>
          </svg>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
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
                <Card key={listing.id} className="group h-full hover:shadow-2xl transition-all duration-300 border-2 hover:border-blue-200 dark:hover:border-blue-700 dark:bg-gray-800 dark:border-gray-700 flex flex-col">
                  <Link to={`/listings/${listing.id}`} className="flex-1">
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
                      <div className="flex justify-between items-center pt-3 border-t dark:border-gray-700">
                        <span className="text-sm px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full font-medium">{listing.category}</span>
                        {renderStars(listing.average_rating)}
                      </div>
                    </CardContent>
                  </Link>
                  {/* Message Owner Button - Outside Link */}
                  <CardContent className="pt-0 pb-4">
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
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Listings;
