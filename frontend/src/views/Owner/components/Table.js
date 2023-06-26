/* eslint-disable no-restricted-syntax */
/* eslint-disable no-else-return */
/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import {
  Alert,
  Text,
  Button,
  VStack,
  View,
  Divider,
  HStack,
  Pressable,
} from "native-base";
import React, { useMemo, useState, Suspense } from "react";

import { globalState } from "../../../state";

const OccupiedTime = React.lazy(() => import("./OccupiedTime"));

function Table({ table, ...props }) {
  const activeOrders = (orders) =>
    orders.reduce((accumulator, order) => {
      if (order.status === "recieved") accumulator.push(order);
      return accumulator;
    }, []);
  const flattenOrderItems = (orders) => orders.flatMap((order) => order.items);
  const flattenVariations = (orders) =>
    orders.flatMap((order) => order.variations);

  const removeRecipesBasedOnVariations = (items, variations) =>
    items.map((item) => {
      // loop through each variation and if item id === variation id,
      // remove all the recipes except the one that matches the variation
      // then substract 1 from variation.qty
      if (item.recipe.length === 0) {
        return item;
      }

      variations.forEach((variation) => {
        if (variation.qty === 0) return;
        const newRecipe = item.recipe.find((currentRecipe) => {
          if (currentRecipe._id === variation.recipe) {
            variation.qty -= 1;
            return true;
          }
          return false;
        });
        if (newRecipe) item.recipe = [newRecipe];
      });

      return item;
    });

  const groupItemsByIdAndRecipe = (items) =>
    items.reduce((acc, currentItem) => {
      // Create a key based on _id and recipe[0]._id (if it exists)
      const key =
        currentItem._id +
        (currentItem.recipe[0] ? currentItem.recipe[0]._id : "");

      // If the key already exists, increment qty, else create a new entry
      if (acc[key]) {
        acc[key].qty += 1;
      } else {
        acc[key] = {
          id: currentItem._id,
          qty: 1,
          name: currentItem.name,
          recipe: currentItem.recipe[0] || null,
        };
      }

      return acc;
    }, {});

  const [tab, setTab] = useState(null);
  const [groupedItems, setGroupedItems] = useState([]);

  const state = globalState();
  const { tableNo, currentTab } = table;

  useMemo(() => {
    if (!table.currentTab) return;
    setTab(JSON.parse(JSON.stringify(table.currentTab)));
  }, [table]);

  useMemo(() => {
    if (!tab) return;
    const orders = activeOrders(tab.orders);

    const items = flattenOrderItems(orders);
    const variations = flattenVariations(orders);
    const itemsWithRecipes = removeRecipesBasedOnVariations(items, variations);
    setGroupedItems(Object.values(groupItemsByIdAndRecipe(itemsWithRecipes)));
  }, [tab]);

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
              <Suspense fallback={<div>Loading...</div>}>
                <OccupiedTime key={tableNo} timestamp={currentTab.createdAt} />
              </Suspense>
            ) : (
              "No current tab"
            )}
          </Text>

          {currentTab && (
            <View>
              <Divider bg="rgba(255,255,255,.2)" thickness="2" />
              <Divider bg="transparent" thickness="10" />
              <Text color="text.light" bold fontSize="sm">
                {currentTab.orders.length ? "LATEST ORDERS" : "NO ORDERS"}
              </Text>
              <Divider bg="transparent" thickness="5" />
              <Pressable
                onPress={() => {
                  state.selectedTable = JSON.parse(JSON.stringify(table));
                  state.ownerView = "orders";
                }}
              >
                <VStack space={1} flexShrink={1} w="100%">
                  {groupedItems.map((item) => (
                    <HStack
                      key={item.recipe?.name || item.name}
                      width="100%"
                      justifyContent="space-between"
                    >
                      <Text color="text.light" fontSize="sm">
                        {item.qty} x
                      </Text>
                      <Text color="text.light" fontSize="sm">
                        {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                        {item.recipe ? ` (${item.recipe.name})` : null}
                      </Text>
                    </HStack>
                  ))}
                </VStack>
              </Pressable>
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
