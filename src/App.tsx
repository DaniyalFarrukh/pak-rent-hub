import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Browse from "./pages/Browse";
import Listings from "./pages/Listings";
import ListingDetail from "./pages/ListingDetail";
import AddListing from "./pages/AddListing";
import ItemDetail from "./pages/ItemDetail";
import Dashboard from "./pages/Dashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import PostItem from "./pages/PostItem";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import RenterGuide from "./pages/RenterGuide";
import Verification from "./pages/Verification";
import HowItWorks from "./pages/HowItWorks";
import Safety from "./pages/Safety";
import Messages from "./pages/Messages";
import UserDashboard from "./pages/UserDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="easylease-theme">
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/home" element={<Home />} />
              <Route path="/browse" element={<Browse />} />
              <Route path="/listings" element={<Listings />} />
              <Route path="/listings/:id" element={<ListingDetail />} />
              <Route path="/add-listing" element={<AddListing />} />
              <Route path="/item/:id" element={<ItemDetail />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/customer-dashboard" element={<CustomerDashboard />} />
              <Route path="/my-account" element={<CustomerDashboard />} />
              <Route path="/post-item" element={<PostItem />} />
              <Route path="/list-item" element={<PostItem />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/renter-guide" element={<RenterGuide />} />
              <Route path="/verification" element={<Verification />} />
              <Route path="/get-verified" element={<Verification />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/safety" element={<Safety />} />
              <Route path="/safety-centre" element={<Safety />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/user-dashboard" element={<UserDashboard />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;