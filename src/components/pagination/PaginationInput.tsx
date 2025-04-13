"use client"; 

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "../ui/input";

interface PaginationInputProps {
  currentPage: number;
  totalPages: number;
}

const PaginationInput = ({ currentPage, totalPages }: PaginationInputProps) => {
  const [inputValue, setInputValue] = useState(currentPage);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPage = Math.max(1, Math.min(totalPages, parseInt(e.target.value)));
    setInputValue(newPage);
    router.push(`?page=${newPage}`);
  };

  return (
    <Input
      type="number"
      value={String(inputValue)}
      onChange={handleChange}
      className="w-20"
      min={1}
      max={totalPages}
    />
  );
};

export default PaginationInput;
