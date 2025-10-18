import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Determine intent and query database if needed
    let context = '';
    const messageLower = message.toLowerCase();

    // Check if user is asking about listings
    if (messageLower.includes('listing') || messageLower.includes('rent') || 
        messageLower.includes('available') || messageLower.includes('show me')) {
      
      const { data: listings, error } = await supabase
        .from('listings')
        .select('title, category, location, price, description')
        .eq('available', true)
        .limit(5);

      if (!error && listings && listings.length > 0) {
        context = `\n\nAvailable listings in our database:\n${listings.map((l: any) => 
          `- ${l.title} (${l.category}) in ${l.location} - Rs.${l.price}/day`
        ).join('\n')}`;
      }
    }

    // FAQ responses
    const faqResponses: Record<string, string> = {
      'post listing': 'To post a listing, click on "Add Listing" in the navigation menu, fill in the details about your item, upload photos, set your price, and publish!',
      'contact owner': 'You can contact the listing owner by viewing the listing details page and using the contact information provided there.',
      'how to rent': 'To rent an item, browse available listings, select the one you like, and contact the owner through the listing page.',
      'payment': 'Payment terms are arranged directly between renters and item owners. We recommend discussing payment methods before finalizing any rental.',
      'reviews': 'After renting an item, you can leave a review on the listing page to help other users make informed decisions.'
    };

    // Check for FAQ matches
    let faqMatch = '';
    for (const [key, value] of Object.entries(faqResponses)) {
      if (messageLower.includes(key)) {
        faqMatch = value;
        break;
      }
    }

    const systemPrompt = `You are a helpful assistant for Pak Rent Hub, a rental marketplace platform in Pakistan. 
Help users with questions about:
- Browsing and renting items
- Posting their own listings
- Understanding how the platform works
- General support

Keep responses friendly, concise, and helpful.${context}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: faqMatch || message }
        ],
        temperature: 0.7,
        max_tokens: 250
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      throw new Error('Failed to get response from AI');
    }

    const data = await response.json();
    const botReply = data.choices[0].message.content;

    // Store chat history if user is authenticated
    const authHeader = req.headers.get('authorization');
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      
      if (user) {
        await supabase.from('chats').insert({
          user_id: user.id,
          message,
          response: botReply
        });
      }
    }

    return new Response(JSON.stringify({ reply: botReply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Chat error:', error);
    return new Response(
      JSON.stringify({ 
        reply: "I'm having trouble responding right now. Please try again or contact support." 
      }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});