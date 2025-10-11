import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get auth user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    const itemId = pathParts[pathParts.length - 1];

    // GET /api/items - Fetch all items
    if (req.method === 'GET' && !itemId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      const { data: items, error } = await supabase
        .from('items')
        .select(`
          *,
          item_photos(photo_url),
          pricing(*),
          availability(*)
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return new Response(JSON.stringify(items), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // GET /api/items/:id - Fetch single item
    if (req.method === 'GET' && itemId) {
      const { data: item, error } = await supabase
        .from('items')
        .select(`
          *,
          item_photos(photo_url),
          pricing(*),
          availability(*)
        `)
        .eq('id', itemId)
        .single();

      if (error) throw error;

      return new Response(JSON.stringify(item), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // POST /api/items - Create new item
    if (req.method === 'POST') {
      const body = await req.json();
      
      // Validate required fields
      if (!body.title || !body.category || !body.description || !body.location) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields: title, category, description, location' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Create item
      const { data: item, error: itemError } = await supabase
        .from('items')
        .insert({
          user_id: user.id,
          title: body.title,
          category: body.category,
          description: body.description,
          location: body.location,
          status: body.status || 'draft',
        })
        .select()
        .single();

      if (itemError) throw itemError;

      // Add photos if provided
      if (body.photos && body.photos.length > 0) {
        const photoInserts = body.photos.map((url: string) => ({
          item_id: item.id,
          photo_url: url,
        }));

        const { error: photoError } = await supabase
          .from('item_photos')
          .insert(photoInserts);

        if (photoError) console.error('Photo insert error:', photoError);
      }

      // Add pricing if provided
      if (body.pricing) {
        const { error: pricingError } = await supabase
          .from('pricing')
          .insert({
            item_id: item.id,
            daily_price: body.pricing.daily_price,
            weekly_price: body.pricing.weekly_price,
            monthly_price: body.pricing.monthly_price,
            currency: body.pricing.currency || 'PKR',
          });

        if (pricingError) console.error('Pricing insert error:', pricingError);
      }

      // Add availability if provided
      if (body.availability) {
        const { error: availError } = await supabase
          .from('availability')
          .insert({
            item_id: item.id,
            available_from: body.availability.available_from,
            available_to: body.availability.available_to,
            rules: body.availability.rules,
          });

        if (availError) console.error('Availability insert error:', availError);
      }

      console.log('Item created:', item.id);

      return new Response(JSON.stringify({ item }), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // PATCH /api/items/:id - Update item
    if (req.method === 'PATCH' && itemId) {
      const body = await req.json();

      // Update item
      const { data: item, error: itemError } = await supabase
        .from('items')
        .update({
          title: body.title,
          category: body.category,
          description: body.description,
          location: body.location,
          status: body.status,
        })
        .eq('id', itemId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (itemError) throw itemError;

      // Update pricing if provided
      if (body.pricing) {
        await supabase
          .from('pricing')
          .upsert({
            item_id: itemId,
            daily_price: body.pricing.daily_price,
            weekly_price: body.pricing.weekly_price,
            monthly_price: body.pricing.monthly_price,
            currency: body.pricing.currency || 'PKR',
          });
      }

      // Update availability if provided
      if (body.availability) {
        await supabase
          .from('availability')
          .delete()
          .eq('item_id', itemId);

        await supabase
          .from('availability')
          .insert({
            item_id: itemId,
            available_from: body.availability.available_from,
            available_to: body.availability.available_to,
            rules: body.availability.rules,
          });
      }

      console.log('Item updated:', itemId);

      return new Response(JSON.stringify({ item }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // DELETE /api/items/:id - Delete item
    if (req.method === 'DELETE' && itemId) {
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', itemId)
        .eq('user_id', user.id);

      if (error) throw error;

      console.log('Item deleted:', itemId);

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
