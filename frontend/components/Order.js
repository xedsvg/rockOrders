import React from "react";

import {
  Box,
  Pressable,
  Badge,
  HStack,
  VStack,
  Spacer,
  Text,
  View,
  Divider
} from "native-base";

const Order = ({ order, orderNr }) => {
  const mutableItems = JSON.parse(JSON.stringify(order.items));

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
                    colorScheme={order.status === 'recieved' ? "info" : order.status === "canceled" ? "error" : "success"}
                    _text={{
                      color: "white",
                    }}
                    variant="solid"
                    rounded="4"
                  >
                    {order.status}
                  </Badge>
                  <Spacer />
                  <Text fontSize={10} color="coolGray.800">
                    {order.lastUpdated}
                  </Text>
                </HStack>
                <Text
                  color="coolGray.800"
                  mt="3"
                  fontWeight="medium"
                  fontSize="xl"
                >
                  {`Order #${orderNr}`}
                </Text>
                {mutableItems.reduce((acc, item) => {
                  const existingItem = acc.find((i) => i._id === item._id);
                  if (existingItem) {
                    existingItem.qty += 1;
                    return acc;
                  } else {
                    item.qty = 1;
                    return acc.concat(item);
                  }
                }, []).map((orderedItem) => (
                  <View flexDirection="row" justifyContent="space-between" key={orderedItem._id}>
                  <Text mt="2" fontSize="sm" color="coolGray.700">
                    {orderedItem.qty} x {orderedItem.name}
                  </Text>

                  <Text mt="2" fontSize="sm" color="coolGray.700">
                    {orderedItem.price * orderedItem.qty} RON
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
                    {order.totalAmount} RON
                  </Text>
                </View>
              </Box>
            );
          }}
        </Pressable>
      </Box>
    </VStack>
  );
}

export default Order;