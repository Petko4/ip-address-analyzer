import { FormEvent, useEffect, useRef } from "react";

interface TextInputProps {
  value: string;
  onChange: (e: FormEvent<HTMLInputElement>) => void;
  placeholder: string;
  isValid: boolean;
}
export default function TextInput(props: TextInputProps) {
  const { isValid, ...filteredProps } = props;
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);
  return (
    <>
      <input
        {...filteredProps}
        className={`bg-transparent border  outline-none p-1  text-center text-sm w-52 ${
          isValid ? "border-white" : "border-red-400 text-red-400"
        }`}
        ref={ref}
      />
    </>
  );
}
