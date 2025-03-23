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
import {
  getAllUserStars,
  simplifyText,
  userExists,
  type Data,
  type UserData,
} from "@/lib";
import { CircleAlert, Search, Star, Trash2 } from "lucide-react";
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
  const [userData, setUserData] = useState<Data<UserData>>();

  const getUser = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/${username}.json`);
      const json = (await response.json()) as Data<UserData>;
      setUserData(json);
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
        <HoverCard.Root>
          <HoverCard.Trigger>
            <Card>
              <Skeleton loading={userData?.hasError}>
                <Flex gap="2" align="center" className="center">
                  <Star />
                  <Heading className="selectable">
                    {userData?.data.stars ?? -1}
                  </Heading>
                </Flex>
              </Skeleton>
            </Card>
          </HoverCard.Trigger>
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
          <HoverCard.Content>
            <pre style={{ margin: 0 }} className="selectable">
              {JSON.stringify(userData, null, 2)}
            </pre>
          </HoverCard.Content>
        </HoverCard.Root>
      </Flex>
    </div>
  );
}
