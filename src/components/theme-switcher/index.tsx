'use client';

import { useEffect, useState } from 'react';
import { Switch } from 'antd';
import { useTheme } from '@/context/theme';

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setChecked(true);
    } else {
      setChecked(false);
    }
  }, []);

  const handleChange = (checked: boolean) => {
    setChecked(checked);
    setTheme(checked);
  };

  return (
    <Switch size="small" checked={checked} onChange={handleChange} />
  );
}

export default ThemeSwitcher;