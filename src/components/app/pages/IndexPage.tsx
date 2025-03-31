import {
  copyToClipboard,
  getUrl,
  goToNewPage,
  setURL,
  type PageProps,
} from "@/lib";
import { BaseAppLayout } from "@/components/app/layouts/BaseAppLayout";
import { Box, Button, Grid, Heading, Separator } from "@radix-ui/themes";
import { Github, X, Link } from "lucide-react";
import UserList from "@app/components/UserList";
import { useEffect, useState } from "react";

export default function IndexPage({ props }: { props: PageProps }) {
  const [users, setUsers] = useState<string[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const singleUser = params.get("user");
    const multipleUsers = params.get("users");

    if (multipleUsers) {
      const userArray = multipleUsers.split(",").filter((u) => u.trim());
      setUsers(userArray);
    } else if (singleUser) {
      setUsers([singleUser]);
    }
  }, []);

  return (
    <BaseAppLayout props={props}>
      <div className="pagecenter scrollable">
        <div className="contentcenter">
          <div className="content">
            <Heading align="center" className="selectable">
              Star Comparer
            </Heading>
            <Box width="95%" className="center ">
              <Separator size="4" className="spacer vertical" />

              <Grid columns="3" gap="2" className="center">
                <Button
                  variant="soft"
                  onClick={() =>
                    goToNewPage("https://github.com/copperdevs/star-comparer")
                  }
                  className="full width"
                >
                  <Github size="18" /> Source Code
                </Button>
                <Button
                  variant="soft"
                  className="full width"
                  onClick={() => {
                    setURL(getUrl([]));
                    return setUsers([]);
                  }}
                  disabled={!users.length}
                >
                  <X size="18" /> Clear Users
                </Button>
                <Button
                  variant="soft"
                  className="full width"
                  onClick={() => copyToClipboard(getUrl(users))}
                  disabled={!users.length}
                >
                  <Link size="18" /> Copy Link
                </Button>
              </Grid>

              <Separator size="4" className="spacer vertical" />

              <UserList
                users={users}
                setUsers={(users) => {
                  setURL(getUrl(users));
                  return setUsers(users);
                }}
              />
            </Box>
          </div>
        </div>
      </div>
    </BaseAppLayout>
  );
}
