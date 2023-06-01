import {
  Box,
  Pressable,
  Badge,
  HStack,
  VStack,
  Spacer,
  Text,
} from "native-base";
import React from "react";

function MockOrder() {
  return (
    <VStack space={4} alignItems="center" marginBottom="2.5">
      <Box alignItems="center">
        <Pressable w="full">
          {({ isHovered, isPressed }) => (
            <Box
              bg={
                isPressed
                  ? "coolGray.200"
                  : isHovered
                  ? "coolGray.200"
                  : "coolGray.100"
              }
              style={{
                transform: [
                  {
                    scale: isPressed ? 0.96 : 1,
                  },
                ],
              }}
              p="5"
              rounded="8"
              shadow={3}
              bcartWidth="1"
              bcartColor="coolGray.300"
            >
              <HStack alignItems="center">
                <Badge
                  colorScheme="green"
                  _text={{
                    color: "white",
                  }}
                  variant="solid"
                  rounded="4"
                >
                  Done!
                </Badge>
                <Spacer />
                <Text color="text.light" fontSize={10} color="coolGray.800">
                  1 minute ago
                </Text>
              </HStack>
              <Text
                color="text.light"
                color="coolGray.800"
                mt="3"
                fontWeight="medium"
                fontSize="xl"
              >
                Order #0
              </Text>
              <Text
                color="text.light"
                mt="2"
                fontSize="sm"
                color="coolGray.700"
              >
                Your orders will appear like this!
              </Text>
            </Box>
          )}
        </Pressable>
      </Box>
    </VStack>
  );
}

export default MockOrder;
