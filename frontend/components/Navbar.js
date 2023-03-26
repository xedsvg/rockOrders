import React from "react";

import { Text, HStack, Center } from "native-base";

export default function Navbar({ restaurantName, children }) {
  return (
    <HStack
      bg="brand.800"
      minH="10vh"
      w="full"
      space={3}
      justifyContent="center"
      marginBottom="3vh"
      zIndex={0}
    >
      {children ? (
        children
      ) : (
        <Center w="20" rounded="md" >
          <Text color="gray.100">{restaurantName}</Text>
        </Center>
      )}
    </HStack>
  );
}
