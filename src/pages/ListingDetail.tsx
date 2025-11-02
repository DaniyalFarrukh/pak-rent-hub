import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Star, MapPin, Loader2, ArrowLeft, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import ChatInterface from '@/components/Chat/ChatInterface';

interface Listing {
  id: number;
  title: string;
  category: string;
  description: string;
  location: string;
  price: number;
  photos: string[];
  created_at: string;
  owner: string;
}

interface Review {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
  reviewer: string;
  reviewer_name?: string;
}

const ListingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [listing, setListing] = useState<Listing | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const [ownerName, setOwnerName] = useState<string>('Owner');
  
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: ''
  });

  useEffect(() => {
    fetchListingDetails();
  }, [id]);

  const fetchListingDetails = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch listing
      const { data: listingData, error: listingError } = await supabase
        .from('listings')
        .select('*')
        .eq('id', Number(id))
        .single();

      if (listingError) throw listingError;
      setListing(listingData);

      // Fetch owner name
      if (listingData.owner) {
        const { data: ownerProfile } = await supabase
          .from('profiles')
          .select('display_name')
          .eq('user_id', listingData.owner)
          .single();
        
        if (ownerProfile?.display_name) {
          setOwnerName(ownerProfile.display_name);
        }
      }

      // Fetch reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select('*')
        .eq('listing_id', Number(id))
        .order('created_at', { ascending: false });

      if (reviewsError) throw reviewsError;

      // Fetch reviewer names
      const reviewerIds = reviewsData?.map(r => r.reviewer) || [];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, display_name')
        .in('id', reviewerIds);

      const profilesMap = new Map(profilesData?.map(p => [p.id, p.display_name]) || []);

      const reviewsWithNames = reviewsData?.map(review => ({
        ...review,
        reviewer_name: profilesMap.get(review.reviewer) || 'Anonymous'
      })) || [];

      setReviews(reviewsWithNames);
    } catch (err: any) {
      setError(err.message || 'Failed to load listing');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please sign in to write a review"
      });
      navigate('/login');
      return;
    }

    try {
      setSubmitting(true);

      const { error } = await supabase
        .from('reviews')
        .insert({
          listing_id: Number(id),
          reviewer: user.id,
          rating: reviewForm.rating,
          comment: reviewForm.comment
        });

      if (error) throw error;

      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!"
      });

      setReviewForm({ rating: 5, comment: '' });
      fetchListingDetails();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Failed to submit review",
        description: err.message
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleMessageOwner = async () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication required',
        description: 'Please sign in to message the owner'
      });
      navigate('/login');
      return;
    }

    if (!listing) return;

    try {
      // Check if chat already exists
      const { data: existingChat, error: chatError } = await supabase
        .from('chats')
        .select('id')
        .eq('listing_id', listing.id)
        .eq('renter_id', user.id)
        .eq('owner_id', listing.owner)
        .single();

      if (chatError && chatError.code !== 'PGRST116') {
        throw chatError;
      }

      if (existingChat) {
        setChatId(existingChat.id);
        setShowChat(true);
      } else {
        // Create new chat
        const { data: newChat, error: createError } = await supabase
          .from('chats')
          .insert({
            listing_id: listing.id,
            renter_id: user.id,
            owner_id: listing.owner
          })
          .select()
          .single();

        if (createError) throw createError;

        setChatId(newChat.id);
        setShowChat(true);
      }
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to start chat'
      });
    }
  };

  const renderStars = (rating: number, interactive = false, onClick?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onClick && onClick(star)}
            disabled={!interactive}
            className={interactive ? 'cursor-pointer' : ''}
          >
            <Star
              className={`w-5 h-5 ${
                star <= rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 p-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">Listing not found</p>
              <Button asChild>
                <Link to="/listings">Back to Listings</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (showChat && chatId && listing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" onClick={() => setShowChat(false)} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Listing
          </Button>
          <div className="h-[600px]">
            <ChatInterface
              chatId={chatId}
              receiverId={listing.owner}
              receiverName={ownerName}
              onClose={() => setShowChat(false)}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/listings">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Listings
          </Link>
        </Button>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
            {error}
          </div>
        )}

        <Card className="mb-8">
          <CardContent className="p-0">
            {listing.photos && listing.photos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-6">
                {listing.photos.map((photo, index) => (
                  <div key={index} className="aspect-video w-full overflow-hidden rounded-lg bg-muted">
                    <img
                      src={photo}
                      alt={`${listing.title} - ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="aspect-video w-full bg-muted flex items-center justify-center text-muted-foreground">
                No photos available
              </div>
            )}

            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">{listing.title}</h1>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {listing.location}
                    </span>
                    <span className="px-3 py-1 bg-secondary rounded-full text-sm">
                      {listing.category}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-primary">
                    Rs {listing.price?.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">per day</p>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Description</h2>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {listing.description || 'No description provided'}
                </p>
              </div>

              {/* Message Owner Button */}
              {user && user.id !== listing.owner && (
                <Button
                  onClick={handleMessageOwner}
                  className="w-full mb-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  size="lg"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Message Owner
                </Button>
              )}

              {reviews.length > 0 && (
                <div className="flex items-center gap-2 pt-4 border-t">
                  {renderStars(averageRating)}
                  <span className="text-lg font-semibold">{averageRating.toFixed(1)}</span>
                  <span className="text-muted-foreground">({reviews.length} reviews)</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Reviews Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Reviews ({reviews.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {reviews.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No reviews yet. Be the first to review!
              </p>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="border-b last:border-0 pb-6 last:pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold">{review.reviewer_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {renderStars(review.rating)}
                  </div>
                  <p className="text-muted-foreground">{review.comment}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Write Review Form */}
        <Card>
          <CardHeader>
            <CardTitle>Write a Review</CardTitle>
            <CardDescription>
              {user ? 'Share your experience with this listing' : 'Sign in to write a review'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {user ? (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <Label>Rating</Label>
                  {renderStars(reviewForm.rating, true, (rating) => 
                    setReviewForm(prev => ({ ...prev, rating }))
                  )}
                </div>

                <div>
                  <Label htmlFor="comment">Comment</Label>
                  <Textarea
                    id="comment"
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                    placeholder="Share your thoughts about this listing..."
                    rows={4}
                    required
                  />
                </div>

                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </Button>
              </form>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">Please sign in to write a review</p>
                <Button asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ListingDetail;
