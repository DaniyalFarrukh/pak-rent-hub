
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  {
    category: "Getting Started",
    question: "How does Easy Lease work?",
    answer: "Easy Lease connects people who want to rent items with those who have items to rent. Simply browse our marketplace, find what you need, book it, and enjoy your rental. For renters, you can list your items and start earning money from things you already own."
  },
  {
    category: "Getting Started",
    question: "Is Easy Lease available in my city?",
    answer: "We currently operate in major cities across Pakistan including Karachi, Lahore, Islamabad, Rawalpindi, and Faisalabad. We're expanding to more cities every month. Check our website for the latest coverage areas."
  },
  {
    category: "Booking & Payments",
    question: "How do I pay for a rental?",
    answer: "We accept multiple payment methods including credit/debit cards, bank transfers, and mobile wallet payments like JazzCash and EasyPaisa. All payments are processed securely through our escrow system."
  },
  {
    category: "Booking & Payments",
    question: "When am I charged for a rental?",
    answer: "You're charged when you confirm your booking. For longer rentals, we may require a security deposit which is refunded after the item is returned in good condition."
  },
  {
    category: "Safety & Security",
    question: "How do you verify renters?",
    answer: "All renters go through our verification process which includes CNIC verification, phone number confirmation, and background checks. We also have a rating system where customers can review their experience."
  },
  {
    category: "Safety & Security",
    question: "What if an item gets damaged?",
    answer: "We have comprehensive insurance coverage for all rentals. If an item is damaged, our support team will assess the situation and handle the claim according to our damage policy."
  },
  {
    category: "For Renters",
    question: "How do I list my item?",
    answer: "Click 'List Your Item' on our homepage, create an account, upload photos of your item, set your rental price and availability, and we'll review your listing within 24 hours."
  },
  {
    category: "For Renters",
    question: "How much money can I make?",
    answer: "Earnings vary depending on your item type, location, and demand. Popular items like cameras, cars, and wedding dresses can earn between PKR 5,000 to PKR 50,000+ per month."
  }
];

const FAQ = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...new Set(faqData.map(item => item.category))];

  const toggleItem = (index: number) => {
    if (openItems.includes(index)) {
      setOpenItems(openItems.filter(i => i !== index));
    } else {
      setOpenItems([...openItems, index]);
    }
  };

  const filteredFAQs = selectedCategory === 'All' 
    ? faqData 
    : faqData.filter(item => item.category === selectedCategory);

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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-muted-foreground">Find answers to common questions about Easy Lease</p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="mb-2"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFAQs.map((item, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader 
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => toggleItem(index)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-left text-lg">{item.question}</CardTitle>
                    <CardDescription className="text-left">{item.category}</CardDescription>
                  </div>
                  {openItems.includes(index) ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
              </CardHeader>
              {openItems.includes(index) && (
                <CardContent className="pt-0">
                  <p className="text-muted-foreground">{item.answer}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 text-center">
          <Card className="border-2 border-dashed border-muted-foreground/20">
            <CardContent className="pt-6">
              <h3 className="text-2xl font-bold text-foreground mb-4">Still have questions?</h3>
              <p className="text-muted-foreground mb-6">Can't find what you're looking for? Our support team is here to help.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact">
                  <Button>Contact Support</Button>
                </Link>
                <Button variant="outline">Live Chat</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default FAQ;
