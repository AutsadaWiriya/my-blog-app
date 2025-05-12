"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, ListFilter } from "lucide-react";

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
    <div className="flex items-center">
      <div className="hidden sm:flex items-center mr-2 text-sm text-muted-foreground">
        <ListFilter className="h-4 w-4 mr-1" />
        <span>Show:</span>
      </div>
      <Select value={inputLimit} onValueChange={handleLimitChange}>
        <SelectTrigger className="h-10 w-[70px] sm:w-[80px]">
          <SelectValue />
          <ChevronDown className="h-4 w-4 opacity-50" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="5">5 rows</SelectItem>
          <SelectItem value="10">10 rows</SelectItem>
          <SelectItem value="25">25 rows</SelectItem>
          <SelectItem value="50">50 rows</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default LimitInput;
