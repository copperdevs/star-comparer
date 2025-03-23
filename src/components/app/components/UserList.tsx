import {
  Avatar,
  Button,
  Card,
  Flex,
  Heading,
  IconButton,
  Skeleton,
  TextField,
} from "@radix-ui/themes";
import { Plus, Search, Star, Trash2 } from "lucide-react";
import {
  getAllUserStars,
  simplifyText,
  userExists,
  type UserData,
} from "@/lib";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface UserListProps {
  users: string[];
  setUsers: (users: string[]) => void;
}

export default function UserList({ users, setUsers }: UserListProps) {
  const [usernameValue, setUsernameValue] = useState("");
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
      toast.error("User already added");
      return;
    }

    // user does not exist, don't add them to the list
    if (!(await userExists(usernameValue))) {
      toast.error(`User ${usernameValue} not found`);
      return;
    }

    setUsers([...users, usernameValue]);
  }

  function removeUser(username: string) {
    setUsers(users.filter((user) => user !== username));
  }

  return (
    <div>
      {users.map((user) => (
        <User key={user} username={user} onRemove={removeUser} />
      ))}

      <TextField.Root
        placeholder="Add a user..."
        value={usernameValue}
        onChange={handleUsernameChange}
        onKeyDown={handleUsernameKeyDown}
      >
        <TextField.Slot>
          <Search size="18" />
        </TextField.Slot>
      </TextField.Root>
    </div>
  );
}

interface UserProps {
  username: string;
  onRemove: (username: string) => void;
}

function User({ username, onRemove }: UserProps) {
  const [isLoading, setLoading] = useState(true);
  const [user, setUser] = useState<UserData>({} as UserData);

  const getUser = async () => {
    try {
      setLoading(true);

      if (await userExists(username)) {
        const stars = await getAllUserStars(username);
        setUser({ username: username, stars: stars } as UserData);
      } else {
        toast.error(`User ${username} not found`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div>
      <Flex width="100%" gap="2" align="center" justify="between">
        <Card className="spacer vertical">
          <Flex gap="2" align="center" className="center">
            <Star />
            <Skeleton loading={isLoading}>
              <Heading>{user.stars ?? -1}</Heading>
            </Skeleton>
          </Flex>
        </Card>
        <Card style={{ flex: 1 }} className="spacer vertical">
          <Flex width="100%" gap="2" align="center" justify="between">
            <Flex gap="2" align="center">
              <Skeleton loading={isLoading}>
                <Avatar
                  size="2"
                  fallback={
                    isLoading ? ((user.username ?? "?")[0] ?? "?") : "?"
                  }
                  src={`https://avatars.githubusercontent.com/${username}`}
                />
              </Skeleton>
              <Skeleton loading={isLoading}>
                <Heading>{user.username}</Heading>
              </Skeleton>
            </Flex>
            <IconButton variant="soft" onClick={() => onRemove(user.username)}>
              <Trash2 size="18" />
            </IconButton>
          </Flex>
        </Card>
      </Flex>
    </div>
  );
}
