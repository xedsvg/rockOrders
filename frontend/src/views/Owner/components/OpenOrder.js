/* eslint-disable no-plusplus */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import {
  Pressable,
  View,
  Text,
  Button,
  Divider,
  Alert,
  VStack,
  HStack,
} from "native-base";
import React from "react";

import { toastEmitter } from "../../../components/Toast";
import { globalState } from "../../../state";

const getItemsWithQuantities = (items) => {
  const itemsMap = {};

  items.forEach((item) => {
    if (itemsMap[item.name]) {
      itemsMap[item.name]++;
    } else {
      itemsMap[item.name] = 1;
    }
  });

  return Object.entries(itemsMap).map(([name, quantity]) => ({
    name,
    quantity,
  }));
};

function OpenOrder({ order, index, ...props }) {
  const state = globalState();

  const items = getItemsWithQuantities(order.items);

  return (
    <Pressable
      {...props}
      key={order._id}
      onLongPress={() => {
        state.selectedTable = order.tabId.tableId._id;
        toastEmitter.emit("showToast", {
          title: "View mode changed",
          description: "If you want to exit table view, press the order again.",
        });
      }}
      onPress={() => {
        state.selectedTable = null;
        toastEmitter.emit("showToast", {
          title: "View mode changed",
          description:
            "If you want to view all the orders from the table, long press the order.",
        });
      }}
    >
      <Alert
        maxWidth="100%"
        flexDirection="row"
        bg="brand.700"
        variant="active"
        mr={5}
        p="1rem"
      >
        <VStack space={1} flexShrink={1} w="100%">
          {/* Card header */}
          <HStack justifyContent="space-between">
            <Text
              color="text.light"
              fontSize="md"
              fontWeight="medium"
              flexShrink={1}
            >
              Table #{order.tabId.tableId.tableNo}
            </Text>
            <VStack alignItems="flex-end">
              <Text color="text.light" fontSize="xs">
                {order.status}
              </Text>
              <Text color="text.light" fontSize="xs">
                {order.lastUpdated.substring(11, 16)}
              </Text>
            </VStack>
          </HStack>

          {/* Card body */}

          {items.map(({ name, quantity }) => (
            <View flexDir="row" justifyContent="space-between" key={name}>
              <Text color="text.light">
                {quantity}x {name}
              </Text>
            </View>
          ))}

          <View flexDir="row" justifyContent="space-between">
            <Text color="text.light">Total:</Text>
            <Text color="text.light">{order.totalAmount}</Text>
          </View>

          <Divider bg="transparent" thickness="6" />
          {/* Card buttons */}
          <Button
            width="100%"
            size="md"
            variant="outline"
            alignSelf="center"
            onPress={() => {}}
          >
            Prepare order 🍽
          </Button>
          <Button
            width="100%"
            size="md"
            variant="outline"
            alignSelf="center"
            onPress={() => {}}
          >
            Take order to table 🚚
          </Button>
          <Button
            width="100%"
            size="md"
            variant="outline"
            alignSelf="center"
            onPress={async () => {
              // changeStatusHandler(item._id, "canceled");
            }}
          >
            Cancel order ❌
          </Button>
        </VStack>
      </Alert>
    </Pressable>
  );
}

export default OpenOrder;
