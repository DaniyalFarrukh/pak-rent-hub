import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Star, MapPin, Loader2, Search, Plus, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LocationInput } from '@/components/LocationInput';
import { MapDisplay } from '@/components/MapDisplay';
import { ListingCRUD } from '@/components/ListingCRUD';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Listing {
  id: number;
  title: string;
  category: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  price: number;
  photos: string[];
  owner: string;
  available: boolean;
  average_rating?: number;
}

const ListingsWithCRUD = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchListings();
    getCurrentUser();
    
    // Set up realtime subscription
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'listings'
        },
        () => {
          fetchListings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [searchTerm, selectedLocation]);

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUserId(user?.id || null);
  };

  const fetchListings = async () => {
    try {
      setLoading(true);

      let query = supabase
        .from('listings')
        .select('*')
        .eq('available', true);

      if (searchTerm) {
        query = query.or(
          `title.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`
        );
      }

      if (selectedLocation) {
        query = query.ilike('location', `%${selectedLocation}%`);
      }

      query = query.order('created_at', { ascending: false });

      const { data: listingsData, error } = await query;

      if (error) throw error;

      // Fetch reviews for ratings
      const { data: reviewsData } = await supabase
        .from('reviews')
        .select('listing_id, rating');

      const ratingsMap = new Map<number, number>();
      if (reviewsData) {
        const grouped = reviewsData.reduce((acc: any, review: any) => {
          if (!acc[review.listing_id]) acc[review.listing_id] = [];
          acc[review.listing_id].push(review.rating);
          return acc;
        }, {});

        Object.entries(grouped).forEach(([listingId, ratings]: [string, any]) => {
          const avg = ratings.reduce((sum: number, r: number) => sum + r, 0) / ratings.length;
          ratingsMap.set(Number(listingId), avg);
        });
      }

      const listingsWithRatings = listingsData?.map(listing => ({
        ...listing,
        average_rating: ratingsMap.get(listing.id)
      })) || [];

      setListings(listingsWithRatings);
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to load listings',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;

    try {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Deleted',
        description: 'Listing deleted successfully'
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete listing',
        variant: 'destructive'
      });
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

  const mapMarkers = listings
    .filter(listing => listing.latitude && listing.longitude)
    .map(listing => ({
      position: { lat: listing.latitude!, lng: listing.longitude! },
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
      <div className="min-h-screen flex items-center justify-center">
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
            <p className="text-muted-foreground">Manage your rental listings</p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Listing
          </Button>
        </div>

        {/* Search and Filter */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search listings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
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

        {/* Map */}
        {mapMarkers.length > 0 && (
          <Card className="mb-6">
            <CardContent className="p-0">
              <MapDisplay
                center={mapMarkers[0].position}
                zoom={12}
                markers={mapMarkers}
                height="400px"
              />
            </CardContent>
          </Card>
        )}

        {/* Listings Grid */}
        {listings.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No listings found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <img
                    src={listing.photos?.[0] || '/placeholder.svg'}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                  {currentUserId === listing.owner && (
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Button
                        size="icon"
                        variant="secondary"
                        onClick={() => setEditingListing(listing)}
                        className="h-8 w-8"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => handleDelete(listing.id)}
                        className="h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{listing.title}</h3>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                    <MapPin className="w-4 h-4" />
                    <span>{listing.location}</span>
                  </div>
                  <div className="mb-2">{renderStars(listing.average_rating)}</div>
                  <p className="text-xl font-bold text-primary">Rs {listing.price?.toLocaleString()}/day</p>
                  <Link to={`/listings/${listing.id}`}>
                    <Button className="w-full mt-4" variant="outline">View Details</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Create Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Listing</DialogTitle>
              <DialogDescription>
                Fill in the details to create a new rental listing
              </DialogDescription>
            </DialogHeader>
            <ListingCRUD
              onSuccess={() => {
                setShowCreateDialog(false);
                fetchListings();
              }}
              onCancel={() => setShowCreateDialog(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={!!editingListing} onOpenChange={() => setEditingListing(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Listing</DialogTitle>
              <DialogDescription>
                Update your listing details
              </DialogDescription>
            </DialogHeader>
            {editingListing && (
              <ListingCRUD
                editData={editingListing}
                onSuccess={() => {
                  setEditingListing(null);
                  fetchListings();
                }}
                onCancel={() => setEditingListing(null)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ListingsWithCRUD;