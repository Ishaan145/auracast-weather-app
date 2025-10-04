import { Home, CloudRain, AlertTriangle, Info, HelpCircle, Users } from 'lucide-react';
import { useRouter } from '../hooks/useRouter';

export const Footer = () => {
  const { navigate, currentPage } = useRouter();

  const navItems = [
    { name: 'Home', path: 'home', icon: Home },
    { name: 'Predict', path: 'predict', icon: CloudRain },
    { name: 'Emergency', path: 'emergency', icon: AlertTriangle },
    { name: 'About', path: 'about', icon: Info },
    { name: 'FAQ', path: 'faq', icon: HelpCircle },
    { name: 'Community', path: 'community', icon: Users },
  ];

  return (
    <footer className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-[#0d1117] border-t border-white/10 pb-safe">
      <nav className="px-2 py-1">
        <div className="flex items-center justify-around min-h-[64px]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.path;
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`relative flex flex-col items-center justify-center space-y-1 px-2 py-2 transition-colors ${
                  isActive 
                    ? 'text-primary' 
                    : 'text-muted-foreground'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                <span className={`text-[10px] font-medium ${isActive ? 'font-semibold' : ''}`}>
                  {item.name}
                </span>
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-t-full" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </footer>
  );
};
