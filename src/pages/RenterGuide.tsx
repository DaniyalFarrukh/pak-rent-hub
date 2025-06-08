
import { Link } from 'react-router-dom';
import { Key, Upload, Camera, DollarSign, Calendar, Shield, Star, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';

const RenterGuide = () => {
  const steps = [
    {
      icon: Upload,
      title: "Create Your Listing",
      description: "Upload high-quality photos and write a detailed description of your item"
    },
    {
      icon: DollarSign,
      title: "Set Your Price",
      description: "Research similar items and set competitive daily, weekly, or hourly rates"
    },
    {
      icon: Calendar,
      title: "Manage Bookings",
      description: "Accept or decline rental requests and manage your availability calendar"
    },
    {
      icon: TrendingUp,
      title: "Start Earning",
      description: "Get paid securely after each successful rental transaction"
    }
  ];

  const tips = [
    {
      icon: Camera,
      title: "Professional Photos",
      description: "Use good lighting and multiple angles. Items with great photos get 3x more bookings."
    },
    {
      icon: Star,
      title: "Detailed Descriptions",
      description: "Include dimensions, condition, usage instructions, and what's included with the rental."
    },
    {
      icon: Shield,
      title: "Safety First",
      description: "Meet in public places, verify renter identity, and document item condition before/after."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-md shadow-sm border-b sticky top-0 z-30">
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
                <p className="text-xs text-muted-foreground -mt-1">Rental Made Simple</p>
              </div>
            </Link>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link to="/">
                <Button variant="outline">Back to Home</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Renter's Guide</h2>
          <p className="text-xl text-muted-foreground mb-8">Turn your unused items into a steady income stream</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">85%</div>
              <div className="text-muted-foreground">You keep of rental fees</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">₹15k+</div>
              <div className="text-muted-foreground">Average monthly earnings</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
              <div className="text-muted-foreground">Customer support</div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold text-foreground text-center mb-12">How to Start Renting</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <Card key={index} className="text-center relative">
                <CardHeader>
                  <div className="mx-auto mb-4 p-4 bg-blue-100 dark:bg-blue-900 rounded-full w-16 h-16 flex items-center justify-center">
                    <step.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{step.description}</p>
                </CardContent>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 -right-4 w-8 h-0.5 bg-blue-200 dark:bg-blue-800"></div>
                )}
              </Card>
            ))}
          </div>
        </section>

        {/* Success Tips */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold text-foreground text-center mb-12">Tips for Success</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tips.map((tip, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <tip.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <CardTitle>{tip.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{tip.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Popular Categories */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold text-foreground text-center mb-12">Most Profitable Categories</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Vehicles</CardTitle>
                <CardDescription>Cars, motorcycles, bicycles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600 mb-2">₹5,000 - ₹25,000/day</div>
                <p className="text-muted-foreground text-sm">High demand for weekend trips and special occasions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Wedding Items</CardTitle>
                <CardDescription>Dresses, jewelry, decorations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600 mb-2">₹10,000 - ₹50,000/day</div>
                <p className="text-muted-foreground text-sm">Premium pricing for special occasions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Electronics</CardTitle>
                <CardDescription>Cameras, gaming, laptops</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600 mb-2">₹2,000 - ₹15,000/day</div>
                <p className="text-muted-foreground text-sm">Consistent demand from professionals and hobbyists</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Safety Guidelines */}
        <section className="mb-16">
          <Card className="border-2 border-orange-200 dark:border-orange-800">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-6 h-6 text-orange-600" />
                <span>Safety Guidelines</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Before Rental</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Verify renter's identity and ratings</li>
                    <li>• Document item condition with photos</li>
                    <li>• Meet in safe, public locations</li>
                    <li>• Require security deposit for valuable items</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">During & After</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Stay in touch throughout rental period</li>
                    <li>• Inspect item upon return</li>
                    <li>• Report any issues immediately</li>
                    <li>• Leave honest reviews for renters</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-blue-200 dark:border-blue-800">
            <CardContent className="pt-8">
              <h3 className="text-3xl font-bold text-foreground mb-4">Ready to Start Earning?</h3>
              <p className="text-xl text-muted-foreground mb-8">Join thousands of successful renters across Pakistan</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/post-item">
                  <Button size="lg" className="px-8">List Your First Item</Button>
                </Link>
                <Link to="/signup">
                  <Button variant="outline" size="lg" className="px-8">Create Account</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default RenterGuide;
