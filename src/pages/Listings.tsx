import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Star, MapPin, Loader2, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LocationInput } from '@/components/LocationInput';
import { MapDisplay } from '@/components/MapDisplay';

interface Listing {
  id: number;
  title: string;
  category: string;
  location: string;
  price: number;
  photos: string[];
  average_rating?: number;
}

const Listings = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

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
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Pak Rent Hub</h1>
            <p className="text-muted-foreground">Discover amazing rental items</p>
          </div>
          <Button asChild>
            <Link to="/add-listing">Add Listing</Link>
          </Button>
        </div>

        {/* Search and Filter Section */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search by title, category, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-lg shadow-sm"
                />
              </div>
              <div className="flex-1">
                <LocationInput
                  placeholder="Filter by location..."
                  value={selectedLocation}
                  onChange={(value) => setSelectedLocation(value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Map Display */}
        {listings.length > 0 && (
          <Card className="mb-6">
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
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
            {error}
          </div>
        )}

        {listings.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">
                {debouncedSearch || selectedLocation 
                  ? "No results found. Try adjusting your search or location filters."
                  : "No listings available yet."}
              </p>
              {!debouncedSearch && !selectedLocation && (
                <Button asChild>
                  <Link to="/add-listing">Be the first to add a listing!</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <Link key={listing.id} to={`/listings/${listing.id}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="aspect-video w-full overflow-hidden rounded-t-lg bg-muted">
                    {listing.photos && listing.photos.length > 0 ? (
                      <img
                        src={listing.photos[0]}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        No photo
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-lg">{listing.title}</CardTitle>
                      <span className="text-sm font-semibold text-primary">
                        Rs {listing.price?.toLocaleString()}/day
                      </span>
                    </div>
                    <CardDescription className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {listing.location || 'Location not specified'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">{listing.category}</span>
                      {renderStars(listing.average_rating)}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Listings;
