import { AnimatePresence } from 'framer-motion';
import { useRouter } from '../hooks/useRouter';
import Index from '../pages/Index';
import PredictPage from '../pages/PredictPage';
import NotFound from '../pages/NotFound';

// Import actual page components
import AboutPage from '../pages/AboutPage';
import FaqPage from '../pages/FaqPage';
import CommunityPage from '../pages/CommunityPage';
import EmergencyServicesPage from '../pages/EmergencyServicesPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';

const MainContent = () => {
  const { currentPage } = useRouter();

  const pages = {
    home: Index,
    predict: PredictPage,
    emergency: EmergencyServicesPage,
    about: AboutPage,
    faq: FaqPage,
    community: CommunityPage,
    login: LoginPage,
    register: RegisterPage,
  };

  const PageComponent = pages[currentPage as keyof typeof pages] || NotFound;

  return (
    <main>
      <AnimatePresence mode="wait">
        <PageComponent key={currentPage} />
      </AnimatePresence>
    </main>
  );
};

export default MainContent;