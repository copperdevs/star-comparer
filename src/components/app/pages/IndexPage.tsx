import { goTo, type PageProps } from "@/lib";
import { BaseAppLayout } from "@/components/app/layouts/BaseAppLayout";
import { Box, Button, Grid, Heading, Separator } from "@radix-ui/themes";
import { Calculator, Github } from "lucide-react";

export default function IndexPage({ props }: { props: PageProps }) {
  return (
    <BaseAppLayout props={props}>
      <div className="pagecenter scrollable">
        <div className="contentcenter">
          <div className="content">
            <Heading align="center">Coppers Base Astro </Heading>
            <Box width="25%" className="center spacer vertical">
              <Separator size="4" />
            </Box>
            <Grid gap="3" width="25%" className="center">
              <Button
                variant="soft"
                onClick={() => goTo("https://github.com/copperdevs/base-astro")}
              >
                <Github size="18" /> Source Code
              </Button>

              <Button variant="soft" onClick={() => goTo("/counter")}>
                <Calculator size="18" /> Counter Example
              </Button>
            </Grid>
          </div>
        </div>
      </div>
    </BaseAppLayout>
  );
}
