import React from 'react';

export const Alert = ({ children }) => (
  <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
    {children}
  </div>
);

export const AlertDescription = ({ children }) => (
  <div className="text-sm">{children}</div>
);
