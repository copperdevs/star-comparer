import {
  localGetItem,
  localSetItem,
  removeDuplicates,
  simplifyText,
} from "@/lib";
import { TextField } from "@radix-ui/themes";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface UserListProps {
  users: string[];
  setUsers: (users: string[]) => void;
}

export default function UserList({ users, setUsers }: UserListProps) {
  const [usernameValue, setUsernameValue] = useState("");
  const [usedUsers, setUsedUsers] = useState<string[]>([]);

  useEffect(() => {
    setUsedUsers(localGetItem<string[]>("used-users") ?? []);
  }, []);

  function handleUsernameChange(event: React.ChangeEvent<HTMLInputElement>) {
    setUsernameValue(simplifyText(event.target.value));
  }

  function handleUsernameKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (usernameValue === "") return;

    if (event.key === "Enter") {
      addUser();
      setUsernameValue("");
    }
  }

  async function addUser() {
    // duplicate user check
    if (
      users.some(
        (username) => username.toLowerCase() === usernameValue.toLowerCase()
      )
    ) {
      toast.warning("User already added");
      return;
    }

    setUsers([...users, usernameValue]);

    localSetItem(
      "used-users",
      removeDuplicates([
        ...(localGetItem<string[]>("used-users") ?? []),
        usernameValue,
      ])
    );
  }

  return (
    <>
      <TextField.Root
        placeholder="Add a user..."
        value={usernameValue}
        onChange={handleUsernameChange}
        onKeyDown={handleUsernameKeyDown}
        className="spacer vertical"
        id="username-presets"
        list="username-presets-list"
      >
        <TextField.Slot>
          <Search size="18" />
        </TextField.Slot>
      </TextField.Root>
    </>
  );
}
