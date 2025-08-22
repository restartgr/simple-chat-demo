import React from 'react';
import { Outlet } from 'react-router';

const BaseLayout: React.FC = () => {
  return (
    <div className="h-full w-full">
      <Outlet />
    </div>
  );
};

export default BaseLayout;
