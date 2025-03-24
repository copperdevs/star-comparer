import {
  Avatar,
  Card,
  Flex,
  Heading,
  IconButton,
  Link,
  Skeleton,
  Text,
  Grid,
  HoverCard,
} from "@radix-ui/themes";
import {
  getAllUserStars,
  sessionGetItem,
  userExists,
  type UserStorage,
} from "@/lib";
import { Star, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import InputBox from "./InputBox";

interface UserListProps {
  users: string[];
  setUsers: (users: string[]) => void;
}

export default function UserList({ users, setUsers }: UserListProps) {
  function removeUser(username: string) {
    setUsers(users.filter((user) => user !== username));
  }

  return (
    <div>
      <InputBox users={users} setUsers={setUsers} />

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
  const [userStorage, setUserStorage] = useState<UserStorage>(
    {} as UserStorage
  );

  const getUser = async () => {
    try {
      setLoading(true);

      const existsData = await userExists(username);
      setExists(existsData.data);

      if (!existsData.data) {
        toast.error(`User ${username} does not exist`);
        onRemove(username);
        return;
      }

      const starsData = await getAllUserStars(username);

      if (starsData.hasError) {
        onRemove(username);
        return;
      }

      const item = sessionGetItem<UserStorage>(username);
      if (item) setUserStorage(item);
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
                <Heading className="selectable">
                  {userStorage.stars ?? -1}
                </Heading>
              </Flex>
            </Skeleton>
          </Card>
          <HoverCard.Root>
            <Card style={{ flex: 1 }}>
              <Flex width="100%" gap="2" align="center" justify="between">
                <Flex gap="2" align="center">
                  <Avatar
                    size="2"
                    fallback={
                      (userStorage.displayUsername ?? username ?? "???")[0]
                    }
                    src={`https://avatars.githubusercontent.com/${username}`}
                    radius={
                      userStorage.userType === "User"
                        ? "full"
                        : userStorage.userType === "Organization"
                          ? "large"
                          : "none"
                    }
                  />
                  <HoverCard.Trigger>
                    <Link
                      href={`https://github.com/${username}`}
                      target="_blank"
                    >
                      <Text size="4" weight="bold" className="selectable">
                        {userStorage.displayUsername ?? username}
                      </Text>
                    </Link>
                  </HoverCard.Trigger>
                </Flex>
                <IconButton variant="soft" onClick={() => onRemove(username)}>
                  <Trash2 size="18" />
                </IconButton>
              </Flex>
            </Card>
            <HoverCard.Content>
              <Text size="3" className="selectable">
                {`Display name: ${userStorage.displayUsername}`} <br />
                {`Username: ${username}`}
              </Text>
            </HoverCard.Content>
          </HoverCard.Root>
        </Flex>
      )}
    </div>
  );
}
