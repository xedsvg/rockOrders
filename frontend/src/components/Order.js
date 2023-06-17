/* eslint-disable no-plusplus */
/* eslint-disable no-restricted-syntax */
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

const composeItemsFromVariations = (stateOrder) => {
  const order = JSON.parse(JSON.stringify(stateOrder));
  const { items, variations } = order;
  const updatedItems = [];

  // Iterate over the variations
  for (const variant of variations) {
    // Iterate over the quantity
    while (variant.qty > 0) {
      const item = items.find((i) => i._id === variant.id);
      const newItem = JSON.parse(JSON.stringify(item));
      // Move the item so we don't loop over it again
      const itemIndex = items.indexOf(item);
      order.items.splice(itemIndex, 1);

      // Update the recipe and quantity
      newItem.recipe = newItem.recipe.filter(
        (recipe) => recipe._id === variant.recipe
      );
      newItem.cartQty = 1;
      variant.qty -= 1;

      // Add the updated item to the result
      updatedItems.push(newItem);
    }
  }

  // Add the new items to the order
  order.items.push(...updatedItems);

  order.items = order.items.reduce((acc, item) => {
    const existingItem = acc.find((i) =>
      i.type === "product"
        ? i._id === item._id
        : i._id === item._id && i.recipe[0]._id === item.recipe[0]._id
    );
    if (existingItem) {
      existingItem.cartQty += 1;
      return acc;
    }
    // eslint-disable-next-line no-param-reassign
    item.cartQty = 1;
    return acc.concat(item);
  }, []);

  return order;
};

function Order({ order, orderNr }) {
  const mutableItems = composeItemsFromVariations(order).items;

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
            {mutableItems.map((orderedItem) =>
              orderedItem.type === "product" ? (
                <View
                  flexDirection="row"
                  justifyContent="space-between"
                  key={orderedItem._id}
                >
                  <Text color="text.light" mt="2" fontSize="sm">
                    {orderedItem.cartQty}x{" "}
                  </Text>
                  <Text color="text.light" mt="2" fontSize="sm">
                    {orderedItem.name}
                  </Text>
                  <Text
                    color="text.light"
                    mt="2"
                    fontSize="sm"
                    flexGrow={1}
                    textAlign="end"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    {orderedItem.price * orderedItem.cartQty} RON
                  </Text>
                </View>
              ) : (
                <View
                  flexDirection="row"
                  justifyContent="space-between"
                  key={`${orderedItem._id}_${orderedItem.recipe[0].name}`}
                >
                  <Text color="text.light" mt="2" fontSize="sm">
                    {orderedItem.cartQty}x{" "}
                  </Text>
                  <View
                    flexDirection="column"
                    justifyContent="space-between"
                    flexGrow={1}
                  >
                    <Text color="text.light" mt="2" fontSize="sm">
                      {orderedItem.name}
                    </Text>

                    <Text
                      color="text.light"
                      mt="2"
                      fontSize="xs"
                      marginTop="0.2rem"
                    >
                      -{orderedItem.recipe[0].name}
                    </Text>
                  </View>
                  <Text
                    color="text.light"
                    mt="2"
                    fontSize="sm"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    {orderedItem.recipe[0].price * orderedItem.cartQty} RON
                  </Text>
                </View>
              )
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
