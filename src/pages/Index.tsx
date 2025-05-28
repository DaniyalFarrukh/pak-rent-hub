import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Car, Shirt, Wrench, Laptop, Camera, Star, Users, Shield, Clock, ChevronRight, Menu, X, MapPin, Calendar, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Category {
  name: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  description: string;
}

const categories: Category[] = [
  { name: 'Vehicles', icon: Car, description: 'Cars, motorcycles, and more' },
  { name: 'Clothing', icon: Shirt, description: 'Dresses, suits, and accessories' },
  { name: 'Tools', icon: Wrench, description: 'Drills, saws, and toolsets' },
  { name: 'Electronics', icon: Laptop, description: 'Laptops, tablets, and gadgets' },
  { name: 'Photography', icon: Camera, description: 'Cameras, lenses, and equipment' },
];

interface Testimonial {
  name: string;
  text: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  { name: 'Aisha Khan', text: 'PakRent made renting a car so easy and affordable. Highly recommended!', rating: 5 },
  { name: 'Imran Ali', text: 'I rented a camera for my cousin wedding and the quality was amazing. Great service!', rating: 4 },
];

const Index = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-green-600">PakRent</h1>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#categories" className="text-gray-700 hover:text-green-600 font-medium">Categories</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-green-600 font-medium">How it Works</a>
              <a href="#contact" className="text-gray-700 hover:text-green-600 font-medium">Contact</a>
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-green-600 font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  to="/signup" 
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Sign Up
                </Link>
              </div>
            </div>
            <div className="md:hidden">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-700 hover:text-green-600"
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
              <a href="#categories" className="block px-3 py-2 text-gray-700 hover:text-green-600 font-medium">Categories</a>
              <a href="#how-it-works" className="block px-3 py-2 text-gray-700 hover:text-green-600 font-medium">How it Works</a>
              <a href="#contact" className="block px-3 py-2 text-gray-700 hover:text-green-600 font-medium">Contact</a>
              <div className="border-t pt-4 mt-4">
                <Link 
                  to="/login" 
                  className="block px-3 py-2 text-gray-700 hover:text-green-600 font-medium"
                >
                  Sign In
                </Link>
                <Link 
                  to="/signup" 
                  className="block mx-3 mt-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium text-center"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-emerald-100 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-extrabold text-green-700 mb-4">
            Find the Best Rentals in Pakistan
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Discover a wide range of items to rent, from vehicles to electronics, all in one place.
          </p>
          <div className="max-w-md mx-auto">
            <Input type="text" placeholder="Search for rentals" className="rounded-full h-12" />
            <Button className="ml-4 rounded-full h-12">
              <Search className="w-5 h-5 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-semibold text-green-700 mb-8 text-center">
            Explore Rental Categories
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                <category.icon className="w-8 h-8 text-green-500 mb-4" />
                <h4 className="text-xl font-semibold text-gray-800 mb-2">{category.name}</h4>
                <p className="text-gray-600">{category.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-semibold text-green-700 mb-8 text-center">
            How PakRent Works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <Clock className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-800 mb-2">Browse and Select</h4>
              <p className="text-gray-600">Find the item you need from our extensive catalog.</p>
            </div>
            {/* Step 2 */}
            <div className="text-center">
              <Calendar className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-800 mb-2">Book and Reserve</h4>
              <p className="text-gray-600">Choose your rental dates and make a reservation.</p>
            </div>
            {/* Step 3 */}
            <div className="text-center">
              <DollarSign className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-800 mb-2">Rent and Enjoy</h4>
              <p className="text-gray-600">Pick up your item and enjoy your rental experience.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-semibold text-green-700 mb-8 text-center">
            What Our Customers Say
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 italic mb-4">"{testimonial.text}"</p>
                <p className="text-gray-800 font-semibold">- {testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-gradient-to-br from-emerald-100 to-green-50 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-semibold text-green-700 mb-8">
            Contact Us
          </h3>
          <p className="text-xl text-gray-600 mb-8">
            Have questions or need assistance? Reach out to our support team.
          </p>
          <Button className="bg-green-600 hover:bg-green-700 text-white rounded-full px-8 py-3">
            Get in Touch
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600">
            &copy; {new Date().getFullYear()} PakRent. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
