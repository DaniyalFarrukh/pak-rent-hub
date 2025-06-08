
import { Link } from 'react-router-dom';
import { Key, Search, Calendar, DollarSign, Star, Shield, Users, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';

const HowItWorks = () => {
  const customerSteps = [
    {
      icon: Search,
      title: "Browse & Search",
      description: "Find the perfect item from thousands of verified listings across Pakistan",
      details: "Use our smart search filters to find exactly what you need by category, location, price range, and availability dates."
    },
    {
      icon: Calendar,
      title: "Book & Reserve",
      description: "Choose your dates, confirm availability, and secure your rental",
      details: "Select your rental period, review the terms, and submit your booking request. Most renters respond within 2 hours."
    },
    {
      icon: DollarSign,
      title: "Pay Securely",
      description: "Multiple payment options with escrow protection for your peace of mind",
      details: "Pay safely through our platform with credit cards, bank transfers, or mobile wallets. Your payment is protected until pickup."
    },
    {
      icon: Star,
      title: "Enjoy & Review",
      description: "Use your rental and share your experience to help others",
      details: "Pick up your item, enjoy your rental period, return it on time, and leave a review for the next customer."
    }
  ];

  const renterSteps = [
    {
      icon: Users,
      title: "List Your Item",
      description: "Upload photos, write descriptions, and set your rental rates",
      details: "Create compelling listings with high-quality photos and detailed descriptions to attract more customers."
    },
    {
      icon: Calendar,
      title: "Manage Bookings",
      description: "Accept requests, coordinate pickup/delivery, and track rentals",
      details: "Use our dashboard to manage your calendar, communicate with customers, and track your earnings."
    },
    {
      icon: Shield,
      title: "Stay Protected",
      description: "All rentals are covered by our comprehensive insurance policy",
      details: "Your items are protected against damage, theft, or loss during the rental period with our insurance coverage."
    },
    {
      icon: DollarSign,
      title: "Get Paid",
      description: "Receive payments automatically after each successful rental",
      details: "Payments are transferred to your bank account within 24 hours after the rental period ends."
    }
  ];

  const features = [
    {
      icon: Shield,
      title: "Verified Users",
      description: "All users verified with CNIC and background checks for maximum safety"
    },
    {
      icon: DollarSign,
      title: "Secure Payments",
      description: "Escrow system protects both renters and customers with guaranteed payments"
    },
    {
      icon: CheckCircle,
      title: "Insurance Coverage",
      description: "Comprehensive insurance protects against damage, theft, and disputes"
    },
    {
      icon: Users,
      title: "24/7 Support",
      description: "Round-the-clock customer service to help resolve any issues quickly"
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
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">How Easy Lease Works</h2>
          <p className="text-xl text-muted-foreground">Simple, secure, and hassle-free rental process</p>
        </div>

        {/* For Customers */}
        <section className="mb-20">
          <h3 className="text-3xl font-bold text-foreground text-center mb-12">For Customers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {customerSteps.map((step, index) => (
              <Card key={index} className="text-center relative group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto mb-4 p-4 bg-blue-100 dark:bg-blue-900 rounded-full w-16 h-16 flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                    <step.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                  <CardDescription>{step.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{step.details}</p>
                </CardContent>
                {index < customerSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 -right-4 w-8 h-0.5 bg-blue-200 dark:bg-blue-800"></div>
                )}
              </Card>
            ))}
          </div>
        </section>

        {/* For Renters */}
        <section className="mb-20">
          <h3 className="text-3xl font-bold text-foreground text-center mb-12">For Renters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {renterSteps.map((step, index) => (
              <Card key={index} className="text-center relative group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto mb-4 p-4 bg-green-100 dark:bg-green-900 rounded-full w-16 h-16 flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-800 transition-colors">
                    <step.icon className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                  <CardDescription>{step.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{step.details}</p>
                </CardContent>
                {index < renterSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 -right-4 w-8 h-0.5 bg-green-200 dark:bg-green-800"></div>
                )}
              </Card>
            ))}
          </div>
        </section>

        {/* Safety Features */}
        <section className="mb-20">
          <h3 className="text-3xl font-bold text-foreground text-center mb-12">Safety & Security Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto mb-4 p-4 bg-orange-100 dark:bg-orange-900 rounded-full w-16 h-16 flex items-center justify-center group-hover:bg-orange-200 dark:group-hover:bg-orange-800 transition-colors">
                    <feature.icon className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="mb-20">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-blue-200 dark:border-blue-800">
            <CardContent className="py-12">
              <h3 className="text-3xl font-bold text-foreground text-center mb-12">Trusted by Thousands</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">50K+</div>
                  <div className="text-muted-foreground">Active Listings</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">25K+</div>
                  <div className="text-muted-foreground">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">15+</div>
                  <div className="text-muted-foreground">Cities Covered</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">4.8★</div>
                  <div className="text-muted-foreground">Average Rating</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <h3 className="text-3xl font-bold text-foreground mb-6">Ready to Get Started?</h3>
          <p className="text-xl text-muted-foreground mb-8">Join Pakistan's most trusted rental marketplace today</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/browse">
              <Button size="lg" className="px-8">Browse Items</Button>
            </Link>
            <Link to="/post-item">
              <Button variant="outline" size="lg" className="px-8">List Your Item</Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HowItWorks;
