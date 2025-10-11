import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CreateItemData {
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

  const uploadImages = async (itemId: string, files: File[]) => {
    const uploadedUrls: string[] = [];
    
    for (const file of files) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${itemId}/${Math.random()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('item-photos')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('item-photos')
          .getPublicUrl(fileName);

        uploadedUrls.push(publicUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
        toast({
          title: 'Upload Error',
          description: `Failed to upload ${file.name}`,
          variant: 'destructive'
        });
      }
    }

    return uploadedUrls;
  };

  const createItem = async (data: CreateItemData, imageFiles: File[]) => {
    setLoading(true);
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: 'Authentication Required',
          description: 'Please log in to post an item',
          variant: 'destructive'
        });
        return null;
      }

      // Create item in database
      const { data: item, error: itemError } = await supabase
        .from('items')
        .insert({
          user_id: user.id,
          title: data.title,
          description: data.description,
          category: data.category,
          location: data.location,
          status: 'draft'
        })
        .select()
        .single();

      if (itemError) throw itemError;

      // Upload images
      if (imageFiles.length > 0) {
        const photoUrls = await uploadImages(item.id, imageFiles);
        
        // Save photo URLs to database
        if (photoUrls.length > 0) {
          const photoInserts = photoUrls.map(url => ({
            item_id: item.id,
            photo_url: url
          }));

          await supabase.from('item_photos').insert(photoInserts);
        }
      }

      // Add pricing if provided
      if (data.dailyPrice || data.weeklyPrice || data.monthlyPrice) {
        await supabase.from('pricing').insert({
          item_id: item.id,
          daily_price: data.dailyPrice,
          weekly_price: data.weeklyPrice,
          monthly_price: data.monthlyPrice,
          currency: 'PKR'
        });
      }

      // Add availability if provided
      if (data.availableFrom && data.availableTo) {
        await supabase.from('availability').insert({
          item_id: item.id,
          available_from: data.availableFrom.toISOString().split('T')[0],
          available_to: data.availableTo.toISOString().split('T')[0],
          rules: data.rules || null
        });
      }

      toast({
        title: 'Success',
        description: 'Item created successfully!'
      });

      return item;
    } catch (error: any) {
      console.error('Error creating item:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create item',
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
        description: 'Your item is now live and available for rent'
      });

      return true;
    } catch (error: any) {
      console.error('Error publishing item:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to publish item',
        variant: 'destructive'
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const fetchMyItems = async () => {
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
        description: 'Failed to fetch your items',
        variant: 'destructive'
      });
      return [];
    }
  };

  const deleteItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      toast({
        title: 'Deleted',
        description: 'Item deleted successfully'
      });

      return true;
    } catch (error: any) {
      console.error('Error deleting item:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete item',
        variant: 'destructive'
      });
      return false;
    }
  };

  return {
    loading,
    createItem,
    publishItem,
    fetchMyItems,
    deleteItem
  };
};
