
import { Link } from 'react-router-dom';
import { Key, Shield, Eye, Users, CreditCard, FileText, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';

const Safety = () => {
  const safetyFeatures = [
    {
      icon: Users,
      title: "User Verification",
      description: "All users verified with CNIC, phone number, and background checks",
      details: "We require government ID verification and conduct background checks on all users to ensure a safe community."
    },
    {
      icon: CreditCard,
      title: "Secure Payments",
      description: "Escrow system holds payments until rental completion",
      details: "Your payments are held securely and only released to renters after successful rental completion."
    },
    {
      icon: Shield,
      title: "Insurance Coverage",
      description: "Comprehensive protection against damage, theft, and loss",
      details: "All rentals are covered by our insurance policy with up to PKR 500,000 coverage per incident."
    },
    {
      icon: Eye,
      title: "24/7 Monitoring",
      description: "Round-the-clock fraud detection and safety monitoring",
      details: "Our security team actively monitors for suspicious activities and responds to safety concerns immediately."
    }
  ];

  const customerTips = [
    "Always meet in public places for item pickup and return",
    "Verify the renter's identity matches their profile",
    "Document item condition with photos before and after rental",
    "Report any safety concerns immediately to our support team",
    "Read renter reviews and ratings before booking",
    "Use only our platform for communication and payments"
  ];

  const renterTips = [
    "Verify customer identity before handing over items",
    "Meet in safe, well-lit public locations",
    "Take detailed photos of item condition before rental",
    "Require security deposits for valuable items",
    "Trust your instincts - decline suspicious requests",
    "Keep communication records within our platform"
  ];

  const warningSignsData = [
    "Requests to meet in isolated or private locations",
    "Pressure to complete transactions outside our platform",
    "Requests for personal banking or financial information", 
    "Unwillingness to provide proper identification",
    "Significantly below-market pricing (too good to be true)",
    "Poor communication or evasive responses to questions"
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
          <h2 className="text-4xl font-bold text-foreground mb-4">Safety Center</h2>
          <p className="text-xl text-muted-foreground">Your safety is our top priority</p>
        </div>

        {/* Safety Features */}
        <section className="mb-20">
          <h3 className="text-3xl font-bold text-foreground text-center mb-12">How We Keep You Safe</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {safetyFeatures.map((feature, index) => (
              <Card key={index} className="text-center group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto mb-4 p-4 bg-green-100 dark:bg-green-900 rounded-full w-16 h-16 flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-800 transition-colors">
                    <feature.icon className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.details}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Safety Tips */}
        <section className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Customer Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                  <span>Safety Tips for Customers</span>
                </CardTitle>
                <CardDescription>Best practices when renting items</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {customerTips.map((tip, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Renter Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-6 h-6 text-green-600" />
                  <span>Safety Tips for Renters</span>
                </CardTitle>
                <CardDescription>Protect yourself and your items</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {renterTips.map((tip, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Warning Signs */}
        <section className="mb-20">
          <Card className="border-2 border-red-200 dark:border-red-800">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-red-600">
                <AlertTriangle className="w-6 h-6" />
                <span>Warning Signs to Watch For</span>
              </CardTitle>
              <CardDescription>Be cautious if you encounter any of these red flags</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {warningSignsData.map((warning, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{warning}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Insurance Coverage */}
        <section className="mb-20">
          <Card className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950 dark:to-green-950">
            <CardHeader>
              <CardTitle className="text-center text-2xl">Insurance Coverage Details</CardTitle>
              <CardDescription className="text-center">Comprehensive protection for all rentals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">₹5 Lakh</div>
                  <div className="text-muted-foreground">Maximum coverage per incident</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600 mb-2">100%</div>
                  <div className="text-muted-foreground">Rental transactions covered</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">24hrs</div>
                  <div className="text-muted-foreground">Claim processing time</div>
                </div>
              </div>
              
              <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg">
                <h4 className="font-semibold mb-4">Coverage Includes:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ul className="space-y-2">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Accidental damage during rental</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Theft or loss of rented items</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Third-party liability protection</span>
                    </li>
                  </ul>
                  <ul className="space-y-2">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Emergency replacement costs</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Legal dispute mediation</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">24/7 emergency support</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Emergency Contact */}
        <section className="text-center">
          <Card className="border-2 border-orange-200 dark:border-orange-800">
            <CardContent className="py-8">
              <h3 className="text-2xl font-bold text-foreground mb-4">Need Help?</h3>
              <p className="text-muted-foreground mb-6">
                If you feel unsafe or need immediate assistance, contact us right away
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-red-600 hover:bg-red-700">
                  Emergency: 1122
                </Button>
                <Link to="/contact">
                  <Button variant="outline" size="lg">
                    Contact Support
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default Safety;
