import { useState } from 'react';

const useLocalStorage = (key, initial) => {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initial;
    } catch {
      return initial;
    }
  });

  const setStored = (newVal) => {
    try {
      setValue(newVal);
      window.localStorage.setItem(key, JSON.stringify(newVal));
    } catch (e) {
      console.error(e);
    }
  };

  return [value, setStored];
};

export default useLocalStorage;
