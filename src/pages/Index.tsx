import React, { Suspense, memo, useState } from 'react';
import FuturisticIndex from './FuturisticIndex';
import WelcomePage from '../components/WelcomePage';
import LoadingScreen from '../components/LoadingScreen';

// Memoize the FuturisticIndex component to prevent unnecessary re-renders
const MemoizedFuturisticIndex = memo(FuturisticIndex);

const Index = memo(() => {
  const [showWelcome, setShowWelcome] = useState(true);

  const handleEnterHub = () => {
    setShowWelcome(false);
  };

  return (
    <Suspense fallback={<LoadingScreen />}>
      {showWelcome ? (
        <WelcomePage onEnter={handleEnterHub} />
      ) : (
        <MemoizedFuturisticIndex />
      )}
    </Suspense>
  );
});

Index.displayName = 'Index';

export default Index;
