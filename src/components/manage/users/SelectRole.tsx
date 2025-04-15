import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface Data {
  userId: string;
  userRole: String;
  currentId: string;
  onUpdateRole: () => void;
}

const SelectRole = ({ userId, userRole, currentId, onUpdateRole }: Data) => {
  const handleChangeRole = async (value: string) => {
    try {
      const res = await fetch("/api/manageuser", {
        method: "PUT",
        body: JSON.stringify({ userId, newRole: value }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("User role updated successfully");
        onUpdateRole();
      } else {
        toast.error("Failed to update user role", {
          description: data.error,
        });
      }
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };
  return (
    <>
      <Select
        value={userRole as string}
        disabled={userId === currentId}
        onValueChange={handleChangeRole}
      >
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="w-32">
          <SelectItem value="member">member</SelectItem>
          <SelectItem value="manager">manager</SelectItem>
          <SelectItem value="admin">admin</SelectItem>
        </SelectContent>
      </Select>
    </>
  );
};

export default SelectRole;
