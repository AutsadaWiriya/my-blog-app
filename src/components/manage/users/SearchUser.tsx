import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Search {
  currentPage: number;
  limit: number;
  search: string;
}

const searchUser = ({ currentPage, limit, search }: Search) => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState(search);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value); 
    router.push(`?page=${currentPage}&limit=${limit}&search=${value}`);
  };
  
  return (
    <>
      <Input
        type="text"
        value={searchValue}
        onChange={handleChange}
        className="max-w-56"
        placeholder="Search name"
      />
    </>
  );
};

export default searchUser;
