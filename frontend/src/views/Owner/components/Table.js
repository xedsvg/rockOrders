import {
  Alert,
  Text,
  Button,
  VStack,
  View,
  Divider,
  HStack,
} from "native-base";
import React from "react";

import OccupiedTime from "./OccupiedTime";
import { globalState } from "../../../state";

function Table({ table, ...props }) {
  const state = globalState();

  const { tableNo, currentTab } = table;

  return (
    <View key={table._id} {...props}>
      <Alert
        maxWidth="100%"
        flexDirection="row"
        bg="brand.700"
        variant={currentTab ? "active" : "open"}
        mr={5}
      >
        <VStack space={1} flexShrink={1} w="100%">
          <Text
            color="text.light"
            fontSize="md"
            fontWeight="medium"
            flexShrink={1}
          >
            Table {tableNo}
          </Text>
          <Text color="text.light" fontSize="xs">
            {currentTab ? (
              <OccupiedTime key={tableNo} timestamp={currentTab.createdAt} />
            ) : (
              "No current tab"
            )}
          </Text>

          {currentTab && (
            <View>
              <Divider bg="rgba(255,255,255,.2)" thickness="2" />
              <Divider bg="transparent" thickness="10" />
              <Text color="text.light" bold fontSize="sm">
                {currentTab.orders.length ? "ORDERS" : "NO ORDERS"}
              </Text>
              <VStack space={1} flexShrink={1} w="100%">
                {currentTab.orders
                  .flatMap((order) => order.items)
                  .reduce((accumulator, currentItem) => {
                    const existingItem = accumulator.find(
                      (item) => item.id === currentItem._id
                    );

                    if (existingItem) {
                      existingItem.qty += 1;
                    } else {
                      accumulator.push({
                        id: currentItem._id,
                        qty: 1,
                        name: currentItem.name,
                      });
                    }

                    return accumulator;
                  }, [])
                  .map((item) => (
                    <HStack
                      key={item.id}
                      width="100%"
                      justifyContent="space-between"
                    >
                      <Text color="text.light" fontSize="sm">
                        {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                      </Text>
                      <Text color="text.light" fontSize="sm">
                        x{item.qty}
                      </Text>
                    </HStack>
                  ))}
              </VStack>
              <Divider bg="transparent" thickness="10" />
              <Divider bg="rgba(255,255,255,.2)" thickness="2" />
            </View>
          )}

          <Divider bg="transparent" thickness="6" />
          <Button
            width="100%"
            size="md"
            variant={currentTab ? "outline" : "solid"}
            alignSelf="center"
            onPress={() => {}}
          >
            Table Options
          </Button>
        </VStack>
      </Alert>
    </View>
  );
}

export default Table;
