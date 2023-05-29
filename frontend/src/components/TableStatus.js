import React from "react";
import { globalState } from "../state";
import { Box, HStack, Avatar, VStack, Text } from "native-base";

import waiter from "../../assets/icons/waiter.svg";

const TableStatus = () => {
  const { tableNr } = globalState();

  return (
    <Box pl="4" pr="5" py="2">
      <HStack alignItems="center" space={3}>
        <Avatar size="48px" source={{ uri: waiter }} />
        <VStack>
          <Text color="text.light" color="coolGray.800" _dark={{ color: "warmGray.50" }} bold>
            You are seated at table #{tableNr}
          </Text>
          <Text color="text.light" color="coolGray.600" _dark={{ color: "warmGray.200" }}>
            Serving you: Ioana
          </Text>
        </VStack>
      </HStack>
    </Box>
  );
}

export default TableStatus;