import { useCallback, useState } from 'react';
import LandingPage from './pages/LandingPage';
import IntroScreen from './components/IntroScreen';

const App = () => {
  const [done, setDone] = useState(false);

  const handleIntroComplete = useCallback(() => {
    setDone(true);
  }, []);

  return (
    <>
      <LandingPage />
      {!done && <IntroScreen name="SKY TAN" onComplete={handleIntroComplete} />}
    </>
  );
};

export default App;
