
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock, Send, Key, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  message: z.string().trim().min(1, "Message is required").max(1000, "Message must be less than 1000 characters")
});

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate input
    try {
      contactSchema.parse(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: 'Validation Error',
          description: error.errors[0].message,
          variant: 'destructive'
        });
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          message: `${formData.subject ? `Subject: ${formData.subject}\n\n` : ''}${formData.message.trim()}`
        });

      if (error) throw error;

      setIsSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      toast({
        title: 'Message Sent!',
        description: 'Thank you for contacting us. We\'ll get back to you soon.',
      });

      // Reset success state after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to send message. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">Contact Us</h2>
          <p className="text-xl text-muted-foreground">We're here to help you 24/7</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Phone className="w-5 h-5" />
                  <span>Phone Support</span>
                </CardTitle>
                <CardDescription>Available 24/7 for urgent matters</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold text-foreground">+92-300-EASYLEASE</p>
                <p className="text-muted-foreground">+92-300-327-953273</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mail className="w-5 h-5" />
                  <span>Email Support</span>
                </CardTitle>
                <CardDescription>We'll respond within 2 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold text-foreground">support@easylease.pk</p>
                <p className="text-muted-foreground">For general inquiries and support</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>Office Address</span>
                </CardTitle>
                <CardDescription>Visit us during business hours</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-foreground">Easy Lease Pakistan</p>
                <p className="text-muted-foreground">Plot 123, F-8 Markaz</p>
                <p className="text-muted-foreground">Islamabad, Pakistan</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Business Hours</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="text-foreground">Monday - Friday: 9:00 AM - 8:00 PM</p>
                  <p className="text-foreground">Saturday: 10:00 AM - 6:00 PM</p>
                  <p className="text-foreground">Sunday: 12:00 PM - 5:00 PM</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
                <CardDescription>Fill out the form below and we'll get back to you soon</CardDescription>
              </CardHeader>
              <CardContent>
                {isSuccess && (
                  <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <p className="text-green-800 dark:text-green-200 text-sm">Your message has been sent successfully!</p>
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Name</label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Subject</label>
                    <Input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder="What is this about?"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                    <Textarea
                      className="h-32"
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Tell us how we can help you..."
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    <Send className="w-4 h-4 mr-2" />
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;
