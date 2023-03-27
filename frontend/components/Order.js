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
  Divider
} from "native-base";

export default function Order({ cart, order }) {
  if (order) {
    cart = order.items;
    order.total = 0;
    // map reduce the cart so that same items are grouped together and have a qty property and a total price
    cart = cart.reduce((acc, item) => {
      const existingItem = acc.find((i) => i._id === item._id);
      order.total += item.price;
      if (existingItem) {
        existingItem.qty += 1;
        existingItem.totalPrice += item.price;
        return acc;
      } else {
        item.qty = 1;
        item.totalPrice = item.price;
        return [...acc, item];
      }
    }
      , []);
  }

  const sendOrder = () => {
    alert("send cart clicked");
  }

  if (cart) {
    return (
      <VStack space={4} alignItems="center" marginBottom="2.5">
        <Box alignItems="center" w="full">
          <Pressable w="full">
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
                  bcartWidth="1"
                  bcartColor="coolGray.300"
                >
                  <HStack alignItems="center">
                    <Badge
                      colorScheme={order?.status === 'recieved' ? "success" : "warning"}
                      _text={{
                        color: "white",
                      }}
                      variant="solid"
                      rounded="4"
                    >
                      {order?.status ? order.status[0].toUpperCase() + order.status.slice(1) : "Not sent"}
                    </Badge>
                    <Spacer />
                    <Text fontSize={10} color="coolGray.800">
                      {order?.lastUpdated ? order.lastUpdated.split("T")[1].split(".")[0] : "now"}
                    </Text>
                  </HStack>
                  <Text
                    color="coolGray.800"
                    mt="3"
                    fontWeight="medium"
                    fontSize="xl"
                  >
                    {order?.nr ? `Order #${order.nr}` : "Current order"}
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
                  <Divider bg="transparent" thickness="10" />
                  <Divider bg="black" thickness="1" />
                  <View flexDirection="row" justifyContent="space-between" key="total">
                    <Text mt="2" fontSize="sm" color="coolGray.700">
                      Total:
                    </Text>

                    <Text mt="2" fontSize="sm" color="coolGray.700">
                      {order?.total || cart.reduce((total, cartItem) => total += cartItem.price * cartItem.qty, [])} RON
                    </Text>
                  </View>
                  {!order?.status &&
                    <View>
                      <Divider bg="transparent" thickness="10" />
                      <HStack justifyContent="space-between">
                        <Button colorScheme="warning"> Add details</Button>
                        <Button colorScheme="success" onPress={sendOrder}> Send Order!</Button>
                      </HStack>
                    </View>
                  }

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
          <Pressable w="full">
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
                    cart nr #0
                  </Text>
                  <Text mt="2" fontSize="sm" color="coolGray.700">
                    Details: Your carts will appear here!
                  </Text>
                </Box>
              );
            }}
          </Pressable>
        </Box>
      </VStack>
    );
}
