import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, MapPin, Star, Heart, Calendar, DollarSign, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['All', 'Vehicles', 'Wedding Dresses', 'Electronics', 'Tools & Equipment', 'Event Equipment'];
  const cities = ['All Cities', 'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-30">
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
                <p className="text-xs text-gray-500 -mt-1">Rental Made Simple</p>
              </div>
            </Link>
            
            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search for anything..."
                  className="pl-10 pr-4 h-12 text-lg border-gray-300 focus:border-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <Button 
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="h-12 px-6 border-gray-300"
            >
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </Button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select 
                    className="w-full h-10 px-3 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <select 
                    className="w-full h-10 px-3 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                  >
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range (PKR)</label>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="number" 
                      placeholder="Min"
                      className="w-full h-10 px-3 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                    />
                    <span>-</span>
                    <input 
                      type="number" 
                      placeholder="Max"
                      className="w-full h-10 px-3 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Results */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            {sampleItems.length} rentals available
          </h2>
          <select className="h-10 px-3 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none">
            <option>Sort by: Relevance</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Highest Rated</option>
            <option>Newest First</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sampleItems.map((item) => (
            <Card key={item.id} className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-md overflow-hidden">
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
                <button className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white rounded-full transition-colors">
                  <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
                </button>
              </div>
              
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-blue-600 font-semibold bg-blue-50 px-2 py-1 rounded-full">
                    {item.category}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{item.rating}</span>
                    <span className="text-sm text-gray-500">({item.reviewCount})</span>
                  </div>
                </div>
                <CardTitle className="text-lg leading-tight group-hover:text-blue-600 transition-colors">
                  {item.title}
                </CardTitle>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{item.location}</span>
                  {item.verified && (
                    <span className="text-blue-600 font-semibold">✓ Verified</span>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="w-4 h-4 text-blue-600" />
                      <span className="text-xl font-bold text-gray-900">
                        {item.price.toLocaleString()}
                      </span>
                      <span className="text-gray-600">/{item.priceType}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">by {item.renterName}</p>
                  </div>
                  <Link to={`/item/${item.id}`}>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="px-8">
            Load More Results
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Browse;
