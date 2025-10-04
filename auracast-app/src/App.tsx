import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./hooks/useAuth";
import { RouterProvider } from "./hooks/useRouter";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { DynamicSpaceBackground } from "./components/DynamicSpaceBackground";
import MainContent from "./components/MainContent";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <RouterProvider>
          <div className="min-h-screen bg-background text-foreground font-inter">
            <DynamicSpaceBackground />
            <Header />
            <MainContent />
            <Footer />
            <Toaster />
            <Sonner />
          </div>
        </RouterProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
