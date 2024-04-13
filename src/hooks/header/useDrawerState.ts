import { useState } from 'react';

const useDrawerState = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = (open: boolean) => {
    setIsDrawerOpen(open);
  };

  return { isDrawerOpen, toggleDrawer };
};

export default useDrawerState;

