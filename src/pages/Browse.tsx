
import { useState } from 'react';
import { Link } from 'react-router-dom';
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

const sampleItems: RentalItem[] = [
  {
    id: '1',
    title: 'Toyota Corolla 2020 - Perfect for City Tours',
    price: 8500,
    priceType: 'day',
    rating: 4.8,
    reviewCount: 23,
    location: 'Lahore, Punjab',
    category: 'Vehicles',
    image: '/placeholder.svg',
    renterName: 'Ahmad Ali',
    verified: true,
    featured: true
  },
  {
    id: '2',
    title: 'Designer Bridal Lehenga - Red & Gold',
    price: 25000,
    priceType: 'day',
    rating: 4.9,
    reviewCount: 45,
    location: 'Karachi, Sindh',
    category: 'Wedding Dresses',
    image: '/placeholder.svg',
    renterName: 'Fatima Wedding Collection',
    verified: true,
    featured: false
  },
  {
    id: '3',
    title: 'Professional DSLR Camera Canon 5D',
    price: 4500,
    priceType: 'day',
    rating: 4.7,
    reviewCount: 18,
    location: 'Islamabad, ICT',
    category: 'Electronics',
    image: '/placeholder.svg',
    renterName: 'Photo Pro Rentals',
    verified: true,
    featured: true
  }
];

const Browse = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['All', 'Vehicles', 'Wedding Dresses', 'Electronics', 'Tools & Equipment', 'Event Equipment'];

  const handleLocationFilter = (value: string, placeData?: google.maps.places.PlaceResult) => {
    setSelectedLocation(value);
    console.log('Location filter:', value, placeData);
  };

  // Filter items based on search query, category, and location
  const filteredItems = sampleItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesLocation = !selectedLocation || 
                           item.location.toLowerCase().includes(selectedLocation.toLowerCase());
    
    return matchesSearch && matchesCategory && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg transform rotate-12">
                  <Key className="w-5 h-5 text-primary-foreground transform -rotate-12" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full flex items-center justify-center">
                  <span className="text-accent-foreground text-xs font-bold">R</span>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  Easy Lease
                </h1>
                <p className="text-xs text-muted-foreground -mt-1">Rental Made Simple</p>
              </div>
            </Link>
            
            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search for anything..."
                  className="pl-10 pr-4 h-12 text-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button 
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="h-12 px-6"
              >
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </Button>
              <ThemeToggle />
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Category</label>
                  <select 
                    className="w-full h-10 px-3 border border-input rounded-md focus:border-ring focus:outline-none bg-background text-foreground"
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
          <h2 className="text-2xl font-bold text-foreground">
            {filteredItems.length} rentals available
          </h2>
          <select className="h-10 px-3 border border-input rounded-md focus:border-ring focus:outline-none bg-background text-foreground">
            <option>Sort by: Relevance</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Highest Rated</option>
            <option>Newest First</option>
          </select>
        </div>

        {/* No results message */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground text-lg mb-2">No rentals found</div>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="group hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden">
              <div className="relative">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {item.featured && (
                  <span className="absolute top-3 left-3 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-semibold">
                    Featured
                  </span>
                )}
                <button className="absolute top-3 right-3 p-2 bg-background/80 hover:bg-background rounded-full transition-colors">
                  <Heart className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                </button>
              </div>
              
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-primary font-semibold bg-primary/10 px-2 py-1 rounded-full">
                    {item.category}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-foreground">{item.rating}</span>
                    <span className="text-sm text-muted-foreground">({item.reviewCount})</span>
                  </div>
                </div>
                <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                  {item.title}
                </CardTitle>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{item.location}</span>
                  {item.verified && (
                    <span className="text-primary font-semibold">✓ Verified</span>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-1">
                      <span className="text-xl font-bold text-foreground">
                        PKR {item.price.toLocaleString()}
                      </span>
                      <span className="text-muted-foreground">/{item.priceType}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">by {item.renterName}</p>
                  </div>
                  <Link to={`/item/${item.id}`}>
                    <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
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
            <Button variant="outline" size="lg" className="px-8">
              Load More Results
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Browse;
