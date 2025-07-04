import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, Calendar, Shield, MessageCircle, Heart, Share2, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { MapDisplay } from '@/components/MapDisplay';

const ItemDetail = () => {
  const { id } = useParams();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [rentalDays, setRentalDays] = useState(1);

  // Sample data - in real app, fetch based on id
  const item = {
    id: '1',
    title: 'Toyota Corolla 2020 - Perfect for City Tours',
    description: 'Well-maintained Toyota Corolla 2020 in excellent condition. Perfect for city tours, family trips, or business meetings. Features include air conditioning, power steering, automatic transmission, and GPS navigation. The car is regularly serviced and cleaned after each rental.',
    price: 8500,
    priceType: 'day',
    rating: 4.8,
    reviewCount: 23,
    location: 'Lahore, Punjab',
    coordinates: { lat: 31.5204, lng: 74.3587 }, // Lahore coordinates
    category: 'Vehicles',
    images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
    renterName: 'Ahmad Ali',
    renterRating: 4.9,
    renterReviews: 156,
    verified: true,
    joinedDate: 'March 2023',
    responseTime: 'Within 1 hour',
    features: ['Air Conditioning', 'GPS Navigation', 'Automatic', 'Bluetooth', 'USB Charging'],
    rules: [
      'No smoking in the vehicle',
      'Return with same fuel level',
      'Maximum 200km per day included',
      'Additional driver fee: PKR 500/day'
    ],
    unavailableDates: [
      new Date(2024, 11, 25),
      new Date(2024, 11, 26),
      new Date(2024, 11, 31),
      new Date(2025, 0, 1)
    ]
  };

  const totalPrice = item.price * rentalDays;
  const serviceFee = Math.round(totalPrice * 0.05);
  const finalTotal = totalPrice + serviceFee;

  const reviews = [
    {
      id: '1',
      userName: 'Sarah Khan',
      rating: 5,
      date: '2 weeks ago',
      comment: 'Excellent car and very responsive owner. The car was exactly as described and Ahmad was very helpful throughout the rental process.',
      verified: true
    },
    {
      id: '2',
      userName: 'Hassan Ali',
      rating: 4,
      date: '1 month ago',
      comment: 'Good experience overall. Car was clean and well-maintained. Would recommend for city trips.',
      verified: true
    }
  ];

  const mapMarkers = [
    {
      position: item.coordinates,
      title: item.title,
      info: `<div class="p-2"><h3 class="font-semibold">${item.title}</h3><p class="text-sm text-gray-600">${item.location}</p></div>`
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/browse" className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Browse</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                <Heart className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2">
            {/* Image Carousel */}
            <div className="relative mb-8">
              <div className="aspect-video rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img 
                  src={item.images[currentImageIndex]} 
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Thumbnail Navigation */}
              <div className="flex space-x-2 mt-4 overflow-x-auto">
                {item.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      currentImageIndex === index ? 'border-green-500' : 'border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    <img src={image} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              {/* Photo Count */}
              <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1">
                <Camera className="w-4 h-4" />
                <span>{item.images.length} photos</span>
              </div>
            </div>

            {/* Title and Basic Info */}
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <span className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-3 py-1 rounded-full text-sm font-semibold">
                  {item.category}
                </span>
                {item.verified && (
                  <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                    <Shield className="w-3 h-3" />
                    <span>Verified</span>
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">{item.title}</h1>
              
              <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-semibold">{item.rating}</span>
                  <span>({item.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="w-5 h-5" />
                  <span>{item.location}</span>
                </div>
              </div>
            </div>

            {/* Location Map */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="dark:text-white">Location</CardTitle>
                <CardDescription className="dark:text-gray-400">Where you'll find this item</CardDescription>
              </CardHeader>
              <CardContent>
                <MapDisplay
                  center={item.coordinates}
                  zoom={13}
                  markers={mapMarkers}
                  className="mb-4"
                  height="300px"
                />
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Exact location will be provided after booking confirmation
                </p>
              </CardContent>
            </Card>

            {/* Description */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="dark:text-white">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{item.description}</p>
              </CardContent>
            </Card>

            {/* Features */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="dark:text-white">What's Included</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {item.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Rules */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="dark:text-white">Rental Rules</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {item.rules.map((rule, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span className="text-gray-700 dark:text-gray-300">{rule}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle className="dark:text-white">Reviews ({item.reviewCount})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 dark:border-gray-700 last:border-0 pb-4 last:pb-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                            <span className="text-gray-600 dark:text-gray-300 font-semibold">
                              {review.userName.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">{review.userName}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{review.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${
                                i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'
                              }`} 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Booking Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="shadow-xl border-2 dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        PKR {item.price.toLocaleString()}
                        <span className="text-lg font-normal text-gray-600 dark:text-gray-400"> /{item.priceType}</span>
                      </p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="font-semibold dark:text-white">{item.rating}</span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Calendar */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Select Dates
                    </label>
                    <CalendarComponent
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => 
                        date < new Date() || 
                        item.unavailableDates.some(unavailable => 
                          date.getTime() === unavailable.getTime()
                        )
                      }
                      className="rounded-lg border dark:border-gray-600 dark:bg-gray-700"
                    />
                  </div>

                  {/* Rental Duration */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Rental Duration (days)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={rentalDays}
                      onChange={(e) => setRentalDays(parseInt(e.target.value) || 1)}
                      className="w-full h-12 px-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-green-500 focus:outline-none dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  {/* Price Breakdown */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between dark:text-white">
                      <span>PKR {item.price.toLocaleString()} × {rentalDays} days</span>
                      <span>PKR {totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between dark:text-white">
                      <span>Service fee</span>
                      <span>PKR {serviceFee.toLocaleString()}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold text-lg dark:text-white">
                      <span>Total</span>
                      <span>PKR {finalTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button className="w-full h-12 bg-green-600 hover:bg-green-700 text-lg font-semibold">
                      Reserve Now
                    </Button>
                    
                    <Button variant="outline" className="w-full h-12 text-lg dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Message Renter
                    </Button>
                  </div>

                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    You won't be charged yet
                  </p>
                </CardContent>
              </Card>

              {/* Renter Info */}
              <Card className="mt-6 dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="dark:text-white">Meet your Renter</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 dark:text-gray-300 font-bold text-xl">
                        {item.renterName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">{item.renterName}</h3>
                      <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span>{item.renterRating} ({item.renterReviews} reviews)</span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Joined {item.joinedDate}</p>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <p>Response time: {item.responseTime}</p>
                    {item.verified && (
                      <p className="text-green-600 dark:text-green-400 font-semibold">✓ Identity verified</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
