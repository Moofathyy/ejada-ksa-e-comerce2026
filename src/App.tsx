import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { I18nProvider } from "@/lib/i18n";
import { StoreProvider } from "@/lib/store";
import { ThemeProvider } from "@/lib/theme";
import Splash from "./pages/Splash";
import Onboarding from "./pages/Onboarding";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Listing from "./pages/Listing";
import PDP from "./pages/PDP";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Orders, { OrderTracking } from "./pages/Orders";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";
import ProfileSection from "./pages/ProfileSection";
import Notifications from "./pages/Notifications";
import AddAddress from "./pages/AddAddress";
import AddCard from "./pages/AddCard";
import Returns from "./pages/Returns";
import Compare from "./pages/Compare";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <I18nProvider>
      <ThemeProvider>
        <StoreProvider>
          <TooltipProvider>
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Splash />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/home" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/listing" element={<Listing />} />
              <Route path="/product/:id" element={<PDP />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-confirmation" element={<OrderConfirmation />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/order/:id" element={<OrderTracking />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/:section" element={<ProfileSection />} />
              <Route path="/returns" element={<Returns />} />
              <Route path="/returns/:orderId" element={<Returns />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/profile/addresses/new" element={<AddAddress />} />
              <Route path="/profile/payments/new" element={<AddCard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          </TooltipProvider>
        </StoreProvider>
      </ThemeProvider>
    </I18nProvider>
  </QueryClientProvider>
);

export default App;
