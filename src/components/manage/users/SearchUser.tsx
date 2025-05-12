import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Search {
  currentPage: number;
  limit: number;
  search: string;
}

const SearchUser = ({ currentPage, limit, search }: Search) => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState(search);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value); 
    router.push(`?page=${currentPage}&limit=${limit}&search=${value}`);
  };
  
  const clearSearch = () => {
    setSearchValue("");
    router.push(`?page=${currentPage}&limit=${limit}&search=`);
  };
  
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="h-4 w-4 text-muted-foreground" />
      </div>
      <Input
        type="text"
        value={searchValue}
        onChange={handleChange}
        className="pl-10 pr-10 h-10 w-full md:w-[220px]"
        placeholder="Search users..."
      />
      {searchValue && (
        <Button
          variant="ghost"
          size="icon"
          onClick={clearSearch}
          className="absolute inset-y-0 right-0 flex items-center pr-2.5 h-full"
        >
          <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
        </Button>
      )}
    </div>
  );
};

export default SearchUser;
