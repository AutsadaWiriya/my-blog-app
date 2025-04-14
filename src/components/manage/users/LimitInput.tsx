"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LimitInputProps {
  currentLimit: number;
}

const LimitInput = ({ currentLimit }: LimitInputProps) => {
  const [inputLimit, setInputLimit] = useState(currentLimit.toString());
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleLimitChange = (value: string) => {
    setInputLimit(value);

    const newParams = new URLSearchParams(searchParams);
    newParams.set("limit", value);
    newParams.set("page", "1");

    router.push(`?${newParams.toString()}`);
  };

  return (
    <Select value={inputLimit} onValueChange={handleLimitChange}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="5">5</SelectItem>
        <SelectItem value="10">10</SelectItem>
        <SelectItem value="25">25</SelectItem>
        <SelectItem value="50">50</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default LimitInput;
