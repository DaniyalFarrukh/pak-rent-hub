import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, X } from 'lucide-react';
import { LocationPicker } from './LocationPicker';

interface ListingFormData {
  title: string;
  category: string;
  description: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  price: string;
  photos: File[];
}

interface ListingCRUDProps {
  onSuccess: () => void;
  editData?: any;
  onCancel?: () => void;
}

export const ListingCRUD: React.FC<ListingCRUDProps> = ({ onSuccess, editData, onCancel }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ListingFormData>({
    title: editData?.title || '',
    category: editData?.category || '',
    description: editData?.description || '',
    location: editData?.location || '',
    latitude: editData?.latitude || null,
    longitude: editData?.longitude || null,
    price: editData?.price?.toString() || '',
    photos: []
  });
  const [photoPreviews, setPhotoPreviews] = useState<string[]>(editData?.photos || []);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + photoPreviews.length > 6) {
      toast({
        title: 'Too many photos',
        description: 'Maximum 6 photos allowed',
        variant: 'destructive'
      });
      return;
    }

    setFormData(prev => ({ ...prev, photos: [...prev.photos, ...files] }));
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoPreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleLocationSelect = (location: string, lat: number, lng: number) => {
    setFormData(prev => ({
      ...prev,
      location,
      latitude: lat,
      longitude: lng
    }));
  };

  const uploadPhotos = async (userId: string) => {
    const photoUrls: string[] = [];
    
    for (const file of formData.photos) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}-${Math.random()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('listings-photos')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        continue;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('listings-photos')
        .getPublicUrl(fileName);

      photoUrls.push(publicUrl);
    }

    return photoUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: 'Authentication required',
          description: 'Please log in to manage listings',
          variant: 'destructive'
        });
        return;
      }

      let photoUrls = editData?.photos || [];
      if (formData.photos.length > 0) {
        const newPhotoUrls = await uploadPhotos(user.id);
        photoUrls = [...photoUrls, ...newPhotoUrls];
      }

      const listingData = {
        title: formData.title,
        category: formData.category,
        description: formData.description,
        location: formData.location,
        latitude: formData.latitude,
        longitude: formData.longitude,
        price: parseFloat(formData.price),
        photos: photoUrls,
        available: true,
        owner: user.id
      };

      if (editData) {
        const { error } = await supabase
          .from('listings')
          .update(listingData)
          .eq('id', editData.id);

        if (error) throw error;

        toast({
          title: 'Updated!',
          description: 'Listing updated successfully'
        });
      } else {
        const { error } = await supabase
          .from('listings')
          .insert([listingData]);

        if (error) throw error;

        toast({
          title: 'Created!',
          description: 'Listing created successfully'
        });
      }

      onSuccess();
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save listing',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editData ? 'Edit Listing' : 'Create New Listing'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
            />
          </div>

          <LocationPicker
            onLocationSelect={handleLocationSelect}
            defaultLocation={formData.location}
            defaultLat={formData.latitude}
            defaultLng={formData.longitude}
          />

          <div>
            <Label htmlFor="price">Price (Rs./day)</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="photos">Photos (Max 6)</Label>
            <Input
              id="photos"
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoSelect}
              disabled={photoPreviews.length >= 6}
            />
            {photoPreviews.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-2">
                {photoPreviews.map((preview, idx) => (
                  <div key={idx} className="relative">
                    <img src={preview} alt={`Preview ${idx + 1}`} className="w-full h-24 object-cover rounded" />
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="absolute top-1 right-1 h-6 w-6"
                      onClick={() => {
                        setPhotoPreviews(prev => prev.filter((_, i) => i !== idx));
                        setFormData(prev => ({
                          ...prev,
                          photos: prev.photos.filter((_, i) => i !== idx)
                        }));
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editData ? 'Update' : 'Create'} Listing
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};