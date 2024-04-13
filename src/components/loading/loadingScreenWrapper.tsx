import React from 'react';
import LoadingScreen from 'src/components/loading/loadingScreen';

interface LoadingScreenWrapperProps {
  isLoading: boolean;
  children: React.ReactNode;
}

const LoadingScreenWrapper: React.FC<LoadingScreenWrapperProps> = ({ isLoading, children }) => {
  if (isLoading) {
    return <LoadingScreen />;
  }
  return <>{children}</>;
};

export default LoadingScreenWrapper;