'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SplashContextType {
  hasShownSplash: boolean;
  setHasShownSplash: (hasShown: boolean) => void;
}

const SplashContext = createContext<SplashContextType | undefined>(undefined);

export const SplashProvider = ({ children }: { children: ReactNode }) => {
  const [hasShownSplash, setHasShownSplash] = useState(false);

  return (
    <SplashContext.Provider value={{ hasShownSplash, setHasShownSplash }}>
      {children}
    </SplashContext.Provider>
  );
};

export const useSplash = () => {
  const context = useContext(SplashContext);
  if (context === undefined) {
    throw new Error('useSplash must be used within a SplashProvider');
  }
  return context;
};
