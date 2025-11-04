
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Search, Filter, MapPin, Star, Heart, Calendar, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LocationInput } from '@/components/LocationInput';
import { ThemeToggle } from '@/components/ThemeToggle';

interface RentalItem {
  id: string;
  title: string;
  price: number;
  priceType: 'day' | 'hour' | 'week';
  rating: number;
  reviewCount: number;
  location: string;
  category: string;
  image: string;
  renterName: string;
  verified: boolean;
  featured: boolean;
}

const Browse = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  const [listings, setListings] = useState<RentalItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('available', true);
      
      if (error) throw error;
      
      const formattedListings: RentalItem[] = (data || []).map(listing => ({
        id: listing.id.toString(),
        title: listing.title,
        price: listing.price || 0,
        priceType: 'day',
        rating: listing.rating || 0,
        reviewCount: 0,
        location: listing.location || '',
        category: listing.category || 'Others',
        image: listing.photos?.[0] || '/placeholder.svg',
        renterName: 'Owner',
        verified: true,
        featured: false
      }));
      
      setListings(formattedListings);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', 'Vehicles', 'Wedding Dresses', 'Electronics', 'Tools & Equipment', 'Event Equipment'];

  const handleLocationFilter = (value: string, placeData?: google.maps.places.PlaceResult) => {
    setSelectedLocation(value);
    console.log('Location filter:', value, placeData);
  };

  const handleLike = (itemId: string) => {
    setLikedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  // Filter items based on search query, category, and location
  const filteredItems = listings.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesLocation = !selectedLocation || 
                           item.location.toLowerCase().includes(selectedLocation.toLowerCase());
    
    return matchesSearch && matchesCategory && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transform rotate-12">
                  <Key className="w-5 h-5 text-white transform -rotate-12" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full flex items-center justify-center">
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
            
            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search for anything..."
                  className="pl-10 pr-4 h-12 text-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button 
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="h-12 px-6 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </Button>
              <ThemeToggle />
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                  <select 
                    className="w-full h-10 px-3 border border-gray-300 dark:border-gray-600 rounded-md focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <LocationInput
                    label="Location"
                    placeholder="Filter by city..."
                    value={selectedLocation}
                    onChange={handleLocationFilter}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Results */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {filteredItems.length} rentals available
          </h2>
          <select className="h-10 px-3 border border-gray-300 dark:border-gray-600 rounded-md focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <option>Sort by: Relevance</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Highest Rated</option>
            <option>Newest First</option>
          </select>
        </div>

        {/* Loading and No results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-600 dark:text-gray-400 text-lg">Loading listings...</div>
          </div>
        ) : filteredItems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-600 dark:text-gray-400 text-lg mb-2">No rentals found</div>
            <p className="text-gray-500 dark:text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="group hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <div className="relative">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {item.featured && (
                  <span className="absolute top-3 left-3 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    Featured
                  </span>
                )}
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleLike(item.id);
                  }}
                  className="absolute top-3 right-3 p-2 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 rounded-full transition-all duration-200 hover:scale-110"
                >
                  <Heart 
                    className={`w-4 h-4 transition-colors duration-200 ${
                      likedItems.has(item.id) 
                        ? 'text-red-500 fill-red-500' 
                        : 'text-gray-600 dark:text-gray-400 hover:text-red-500'
                    }`} 
                  />
                </button>
              </div>
              
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-full">
                    {item.category}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{item.rating}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">({item.reviewCount})</span>
                  </div>
                </div>
                <CardTitle className="text-lg leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-gray-900 dark:text-white">
                  {item.title}
                </CardTitle>
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>{item.location}</span>
                  {item.verified && (
                    <span className="text-blue-600 dark:text-blue-400 font-semibold">✓ Verified</span>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-1">
                      <span className="text-xl font-bold text-gray-900 dark:text-white">
                        PKR {item.price.toLocaleString()}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">/{item.priceType}</span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">by {item.renterName}</p>
                  </div>
                  <Link to={`/item/${item.id}`}>
                    <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        {filteredItems.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="px-8 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
              Load More Results
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Browse;
