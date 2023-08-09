import { useState, useRef, useEffect } from "react";

export default function useDebounceValidation<T>(
  inputValue: T,
  validatorFn: (inputValue: T) => void
) {
  const [isValid, setIsValid] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (inputValue !== "") {
      setIsValid(true);

      if (timeoutRef?.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        try {
          validatorFn(inputValue);
        } catch (error) {
          if (error instanceof TypeError) {
            setIsValid(false);
          }
        }
      }, 2000);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [inputValue, validatorFn]);

  return isValid;
}
