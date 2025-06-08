
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Key, Shield, CheckCircle, FileText, Phone, CreditCard, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';

const Verification = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    cnic: '',
    phone: '',
    address: '',
    bankAccount: ''
  });

  const verificationSteps = [
    {
      icon: FileText,
      title: "CNIC Verification",
      description: "Verify your identity with your national ID card"
    },
    {
      icon: Phone,
      title: "Phone Verification", 
      description: "Confirm your phone number with SMS verification"
    },
    {
      icon: CreditCard,
      title: "Bank Account",
      description: "Add your bank details for secure payouts"
    },
    {
      icon: Shield,
      title: "Background Check",
      description: "We'll verify your information (24-48 hours)"
    }
  ];

  const benefits = [
    "Higher booking rates - customers trust verified renters",
    "Priority listing in search results",
    "Access to premium features and tools",
    "Dedicated customer support",
    "Insurance coverage for your items",
    "Faster payment processing"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Verification form submitted:', formData);
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

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

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">Get Verified</h2>
          <p className="text-xl text-muted-foreground">Become a trusted renter and increase your earnings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Verification Process */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-foreground mb-6">Verification Process</h3>
              
              {/* Progress Bar */}
              <div className="flex items-center mb-8">
                {verificationSteps.map((step, index) => (
                  <div key={index} className="flex items-center">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      index + 1 <= currentStep 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {index + 1 < currentStep ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>
                    {index < verificationSteps.length - 1 && (
                      <div className={`h-1 w-16 mx-2 ${
                        index + 1 < currentStep ? 'bg-blue-600' : 'bg-muted'
                      }`} />
                    )}
                  </div>
                ))}
              </div>

              {/* Current Step */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <verificationSteps[currentStep - 1].icon className="w-6 h-6 text-blue-600" />
                    <span>Step {currentStep}: {verificationSteps[currentStep - 1].title}</span>
                  </CardTitle>
                  <CardDescription>
                    {verificationSteps[currentStep - 1].description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {currentStep === 1 && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            CNIC Number
                          </label>
                          <Input
                            type="text"
                            placeholder="12345-6789012-3"
                            value={formData.cnic}
                            onChange={(e) => setFormData(prev => ({...prev, cnic: e.target.value}))}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Full Address
                          </label>
                          <Input
                            type="text"
                            placeholder="Your complete address"
                            value={formData.address}
                            onChange={(e) => setFormData(prev => ({...prev, address: e.target.value}))}
                            required
                          />
                        </div>
                      </>
                    )}

                    {currentStep === 2 && (
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Phone Number
                        </label>
                        <Input
                          type="tel"
                          placeholder="+92 300 1234567"
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({...prev, phone: e.target.value}))}
                          required
                        />
                        <p className="text-sm text-muted-foreground mt-2">
                          We'll send you a verification code via SMS
                        </p>
                      </div>
                    )}

                    {currentStep === 3 && (
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Bank Account Number
                        </label>
                        <Input
                          type="text"
                          placeholder="Your bank account number"
                          value={formData.bankAccount}
                          onChange={(e) => setFormData(prev => ({...prev, bankAccount: e.target.value}))}
                          required
                        />
                        <p className="text-sm text-muted-foreground mt-2">
                          This will be used for secure payouts
                        </p>
                      </div>
                    )}

                    {currentStep === 4 && (
                      <div className="text-center py-8">
                        <Clock className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                        <h4 className="text-xl font-semibold text-foreground mb-2">
                          Verification in Progress
                        </h4>
                        <p className="text-muted-foreground">
                          We're reviewing your information. This usually takes 24-48 hours.
                          We'll notify you once the verification is complete.
                        </p>
                      </div>
                    )}

                    {currentStep < 4 && (
                      <Button type="submit" className="w-full">
                        Continue to Next Step
                      </Button>
                    )}
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Benefits Sidebar */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-6 h-6 text-green-600" />
                  <span>Verification Benefits</span>
                </CardTitle>
                <CardDescription>
                  Why verified renters earn more
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">+40%</div>
                    <div className="text-sm text-green-700 dark:text-green-300">
                      Average earnings increase for verified renters
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Verification;
