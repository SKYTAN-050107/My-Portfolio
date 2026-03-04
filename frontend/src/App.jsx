import { useCallback, useState } from 'react';
import LandingPage from './pages/LandingPage';
import IntroScreen from './components/IntroScreen';

const App = () => {
  const [done, setDone] = useState(false);

  const handleIntroComplete = useCallback(() => {
    setDone(true);
  }, []);

  if (!done) {
    return <IntroScreen name="SKY TAN" onComplete={handleIntroComplete} holdAfterMs={2000} />;
  }

  return <LandingPage />;
};

export default App;
