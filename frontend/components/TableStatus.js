import React, { useEffect } from "react";

import { Box, HStack, Avatar, VStack, Text } from "native-base";

import waiter from "../assets/icons/waiter.svg";

export default function TableStatus({}) {
  useEffect(() => {}, []);

  return (
    <Box pl="4" pr="5" py="2">
      <HStack alignItems="center" space={3}>
        <Avatar size="48px" source={{ uri: waiter }} />
        <VStack>
          <Text color="coolGray.800" _dark={{ color: "warmGray.50" }} bold>
            You are seated at table 50
          </Text>
          <Text color="coolGray.600" _dark={{ color: "warmGray.200" }}>
            Serving you: Ioana
          </Text>
        </VStack>
      </HStack>
    </Box>
  );
}
