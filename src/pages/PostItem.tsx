import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, X, Plus, Calendar, MapPin, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { ThemeToggle } from '@/components/ThemeToggle';

const PostItem = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    priceType: 'day',
    location: '',
    images: [] as string[],
    availableDates: [] as Date[],
    rules: [''],
    features: ['']
  });

  const categories = [
    'Vehicles',
    'Wedding Dresses',
    'Electronics',
    'Tools & Equipment',
    'Event Equipment',
    'Sports Equipment',
    'Home & Garden',
    'Others'
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // In a real app, upload to server and get URLs
      const newImages = Array.from(files).map(() => '/placeholder.svg');
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages].slice(0, 10)
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const addRule = () => {
    setFormData(prev => ({
      ...prev,
      rules: [...prev.rules, '']
    }));
  };

  const updateRule = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules.map((rule, i) => i === index ? value : rule)
    }));
  };

  const removeRule = (index: number) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index)
    }));
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => i === index ? value : feature)
    }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = () => {
    console.log('Submitting item:', formData);
    // In real app, submit to backend
    navigate('/dashboard');
  };

  const steps = [
    { number: 1, title: 'Basic Details', description: 'Tell us about your item' },
    { number: 2, title: 'Photos & Pricing', description: 'Add images and set your price' },
    { number: 3, title: 'Availability & Rules', description: 'Set dates and rental terms' },
    { number: 4, title: 'Review & Publish', description: 'Final review before listing' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </Link>
            
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Post New Item</h1>
            
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.number 
                    ? 'bg-green-600 border-green-600 text-white' 
                    : 'border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400'
                }`}>
                  {step.number}
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.number ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`ml-8 w-20 h-0.5 ${
                    currentStep > step.number ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">{steps[currentStep - 1].title}</CardTitle>
            <CardDescription className="dark:text-gray-400">{steps[currentStep - 1].description}</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Step 1: Basic Details */}
            {currentStep === 1 && (
              <>
                <div>
                  <Label htmlFor="title" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Item Title *
                  </Label>
                  <Input
                    id="title"
                    placeholder="e.g., Honda Civic 2021 - Perfect for City Tours"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="h-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Be descriptive and specific</p>
                </div>

                <div>
                  <Label htmlFor="category" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Category *
                  </Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full h-12 px-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-green-500 focus:outline-none dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Description *
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your item in detail. Include condition, features, and any special instructions..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="min-h-32 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="location" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Location *
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                    <Input
                      id="location"
                      placeholder="e.g., Lahore, Punjab"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="pl-10 h-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Step 2: Photos & Pricing */}
            {currentStep === 2 && (
              <>
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 block">
                    Photos * (Upload up to 10 photos)
                  </Label>
                  
                  {/* Image Upload Area */}
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-green-500 dark:hover:border-green-400 transition-colors">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Upload className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Click to upload photos
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        JPG, PNG files up to 10MB each
                      </p>
                    </label>
                  </div>

                  {/* Uploaded Images */}
                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img 
                            src={image} 
                            alt={`Upload ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          {index === 0 && (
                            <span className="absolute bottom-1 left-1 bg-green-600 text-white text-xs px-2 py-1 rounded">
                              Cover
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="price" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Price (PKR) *
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                      <Input
                        id="price"
                        type="number"
                        placeholder="0"
                        value={formData.price}
                        onChange={(e) => handleInputChange('price', e.target.value)}
                        className="pl-10 h-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="priceType" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Price Type *
                    </Label>
                    <select
                      id="priceType"
                      value={formData.priceType}
                      onChange={(e) => handleInputChange('priceType', e.target.value)}
                      className="w-full h-12 px-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-green-500 focus:outline-none dark:bg-gray-700 dark:text-white"
                    >
                      <option value="hour">Per Hour</option>
                      <option value="day">Per Day</option>
                      <option value="week">Per Week</option>
                      <option value="month">Per Month</option>
                    </select>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 block">
                    Features & Amenities
                  </Label>
                  <div className="space-y-3">
                    {formData.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <Input
                          placeholder="e.g., Air Conditioning, GPS Navigation"
                          value={feature}
                          onChange={(e) => updateFeature(index, e.target.value)}
                          className="flex-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                        {formData.features.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeFeature(index)}
                            className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addFeature}
                      className="w-full dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Feature
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* Step 3: Availability & Rules */}
            {currentStep === 3 && (
              <>
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 block">
                    Availability Calendar
                  </Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Select the dates when your item is available for rent
                  </p>
                  <CalendarComponent
                    mode="multiple"
                    selected={formData.availableDates}
                    onSelect={(dates) => handleInputChange('availableDates', dates || [])}
                    disabled={(date) => date < new Date()}
                    className="rounded-lg border dark:border-gray-600 p-4 dark:bg-gray-700"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 block">
                    Rental Rules & Terms
                  </Label>
                  <div className="space-y-3">
                    {formData.rules.map((rule, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <Input
                          placeholder="e.g., No smoking allowed, Return with same fuel level"
                          value={rule}
                          onChange={(e) => updateRule(index, e.target.value)}
                          className="flex-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                        {formData.rules.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeRule(index)}
                            className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addRule}
                      className="w-full dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Rule
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* Step 4: Review & Publish */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <h3 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">Review Your Listing</h3>
                  <p className="text-yellow-700 dark:text-yellow-400 text-sm">
                    Please review all details carefully. Once published, your item will be visible to potential renters.
                  </p>
                </div>

                {/* Preview */}
                <div className="border dark:border-gray-600 rounded-lg p-6 bg-gray-50 dark:bg-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <img 
                        src={formData.images[0] || '/placeholder.svg'} 
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{formData.title}</h2>
                      <p className="text-green-600 dark:text-green-400 font-semibold mb-2">{formData.category}</p>
                      <p className="text-3xl font-bold mb-2 dark:text-white">
                        PKR {parseInt(formData.price).toLocaleString()}
                        <span className="text-lg font-normal text-gray-600 dark:text-gray-400">/{formData.priceType}</span>
                      </p>
                      <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 mb-4">
                        <MapPin className="w-4 h-4" />
                        <span>{formData.location}</span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">{formData.description}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 dark:text-green-300 mb-2">Ready to Publish?</h3>
                  <p className="text-green-700 dark:text-green-400 text-sm">
                    Your listing will be reviewed and activated within 24 hours. You'll receive an email confirmation once it's live.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Previous
          </Button>
          
          {currentStep < 4 ? (
            <Button
              onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
              className="bg-green-600 hover:bg-green-700"
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700"
            >
              Publish Listing
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostItem;
