import { useState, useEffect } from "react";

function getStorageValue(key, defaultValue) {
  // getting stored value
  const saved = localStorage.getItem(key);
  const initial = JSON.parse(saved);
  return initial || defaultValue;
}

export default function useLocalStorage (key, defaultValue = null) {
  const [value, setValue] = useState(() => {
    return getStorageValue(key, defaultValue);
  });
  useEffect(() => {
    // storing input name
    if(key) localStorage.setItem(key, JSON.stringify(value));

  }, [value, key]);

  return [ value, setValue ];
};
