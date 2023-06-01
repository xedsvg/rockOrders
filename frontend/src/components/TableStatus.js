import { Box, HStack, Avatar, VStack, Text } from "native-base";
import React from "react";

import WelcomeMessage from "./WelcomeMessage";
import { globalState } from "../state";

const waiter =
  "https://previews.123rf.com/images/soponpotsit/soponpotsit1605/soponpotsit160500016/56991666-modern-flat-business-qr-code-icons-with-long-shadow-effect.jpg";

function TableStatus() {
  const { tableNr } = globalState();

  return (
    <Box pl="4" pr="5" py="2">
      <HStack alignItems="center" space={3}>
        <Avatar size="md" source={{ uri: waiter }} />
        <VStack>
          <WelcomeMessage color="text.light" />
          <Text color="text.light" bold>
            You are seated at Table #{tableNr}
          </Text>
        </VStack>
      </HStack>
    </Box>
  );
}

export default TableStatus;
