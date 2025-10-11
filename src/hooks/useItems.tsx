import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface ItemFormData {
  title: string;
  description: string;
  category: string;
  location: string;
  dailyPrice?: number;
  weeklyPrice?: number;
  monthlyPrice?: number;
  availableFrom?: Date;
  availableTo?: Date;
  rules?: string;
  features?: string[];
}

export const useItems = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const uploadImage = async (file: File, itemId: string, userId: string): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${itemId}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('item-photos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('item-photos')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Upload Failed',
        description: 'Failed to upload image. Please try again.',
        variant: 'destructive'
      });
      return null;
    }
  };

  const createItem = async (formData: ItemFormData, images: File[]) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: 'Authentication Required',
          description: 'Please log in to create a listing.',
          variant: 'destructive'
        });
        return null;
      }

      // Create item
      const { data: item, error: itemError } = await supabase
        .from('items')
        .insert({
          user_id: user.id,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          location: formData.location,
          status: 'draft',
          available_from: formData.availableFrom?.toISOString().split('T')[0],
          available_until: formData.availableTo?.toISOString().split('T')[0]
        })
        .select()
        .single();

      if (itemError) throw itemError;

      // Upload images
      const uploadPromises = images.map(file => uploadImage(file, item.id, user.id));
      const uploadedUrls = await Promise.all(uploadPromises);
      const validUrls = uploadedUrls.filter(url => url !== null) as string[];

      // Insert photos
      if (validUrls.length > 0) {
        const photoInserts = validUrls.map(url => ({
          item_id: item.id,
          photo_url: url
        }));

        const { error: photosError } = await supabase
          .from('item_photos')
          .insert(photoInserts);

        if (photosError) throw photosError;
      }

      // Insert pricing
      const { error: pricingError } = await supabase
        .from('pricing')
        .insert({
          item_id: item.id,
          daily_price: formData.dailyPrice,
          weekly_price: formData.weeklyPrice,
          monthly_price: formData.monthlyPrice,
          currency: 'PKR'
        });

      if (pricingError) throw pricingError;

      // Insert availability with rules
      if (formData.availableFrom && formData.availableTo) {
        const { error: availabilityError } = await supabase
          .from('availability')
          .insert({
            item_id: item.id,
            available_from: formData.availableFrom.toISOString().split('T')[0],
            available_to: formData.availableTo.toISOString().split('T')[0],
            rules: formData.rules
          });

        if (availabilityError) throw availabilityError;
      }

      toast({
        title: 'Success!',
        description: 'Your item has been created successfully.',
      });

      return item;
    } catch (error: any) {
      console.error('Error creating item:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create item. Please try again.',
        variant: 'destructive'
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const publishItem = async (itemId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('items')
        .update({ status: 'published' })
        .eq('id', itemId);

      if (error) throw error;

      toast({
        title: 'Published!',
        description: 'Your item is now live and visible to renters.',
      });

      return true;
    } catch (error: any) {
      console.error('Error publishing item:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to publish item.',
        variant: 'destructive'
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getMyItems = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return [];

      const { data, error } = await supabase
        .from('items')
        .select(`
          *,
          item_photos(photo_url),
          pricing(daily_price, weekly_price, monthly_price, currency)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error: any) {
      console.error('Error fetching items:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch your items.',
        variant: 'destructive'
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (itemId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      toast({
        title: 'Deleted',
        description: 'Item has been deleted successfully.',
      });

      return true;
    } catch (error: any) {
      console.error('Error deleting item:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete item.',
        variant: 'destructive'
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createItem,
    publishItem,
    getMyItems,
    deleteItem
  };
};
