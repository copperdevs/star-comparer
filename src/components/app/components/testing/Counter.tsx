import { Box, Button, Grid, Heading, Separator, Text } from "@radix-ui/themes";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";

export default function Counter() {
  const [counter, setCounter] = useState(0);
  return (
    <Box width="100%">
      <Heading align="center" size="8" className="selectable">
        Value:{" "}
        <Text
          color={counter > 0 ? "green" : counter < 0 ? "red" : "gray"}
          className="selectable"
        >
          {counter}
        </Text>
      </Heading>
      <Box width="25%" className="center spacer bottom">
        <Separator size="4" />
      </Box>
      <Grid gap="3" columns="2" width="25%" className="center">
        <Button
          size="2"
          color="green"
          onClick={() => setCounter(counter + 1)}
          variant="soft"
        >
          <Plus /> Add
        </Button>

        <Button
          color="red"
          onClick={() => setCounter(counter - 1)}
          variant="soft"
        >
          <Minus /> Remove
        </Button>
      </Grid>
    </Box>
  );
}
