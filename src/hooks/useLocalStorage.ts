import { useState } from "react";

function useLocalStorage(key: string, initialValue: any) {
  //state
  const [storeValue, setStoreValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  //setter
  const setValue = (value: any) => {
    try {
      const valueToStore = value instanceof Function ? value(storeValue) : storeValue;

      setStoreValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (err) {
      console.log("error in setting the value");
    }
  };

  return [storeValue, setValue];
}
