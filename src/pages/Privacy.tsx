
import { Link } from 'react-router-dom';
import { Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';

const Privacy = () => {
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
          <h2 className="text-4xl font-bold text-foreground mb-4">Privacy Policy</h2>
          <p className="text-xl text-muted-foreground">Last updated: December 2024</p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <h4 className="font-semibold">Personal Information</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Name, email address, phone number</li>
                <li>CNIC number for verification purposes</li>
                <li>Payment information (processed securely through third-party providers)</li>
                <li>Address for delivery and pickup coordination</li>
              </ul>
              
              <h4 className="font-semibold mt-4">Usage Information</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Device information and IP address</li>
                <li>Browsing behavior and search history on our platform</li>
                <li>Transaction history and rental preferences</li>
                <li>Communication records with other users and support</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Service Provision:</strong> To facilitate rentals, process payments, and provide customer support</li>
                <li><strong>Safety & Security:</strong> To verify user identities, prevent fraud, and ensure platform safety</li>
                <li><strong>Communication:</strong> To send booking confirmations, updates, and important service announcements</li>
                <li><strong>Improvement:</strong> To analyze usage patterns and improve our platform features</li>
                <li><strong>Marketing:</strong> To send promotional offers and updates (with your consent)</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Information Sharing</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>We share your information only in these limited circumstances:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>With Other Users:</strong> Basic profile information is shared to facilitate rentals</li>
                <li><strong>Service Providers:</strong> We use trusted third parties for payment processing, SMS, and email services</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and users' safety</li>
                <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale of our business</li>
              </ul>
              <p className="mt-4">We never sell your personal information to third parties for marketing purposes.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Security</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>We implement industry-standard security measures to protect your data:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>SSL encryption for all data transmission</li>
                <li>Secure data storage with regular backups</li>
                <li>Regular security audits and updates</li>
                <li>Limited employee access on a need-to-know basis</li>
                <li>Two-factor authentication options for user accounts</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Rights</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>You have the following rights regarding your personal data:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data</li>
                <li><strong>Deletion:</strong> Request deletion of your personal data (subject to legal requirements)</li>
                <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                <li><strong>Objection:</strong> Object to processing of your data for marketing purposes</li>
              </ul>
              <p className="mt-4">To exercise these rights, contact us at privacy@easylease.pk</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cookies and Tracking</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>We use cookies and similar technologies to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Remember your preferences and login status</li>
                <li>Analyze website traffic and usage patterns</li>
                <li>Provide personalized content and recommendations</li>
                <li>Improve our services and user experience</li>
              </ul>
              <p className="mt-4">You can control cookie settings through your browser preferences.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Retention</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>We retain your personal data for as long as necessary to provide our services and comply with legal obligations. Generally:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Account information: Until account deletion plus 1 year for legal compliance</li>
                <li>Transaction records: 7 years for financial and legal requirements</li>
                <li>Communication logs: 3 years for customer service purposes</li>
                <li>Marketing data: Until you unsubscribe or object to processing</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Changes to This Policy</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>We may update this Privacy Policy from time to time. We will notify you of any material changes by:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Posting the updated policy on this page</li>
                <li>Sending email notifications to registered users</li>
                <li>Displaying prominent notices on our platform</li>
              </ul>
              <p className="mt-4">Your continued use of our services after any changes constitutes acceptance of the updated policy.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>If you have questions about this Privacy Policy or our data practices, please contact us:</p>
              <ul className="list-none space-y-1">
                <li><strong>Email:</strong> privacy@easylease.pk</li>
                <li><strong>Phone:</strong> +92-300-EASYLEASE</li>
                <li><strong>Address:</strong> Plot 123, F-8 Markaz, Islamabad, Pakistan</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Privacy;
