import React from "react";

import {
  Box,
  Pressable,
  Badge,
  HStack,
  VStack,
  Spacer,
  Text,
  Button,
  View,
} from "native-base";

export default function Order({ cart, order }) {
  if (cart) {
    return (
      <VStack space={4} alignItems="center" marginBottom="2.5" minWidth="85%">
        <Box alignItems="center">
          <Pressable maxW="96">
            {({ isHovered, isPressed }) => {
              return (
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
                  borderWidth="1"
                  borderColor="coolGray.300"
                >
                  <HStack alignItems="center">
                    <Badge
                      colorScheme="warning"
                      _text={{
                        color: "white",
                      }}
                      variant="solid"
                      rounded="4"
                    >
                      Open order
                    </Badge>
                    <Spacer />
                    <Text fontSize={10} color="coolGray.800">
                      now
                    </Text>
                  </HStack>
                  <Text
                    color="coolGray.800"
                    mt="3"
                    fontWeight="medium"
                    fontSize="xl"
                  >
                    Current order
                  </Text>
                  {cart.map((cartItem) => (
                    <View flexDirection="row" justifyContent="space-between" key={cartItem._id}>
                      <Text mt="2" fontSize="sm" color="coolGray.700">
                        {cartItem.qty} x {cartItem.name}
                      </Text>
                      
                      <Text mt="2" fontSize="sm" color="coolGray.700">
                        {cartItem.price * cartItem.qty} RON
                      </Text>
                    </View>
                  ))}
                  <Button colorScheme="success"> Send Order!</Button>
                </Box>
              );
            }}
          </Pressable>
        </Box>
      </VStack>
    );
  } else
    return (
      <VStack space={4} alignItems="center" marginBottom="2.5">
        <Box alignItems="center">
          <Pressable maxW="96">
            {({ isHovered, isPressed }) => {
              return (
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
                  borderWidth="1"
                  borderColor="coolGray.300"
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
                    <Text fontSize={10} color="coolGray.800">
                      5 minutes ago
                    </Text>
                  </HStack>
                  <Text
                    color="coolGray.800"
                    mt="3"
                    fontWeight="medium"
                    fontSize="xl"
                  >
                    Order nr #0
                  </Text>
                  <Text mt="2" fontSize="sm" color="coolGray.700">
                    Details: Your orders will appear here!
                  </Text>
                </Box>
              );
            }}
          </Pressable>
        </Box>
      </VStack>
    );
}
