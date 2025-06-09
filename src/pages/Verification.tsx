import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Key, Shield, CheckCircle, FileText, Phone, CreditCard, Clock, Upload, X, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Verification = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    cnic: '',
    phone: '',
    address: '',
    bankAccount: ''
  });
  const [cnicFiles, setCnicFiles] = useState<File[]>([]);
  const [validationStatus, setValidationStatus] = useState<{ [key: number]: 'pending' | 'validating' | 'valid' | 'invalid' }>({});
  const { toast } = useToast();

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

  const formatCNIC = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Apply CNIC format: XXXXX-XXXXXXX-X
    if (digits.length <= 5) {
      return digits;
    } else if (digits.length <= 12) {
      return `${digits.slice(0, 5)}-${digits.slice(5)}`;
    } else {
      return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12, 13)}`;
    }
  };

  const handleCNICChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCNIC(e.target.value);
    setFormData(prev => ({...prev, cnic: formatted}));
  };

  const validateFileType = (file: File): boolean => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    return allowedTypes.includes(file.type);
  };

  const validateCNICImage = async (file: File, index: number): Promise<boolean> => {
    return new Promise((resolve) => {
      setValidationStatus(prev => ({ ...prev, [index]: 'validating' }));
      
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        // Get image data for basic validation
        const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
        
        // Basic checks for CNIC-like characteristics
        const aspectRatio = img.width / img.height;
        const isCardLikeAspectRatio = aspectRatio > 1.4 && aspectRatio < 1.8; // CNIC is roughly 1.6:1
        const hasMinimumSize = img.width >= 300 && img.height >= 180; // Minimum reasonable size
        
        // Check if image has sufficient detail (not too dark/bright/blurry)
        let totalBrightness = 0;
        let pixelCount = 0;
        
        if (imageData) {
          for (let i = 0; i < imageData.data.length; i += 4) {
            const r = imageData.data[i];
            const g = imageData.data[i + 1];
            const b = imageData.data[i + 2];
            totalBrightness += (r + g + b) / 3;
            pixelCount++;
          }
        }
        
        const avgBrightness = totalBrightness / pixelCount;
        const hasGoodBrightness = avgBrightness > 30 && avgBrightness < 225; // Not too dark or too bright
        
        const isValid = isCardLikeAspectRatio && hasMinimumSize && hasGoodBrightness;
        
        if (isValid) {
          setValidationStatus(prev => ({ ...prev, [index]: 'valid' }));
          toast({
            title: "CNIC image validated",
            description: `${index === 0 ? 'Front' : 'Back'} side appears to be a valid CNIC document.`,
          });
        } else {
          setValidationStatus(prev => ({ ...prev, [index]: 'invalid' }));
          toast({
            title: "Invalid CNIC image",
            description: `This doesn't appear to be a valid CNIC document. Please upload a clear photo of your ${index === 0 ? 'CNIC front' : 'CNIC back'}.`,
            variant: "destructive"
          });
        }
        
        resolve(isValid);
      };
      
      img.onerror = () => {
        setValidationStatus(prev => ({ ...prev, [index]: 'invalid' }));
        toast({
          title: "Image validation failed",
          description: "Unable to process the uploaded image. Please try again.",
          variant: "destructive"
        });
        resolve(false);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      const validFiles: File[] = [];
      let hasInvalidFiles = false;

      // First check file types
      newFiles.forEach(file => {
        if (validateFileType(file)) {
          validFiles.push(file);
        } else {
          hasInvalidFiles = true;
        }
      });

      if (hasInvalidFiles) {
        toast({
          title: "Invalid file type",
          description: "Please upload only image files (JPG, PNG, WebP) of your CNIC front and back.",
          variant: "destructive"
        });
      }

      if (validFiles.length > 0) {
        // Check if adding these files would exceed the limit
        const totalFiles = cnicFiles.length + validFiles.length;
        if (totalFiles > 2) {
          toast({
            title: "Too many files",
            description: "Please upload only 2 images: front and back of your CNIC.",
            variant: "destructive"
          });
          return;
        }

        // Add files and validate them
        const startIndex = cnicFiles.length;
        setCnicFiles(prev => [...prev, ...validFiles]);
        
        // Validate each uploaded CNIC image
        validFiles.forEach(async (file, fileIndex) => {
          const actualIndex = startIndex + fileIndex;
          await validateCNICImage(file, actualIndex);
        });
      }
    }
  };

  const removeFile = (index: number) => {
    setCnicFiles(prev => prev.filter((_, i) => i !== index));
    setValidationStatus(prev => {
      const newStatus = { ...prev };
      delete newStatus[index];
      // Reindex remaining files
      const reindexed: typeof newStatus = {};
      Object.keys(newStatus).forEach(key => {
        const oldIndex = parseInt(key);
        if (oldIndex > index) {
          reindexed[oldIndex - 1] = newStatus[oldIndex];
        } else {
          reindexed[oldIndex] = newStatus[oldIndex];
        }
      });
      return reindexed;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep === 1) {
      if (cnicFiles.length < 2) {
        toast({
          title: "Missing CNIC documents",
          description: "Please upload both front and back images of your CNIC.",
          variant: "destructive"
        });
        return;
      }

      // Check if all uploaded files are validated as valid CNICs
      const invalidFiles = cnicFiles.some((_, index) => 
        validationStatus[index] === 'invalid' || validationStatus[index] === 'validating'
      );

      if (invalidFiles) {
        toast({
          title: "CNIC validation incomplete",
          description: "Please ensure all uploaded images are valid CNIC documents before proceeding.",
          variant: "destructive"
        });
        return;
      }
    }

    console.log('Verification form submitted:', formData);
    console.log('CNIC files:', cnicFiles);
    console.log('Validation status:', validationStatus);
    
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
                    {(() => {
                      const StepIcon = verificationSteps[currentStep - 1].icon;
                      return <StepIcon className="w-6 h-6 text-blue-600" />;
                    })()}
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
                            onChange={handleCNICChange}
                            maxLength={15}
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Upload CNIC Documents <span className="text-red-500">*</span>
                          </label>
                          
                          <Alert className="mb-4">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>
                              <strong>Important:</strong> Please upload clear, high-quality photos of your actual CNIC card. 
                              The system will automatically verify that the uploaded images contain valid CNIC documents.
                            </AlertDescription>
                          </Alert>
                          
                          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-blue-600 transition-colors">
                            <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground mb-2">
                              <strong>Required:</strong> Upload clear images of both front and back of your CNIC
                            </p>
                            <p className="text-xs text-muted-foreground mb-4">
                              Accepted formats: JPG, PNG, WebP (Max 2 files)
                            </p>
                            <input
                              type="file"
                              accept="image/jpeg,image/jpg,image/png,image/webp"
                              multiple
                              onChange={handleFileUpload}
                              className="hidden"
                              id="cnic-upload"
                            />
                            <label htmlFor="cnic-upload">
                              <Button type="button" variant="outline" className="cursor-pointer" asChild>
                                <span>Choose CNIC Images</span>
                              </Button>
                            </label>
                          </div>
                          
                          {cnicFiles.length > 0 && (
                            <div className="mt-4 space-y-2">
                              <p className="text-sm font-medium text-foreground">
                                Uploaded Files ({cnicFiles.length}/2):
                              </p>
                              {cnicFiles.map((file, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                  <div className="flex items-center space-x-3">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                      validationStatus[index] === 'valid' ? 'bg-green-100 dark:bg-green-900' :
                                      validationStatus[index] === 'invalid' ? 'bg-red-100 dark:bg-red-900' :
                                      validationStatus[index] === 'validating' ? 'bg-yellow-100 dark:bg-yellow-900' :
                                      'bg-blue-100 dark:bg-blue-900'
                                    }`}>
                                      {validationStatus[index] === 'valid' ? (
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                      ) : validationStatus[index] === 'invalid' ? (
                                        <X className="w-5 h-5 text-red-600" />
                                      ) : validationStatus[index] === 'validating' ? (
                                        <Clock className="w-5 h-5 text-yellow-600" />
                                      ) : (
                                        <FileText className="w-5 h-5 text-blue-600" />
                                      )}
                                    </div>
                                    <div>
                                      <span className="text-sm font-medium text-foreground">{file.name}</span>
                                      <p className="text-xs text-muted-foreground">
                                        {index === 0 ? 'CNIC Front' : 'CNIC Back'} - {(file.size / 1024 / 1024).toFixed(2)} MB
                                        {validationStatus[index] === 'validating' && ' - Validating...'}
                                        {validationStatus[index] === 'valid' && ' - ✓ Verified as CNIC'}
                                        {validationStatus[index] === 'invalid' && ' - ✗ Not a valid CNIC'}
                                      </p>
                                    </div>
                                  </div>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeFile(index)}
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                              ))}
                              {cnicFiles.length < 2 && (
                                <p className="text-sm text-amber-600">
                                  Please upload {2 - cnicFiles.length} more image{2 - cnicFiles.length > 1 ? 's' : ''} (CNIC {cnicFiles.length === 0 ? 'front and back' : 'back'})
                                </p>
                              )}
                            </div>
                          )}
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
