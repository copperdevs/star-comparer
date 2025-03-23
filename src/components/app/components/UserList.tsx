import {
  Avatar,
  Card,
  Flex,
  Heading,
  IconButton,
  Link,
  Skeleton,
  TextField,
  Text,
  Grid,
  HoverCard,
} from "@radix-ui/themes";
import { getAllUserStars, userExists, simplifyText, type Data } from "@/lib";
import { Search, Star, Trash2 } from "lucide-react";
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
      toast.warning("User already added");
      return;
    }

    setUsers([...users, usernameValue]);
  }

  function removeUser(username: string) {
    setUsers(users.filter((user) => user !== username));
  }

  return (
    <div>
      <TextField.Root
        placeholder="Add a user..."
        value={usernameValue}
        onChange={handleUsernameChange}
        onKeyDown={handleUsernameKeyDown}
        className="spacer vertical"
      >
        <TextField.Slot>
          <Search size="18" />
        </TextField.Slot>
      </TextField.Root>

      <Grid gap="2">
        {users.map((user) => (
          <User key={user} username={user} onRemove={removeUser} />
        ))}
      </Grid>
    </div>
  );
}

interface UserProps {
  username: string;
  onRemove: (username: string) => void;
}

function User({ username, onRemove }: UserProps) {
  const [isLoading, setLoading] = useState(true);
  const [exists, setExists] = useState(false);
  const [stars, setStars] = useState(-1);

  const getUser = async () => {
    try {
      setLoading(true);

      const existsData = await userExists(username);
      setExists(existsData.data);

      if (!existsData.data) {
        toast.error(`User ${username} does not exist`);
        onRemove(username);
      }

      const starsData = await getAllUserStars(username);
      setStars(starsData.data);

      if (starsData.hasError) {
        onRemove(username);
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
      {exists && (
        <Flex width="100%" gap="2" align="center" justify="between">
          <Card>
            <Skeleton loading={isLoading}>
              <Flex gap="2" align="center" className="center">
                <Star />
                <Heading className="selectable">{stars ?? -1}</Heading>
              </Flex>
            </Skeleton>
          </Card>
          <Card style={{ flex: 1 }}>
            <Flex width="100%" gap="2" align="center" justify="between">
              <Flex gap="2" align="center">
                <Avatar
                  size="2"
                  fallback={(username ?? "?")[0]}
                  src={`https://avatars.githubusercontent.com/${username}`}
                />
                <Link href={`https://github.com/${username}`} target="_blank">
                  <Text size="4" weight="bold" className="selectable">
                    {username}
                  </Text>
                </Link>
              </Flex>
              <IconButton variant="soft" onClick={() => onRemove(username)}>
                <Trash2 size="18" />
              </IconButton>
            </Flex>
          </Card>
        </Flex>
      )}
    </div>
  );
}
