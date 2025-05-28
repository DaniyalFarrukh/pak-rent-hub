
import { useState } from "react";
import { Search, MapPin, Star, Users, Shield, Clock, Car, Shirt, Wrench, Smartphone, Camera, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  const categories = [
    { icon: Car, name: "Vehicles", count: "1,234+" },
    { icon: Shirt, name: "Wedding Dresses", count: "856+" },
    { icon: Wrench, name: "Tools & Equipment", count: "2,145+" },
    { icon: Smartphone, name: "Electronics", count: "987+" },
    { icon: Camera, name: "Photography", count: "456+" },
    { icon: Music, name: "Event Equipment", count: "678+" },
  ];

  const featuredItems = [
    {
      id: 1,
      title: "Toyota Corolla 2022",
      category: "Vehicles",
      location: "Lahore",
      price: "₨3,500",
      period: "per day",
      rating: 4.8,
      reviews: 124,
      image: "https://images.unsplash.com/photo-1549399697-342c2ac1b3de?w=500&h=300&fit=crop",
      verified: true
    },
    {
      id: 2,
      title: "Bridal Lehenga - Designer",
      category: "Wedding Dresses",
      location: "Karachi",
      price: "₨15,000",
      period: "per event",
      rating: 4.9,
      reviews: 89,
      image: "https://images.unsplash.com/photo-1594736797933-d0e6342d2c40?w=500&h=300&fit=crop",
      verified: true
    },
    {
      id: 3,
      title: "Professional Drill Set",
      category: "Tools",
      location: "Islamabad",
      price: "₨800",
      period: "per day",
      rating: 4.7,
      reviews: 56,
      image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=500&h=300&fit=crop",
      verified: false
    },
    {
      id: 4,
      title: "Canon DSLR Camera",
      category: "Photography",
      location: "Lahore",
      price: "₨2,500",
      period: "per day",
      rating: 4.9,
      reviews: 201,
      image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&h=300&fit=crop",
      verified: true
    },
  ];

  const howItWorks = [
    {
      step: "01",
      title: "Browse & Search",
      description: "Find the perfect item from thousands of listings across Pakistan",
      icon: Search
    },
    {
      step: "02",
      title: "Book Securely",
      description: "Choose dates, make payment, and confirm your booking instantly",
      icon: Shield
    },
    {
      step: "03",
      title: "Enjoy & Return",
      description: "Pick up your item, use it, and return it as scheduled",
      icon: Clock
    }
  ];

  const testimonials = [
    {
      name: "Ahmed Khan",
      location: "Lahore",
      rating: 5,
      comment: "Amazing platform! Rented a car for my wedding and the experience was seamless.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Fatima Ali",
      location: "Karachi",
      rating: 5,
      comment: "Found the perfect bridal dress at half the price. Highly recommended!",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Hassan Sheikh",
      location: "Islamabad",
      rating: 5,
      comment: "Professional tools for my construction project. Great quality and fair pricing.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Skip to main content link for screen readers */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-emerald-600 text-white px-4 py-2 rounded-md z-50">
        Skip to main content
      </a>

      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b" role="navigation" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-bold text-emerald-600" role="img" aria-label="RentHub Logo">RentHub</div>
              <div className="hidden md:flex space-x-8" role="menubar">
                <a href="#browse" className="text-gray-700 hover:text-emerald-600 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded-md px-2 py-1" role="menuitem">Browse</a>
                <a href="#how-it-works" className="text-gray-700 hover:text-emerald-600 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded-md px-2 py-1" role="menuitem">How it Works</a>
                <a href="#support" className="text-gray-700 hover:text-emerald-600 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded-md px-2 py-1" role="menuitem">Support</a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="text-gray-700 hover:text-emerald-600 focus:ring-2 focus:ring-emerald-500">
                List Your Item
              </Button>
              <Button variant="outline" className="focus:ring-2 focus:ring-emerald-500">Sign In</Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500">Get Started</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main id="main-content" role="main">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-emerald-50 to-green-100 py-20" aria-labelledby="hero-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 id="hero-heading" className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Rent Anything,<br />
                <span className="text-emerald-600">Anywhere, Anytime</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Pakistan's most trusted rental marketplace. From cars to wedding dresses, 
                find everything you need for any occasion.
              </p>
              
              {/* Search Bar */}
              <div className="bg-white rounded-2xl shadow-xl p-6 max-w-4xl mx-auto" role="search" aria-label="Search for rental items">
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="md:col-span-1">
                    <label htmlFor="category-select" className="sr-only">Select Category</label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger id="category-select" aria-label="Category selection">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vehicles">Vehicles</SelectItem>
                        <SelectItem value="dresses">Wedding Dresses</SelectItem>
                        <SelectItem value="tools">Tools & Equipment</SelectItem>
                        <SelectItem value="electronics">Electronics</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-1">
                    <label htmlFor="location-select" className="sr-only">Select Location</label>
                    <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                      <SelectTrigger id="location-select" aria-label="Location selection">
                        <MapPin className="w-4 h-4" aria-hidden="true" />
                        <SelectValue placeholder="Location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lahore">Lahore</SelectItem>
                        <SelectItem value="karachi">Karachi</SelectItem>
                        <SelectItem value="islamabad">Islamabad</SelectItem>
                        <SelectItem value="rawalpindi">Rawalpindi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-1">
                    <label htmlFor="search-input" className="sr-only">Search for items</label>
                    <Input 
                      id="search-input"
                      placeholder="What are you looking for?"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      aria-label="Search for rental items"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500" aria-label="Search for items">
                      <Search className="w-4 h-4 mr-2" aria-hidden="true" />
                      Search
                    </Button>
                  </div>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8" role="region" aria-label="Platform statistics">
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600" aria-label="10,000 plus active listings">10K+</div>
                  <div className="text-gray-600">Active Listings</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600" aria-label="50,000 plus happy customers">50K+</div>
                  <div className="text-gray-600">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600" aria-label="99 percent success rate">99%</div>
                  <div className="text-gray-600">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600" aria-label="24/7 support available">24/7</div>
                  <div className="text-gray-600">Support</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section id="browse" className="py-20 bg-white" aria-labelledby="categories-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 id="categories-heading" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Browse by Category
              </h2>
              <p className="text-xl text-gray-600">
                Discover thousands of items across various categories
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6" role="list" aria-label="Item categories">
              {categories.map((category, index) => (
                <Card key={index} className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 focus-within:ring-2 focus-within:ring-emerald-500" role="listitem">
                  <CardContent className="p-6 text-center">
                    <button className="w-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-inset rounded-md" aria-label={`Browse ${category.name} with ${category.count} items`}>
                      <category.icon className="w-8 h-8 mx-auto mb-4 text-emerald-600 group-hover:scale-110 transition-transform" aria-hidden="true" />
                      <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
                      <p className="text-sm text-gray-600">{category.count}</p>
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20 bg-gray-50" aria-labelledby="how-it-works-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 id="how-it-works-heading" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                How It Works
              </h2>
              <p className="text-xl text-gray-600">
                Rent anything in just 3 simple steps
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8" role="list" aria-label="How the rental process works">
              {howItWorks.map((step, index) => (
                <div key={index} className="text-center" role="listitem">
                  <div className="bg-emerald-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold" aria-label={`Step ${step.step}`}>
                    {step.step}
                  </div>
                  <step.icon className="w-12 h-12 mx-auto mb-4 text-emerald-600" aria-hidden="true" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Listings */}
        <section className="py-20 bg-white" aria-labelledby="featured-listings-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 id="featured-listings-heading" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Featured Listings
              </h2>
              <p className="text-xl text-gray-600">
                Discover the most popular items in your area
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6" role="list" aria-label="Featured rental items">
              {featuredItems.map((item) => (
                <Card key={item.id} className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500" role="listitem">
                  <div className="relative">
                    <img 
                      src={item.image} 
                      alt={`${item.title} - ${item.category} for rent in ${item.location}`}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {item.verified && (
                      <Badge className="absolute top-3 left-3 bg-emerald-600" aria-label="Verified listing">
                        <Shield className="w-3 h-3 mr-1" aria-hidden="true" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">{item.category}</Badge>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="w-3 h-3 mr-1" aria-hidden="true" />
                        <span aria-label={`Located in ${item.location}`}>{item.location}</span>
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" aria-hidden="true" />
                        <span className="text-sm font-medium ml-1" aria-label={`Rating: ${item.rating} out of 5`}>{item.rating}</span>
                        <span className="text-sm text-gray-500 ml-1" aria-label={`Based on ${item.reviews} reviews`}>({item.reviews})</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold text-gray-900" aria-label={`Price: ${item.price} ${item.period}`}>{item.price}</span>
                        <span className="text-sm text-gray-500 ml-1">{item.period}</span>
                      </div>
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500" aria-label={`Book ${item.title} now`}>
                        Book Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-emerald-50" aria-labelledby="testimonials-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 id="testimonials-heading" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                What Our Users Say
              </h2>
              <p className="text-xl text-gray-600">
                Join thousands of satisfied customers across Pakistan
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8" role="list" aria-label="Customer testimonials">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="bg-white" role="listitem">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4" aria-label={`${testimonial.rating} star rating`}>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" aria-hidden="true" />
                      ))}
                    </div>
                    <blockquote className="text-gray-600 mb-6">"{testimonial.comment}"</blockquote>
                    <div className="flex items-center">
                      <img 
                        src={testimonial.avatar} 
                        alt={`Profile photo of ${testimonial.name}`}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div>
                        <div className="font-semibold text-gray-900">{testimonial.name}</div>
                        <div className="text-sm text-gray-500">{testimonial.location}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-emerald-600" aria-labelledby="cta-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 id="cta-heading" className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Renting?
            </h2>
            <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
              Join Pakistan's largest rental community and discover amazing items near you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-emerald-600">
                <Users className="w-5 h-5 mr-2" aria-hidden="true" />
                Sign Up as Customer
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-emerald-600 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-emerald-600">
                List Your Items
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16" role="contentinfo" aria-label="Site footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold text-emerald-400 mb-4" role="img" aria-label="RentHub Footer Logo">RentHub</div>
              <p className="text-gray-400 mb-4">
                Pakistan's premier rental marketplace connecting renters with customers nationwide.
              </p>
              <div className="flex space-x-4">
                <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white focus:ring-2 focus:ring-emerald-500">
                  Download App
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Categories</h3>
              <nav aria-label="Footer categories navigation">
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-md">Vehicles</a></li>
                  <li><a href="#" className="hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-md">Wedding Dresses</a></li>
                  <li><a href="#" className="hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-md">Tools & Equipment</a></li>
                  <li><a href="#" className="hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-md">Electronics</a></li>
                </ul>
              </nav>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <nav aria-label="Footer support navigation">
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-md">Help Center</a></li>
                  <li><a href="#" className="hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-md">Safety Guidelines</a></li>
                  <li><a href="#" className="hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-md">Terms of Service</a></li>
                  <li><a href="#" className="hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-md">Privacy Policy</a></li>
                </ul>
              </nav>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <nav aria-label="Footer company navigation">
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-md">About Us</a></li>
                  <li><a href="#" className="hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-md">Careers</a></li>
                  <li><a href="#" className="hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-md">Press</a></li>
                  <li><a href="#" className="hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-md">Contact</a></li>
                </ul>
              </nav>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© 2024 RentHub. All rights reserved.</p>
            <nav className="flex space-x-6 mt-4 md:mt-0" aria-label="Footer legal navigation">
              <a href="#" className="text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-md">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-md">Terms</a>
              <a href="#" className="text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-md">Security</a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
