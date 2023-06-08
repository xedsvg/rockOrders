/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
import {
  Box,
  Pressable,
  Badge,
  HStack,
  VStack,
  Spacer,
  Text,
  View,
  Divider,
} from "native-base";
import React from "react";

import Time from "./Time";

function Order({ order, orderNr }) {
  const mutableItems = JSON.parse(JSON.stringify(order.items));

  return (
    <VStack space={4} alignItems="center" marginBottom="2.5" px="1rem">
      <Box alignItems="center" w="full">
        <Pressable w="full">
          <Box
            bg="brand.800"
            p="5"
            rounded="8"
            shadow={3}
            bcartWidth="1"
            bcartColor="coolGray.300"
          >
            <HStack alignItems="center">
              <Badge
                colorScheme={
                  order.status === "recieved"
                    ? "info"
                    : order.status === "canceled"
                    ? "error"
                    : "success"
                }
                _text={{
                  color: "white",
                }}
                variant="solid"
                rounded="4"
              >
                {order.status}
              </Badge>
              <Spacer />
              <Text color="text.light" fontSize={10}>
                <Time timestamp={order.lastUpdated} />
              </Text>
            </HStack>
            <Text color="text.light" mt="3" fontWeight="medium" fontSize="xl">
              {`Order #${orderNr}`}
            </Text>
            {mutableItems
              .reduce((acc, item) => {
                const existingItem = acc.find((i) => i._id === item._id);
                if (existingItem) {
                  existingItem.qty += 1;
                  return acc;
                }
                // eslint-disable-next-line no-param-reassign
                item.qty = 1;
                return acc.concat(item);
              }, [])
              .map((orderedItem) =>
                orderedItem.type === "product" ? (
                  <View
                    flexDirection="row"
                    justifyContent="space-between"
                    key={orderedItem._id}
                  >
                    <Text color="text.light" mt="2" fontSize="sm">
                      {orderedItem.qty}x {orderedItem.name}
                    </Text>

                    <Text color="text.light" mt="2" fontSize="sm">
                      {orderedItem.price * orderedItem.qty} RON
                    </Text>
                  </View>
                ) : null
              )}

            <Divider bg="transparent" thickness="10" />
            <Divider bg="black" thickness="1" />
            <View
              flexDirection="row"
              justifyContent="space-between"
              key="total"
            >
              <Text color="text.light" mt="2" fontSize="sm">
                Total:
              </Text>

              <Text color="text.light" mt="2" fontSize="sm">
                {order.totalAmount} RON
              </Text>
            </View>
          </Box>
        </Pressable>
      </Box>
    </VStack>
  );
}

export default Order;
