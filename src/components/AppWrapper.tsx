// src/components/AppWrapper.tsx
import React, { ReactNode } from 'react';
import { AuthProvider } from '../context/AuthContext';
import { Provider as PaperProvider } from 'react-native-paper';

type Props = {
  children: ReactNode;
};

const AppWrapper = ({ children }: Props) => {
  return (
    <PaperProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </PaperProvider>
  );
};

export default AppWrapper;
