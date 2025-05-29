
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Car, Shirt, Wrench, Laptop, Camera, Star, Users, Shield, Clock, ChevronRight, Menu, X, MapPin, Calendar, DollarSign, Award, CheckCircle, TrendingUp, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ChatBot from '@/components/ChatBot';

interface Category {
  name: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  description: string;
  itemCount: number;
}

const categories: Category[] = [
  { name: 'Vehicles', icon: Car, description: 'Cars, motorcycles, bikes', itemCount: 1200 },
  { name: 'Wedding Dresses', icon: Shirt, description: 'Bridal wear, formal dresses', itemCount: 850 },
  { name: 'Tools & Equipment', icon: Wrench, description: 'Power tools, construction gear', itemCount: 650 },
  { name: 'Electronics', icon: Laptop, description: 'Laptops, gaming, cameras', itemCount: 950 },
  { name: 'Event Equipment', icon: Camera, description: 'Photography, sound systems', itemCount: 450 },
];

interface Testimonial {
  name: string;
  text: string;
  rating: number;
  location: string;
  category: string;
}

const testimonials: Testimonial[] = [
  { 
    name: 'Aisha Khan', 
    text: 'Rented a beautiful bridal dress for my sister\'s wedding. The quality was amazing and saved us thousands!', 
    rating: 5,
    location: 'Lahore',
    category: 'Wedding Dress'
  },
  { 
    name: 'Ahmed Ali', 
    text: 'Perfect car rental service for my family trip to Murree. Clean vehicle and honest pricing.', 
    rating: 5,
    location: 'Islamabad',
    category: 'Vehicle'
  },
  { 
    name: 'Fatima Sheikh', 
    text: 'Needed professional camera equipment for my photography business. Great selection and fair rates.', 
    rating: 4,
    location: 'Karachi',
    category: 'Photography'
  },
];

const trustFeatures = [
  { icon: Shield, title: 'Verified Renters', description: 'All renters verified with CNIC and background checks' },
  { icon: DollarSign, title: 'Secure Payments', description: 'Escrow system with multiple payment options' },
  { icon: Clock, title: '24/7 Support', description: 'Customer service available around the clock' },
  { icon: CheckCircle, title: 'Quality Guarantee', description: 'All items quality-checked before listing' },
];

const Index = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  const handleSearch = () => {
    console.log('Searching for:', searchQuery, 'in', selectedLocation);
    // Redirect to browse page with search params
    window.location.href = `/browse?q=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(selectedLocation)}`;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-lg border-b sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transform rotate-12">
                    <Key className="w-6 h-6 text-white transform -rotate-12" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
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
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/browse" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Browse</Link>
              <Link to="/post-item" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">List Your Item</Link>
              <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 font-medium">How it Works</a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 font-medium">Support</a>
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  to="/signup" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  Join Now
                </Link>
              </div>
            </div>
            <div className="md:hidden">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-700 hover:text-blue-600"
                aria-label="Toggle mobile menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link to="/browse" className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium">Browse</Link>
              <Link to="/post-item" className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium">List Your Item</Link>
              <a href="#how-it-works" className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium">How it Works</a>
              <a href="#contact" className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium">Support</a>
              <div className="border-t pt-4 mt-4 space-y-2">
                <Link 
                  to="/login" 
                  className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium"
                >
                  Sign In
                </Link>
                <Link 
                  to="/signup" 
                  className="block mx-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium text-center"
                >
                  Join Now
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-6xl font-extrabold text-gray-900 mb-6">
              Rent Anything, <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Effortlessly</span>
            </h2>
            <p className="text-xl lg:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Pakistan's most trusted rental marketplace. From cars to wedding dresses, find everything you need without buying.
            </p>
            
            {/* Enhanced Search Bar */}
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6 border">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <Input 
                    type="text" 
                    placeholder="What do you want to rent?" 
                    className="h-14 text-lg border-gray-300 focus:border-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div>
                  <select 
                    className="w-full h-14 px-4 border border-gray-300 rounded-lg text-lg focus:border-blue-500 focus:outline-none"
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                  >
                    <option value="">Select City</option>
                    <option value="karachi">Karachi</option>
                    <option value="lahore">Lahore</option>
                    <option value="islamabad">Islamabad</option>
                    <option value="rawalpindi">Rawalpindi</option>
                    <option value="faisalabad">Faisalabad</option>
                  </select>
                </div>
                <div>
                  <Button 
                    className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg font-semibold shadow-lg"
                    onClick={handleSearch}
                  >
                    <Search className="w-6 h-6 mr-2" />
                    Search
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">50K+</div>
                <div className="text-gray-600">Active Listings</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">25K+</div>
                <div className="text-gray-600">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">15+</div>
                <div className="text-gray-600">Cities Covered</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">4.8★</div>
                <div className="text-gray-600">Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section id="categories" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">
              Explore Rental Categories
            </h3>
            <p className="text-xl text-gray-600">From everyday essentials to special occasions</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {categories.map((category, index) => (
              <Link to={`/browse?category=${encodeURIComponent(category.name)}`} key={index}>
                <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-blue-200">
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4 p-4 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                      <category.icon className="w-8 h-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl text-gray-900">{category.name}</CardTitle>
                    <CardDescription className="text-gray-600">{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-sm text-blue-600 font-semibold">{category.itemCount}+ items available</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Security Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Easy Lease?
            </h3>
            <p className="text-xl text-gray-600">Your safety and satisfaction are our top priorities</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {trustFeatures.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="mx-auto mb-6 p-4 bg-white rounded-full shadow-lg group-hover:shadow-xl transition-shadow">
                  <feature.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h4>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">
              How Easy Lease Works
            </h3>
            <p className="text-xl text-gray-600">Simple, secure, and hassle-free rental process</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center relative">
              <div className="mx-auto mb-6 p-4 bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center">
                <Search className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">1. Browse & Search</h4>
              <p className="text-gray-600">Find the perfect item from thousands of verified listings across Pakistan</p>
              {/* Connection line */}
              <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-blue-200 -translate-x-8"></div>
            </div>
            <div className="text-center relative">
              <div className="mx-auto mb-6 p-4 bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center">
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">2. Book & Reserve</h4>
              <p className="text-gray-600">Choose your dates, confirm availability, and secure your rental</p>
              <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-blue-200 -translate-x-8"></div>
            </div>
            <div className="text-center relative">
              <div className="mx-auto mb-6 p-4 bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center">
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">3. Pay Securely</h4>
              <p className="text-gray-600">Multiple payment options with escrow protection for your peace of mind</p>
              <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-blue-200 -translate-x-8"></div>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-6 p-4 bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center">
                <Star className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">4. Enjoy & Review</h4>
              <p className="text-gray-600">Use your rental and share your experience to help others</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h3>
            <p className="text-xl text-gray-600">Real stories from real customers across Pakistan</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-green-600 font-medium">{testimonial.category}</span>
                  </div>
                  <p className="text-gray-700 italic mb-4">"{testimonial.text}"</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <p className="text-gray-900 font-semibold">— {testimonial.name}</p>
                    <div className="flex items-center text-gray-500 text-sm">
                      <MapPin className="w-4 h-4 mr-1" />
                      {testimonial.location}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section for Renters */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <TrendingUp className="w-16 h-16 text-white" />
          </div>
          <h3 className="text-4xl font-bold text-white mb-6">
            Start Earning with Your Items
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            Turn your unused items into a steady income stream. Join thousands of verified renters across Pakistan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
                Become a Renter
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-4xl font-bold text-gray-900 mb-6">
            Need Help? We're Here for You
          </h3>
          <p className="text-xl text-gray-600 mb-8">
            Our customer support team is available 24/7 to assist you with any questions or concerns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-blue-600 hover:bg-blue-700 px-8 py-4 text-lg">
              Chat with Support
            </Button>
            <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg">
              Call +92-300-EASYLEASE
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="relative">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center transform rotate-12">
                    <Key className="w-5 h-5 text-white transform -rotate-12" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">R</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold">Easy Lease</h3>
              </div>
              <p className="text-gray-400 mb-4">Pakistan's trusted rental marketplace connecting renters and customers nationwide.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">For Customers</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/browse" className="hover:text-white transition-colors">Browse Items</Link></li>
                <li><Link to="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
                <li><Link to="/safety" className="hover:text-white transition-colors">Safety Center</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">For Renters</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/list-item" className="hover:text-white transition-colors">List Your Item</Link></li>
                <li><Link to="/renter-guide" className="hover:text-white transition-colors">Renter Guide</Link></li>
                <li><Link to="/verification" className="hover:text-white transition-colors">Get Verified</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#contact" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Easy Lease. All rights reserved. Made with ❤️ in Pakistan.</p>
          </div>
        </div>
      </footer>

      {/* ChatBot Component */}
      <ChatBot />
    </div>
  );
};

export default Index;
