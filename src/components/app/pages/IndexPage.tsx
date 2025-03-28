import { goToNewPage, type PageProps } from "@/lib";
import { BaseAppLayout } from "@/components/app/layouts/BaseAppLayout";
import { Box, Button, Grid, Heading, Separator } from "@radix-ui/themes";
import { Github, X } from "lucide-react";
import UserList from "@app/components/UserList";
import { useEffect, useState } from "react";

export default function IndexPage({ props }: { props: PageProps }) {
  const [users, setUsers] = useState<string[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const user = params.get("user");

    if (!user) return;

    setUsers([...users, user]);
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

              <Grid columns="2" gap="2" className="center">
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
                  onClick={() => setUsers([])}
                  disabled={!users.length}
                >
                  <X size="18" /> Clear Users
                </Button>
              </Grid>

              <Separator size="4" className="spacer vertical" />

              <UserList users={users} setUsers={setUsers} />
            </Box>
          </div>
        </div>
      </div>
    </BaseAppLayout>
  );
}
