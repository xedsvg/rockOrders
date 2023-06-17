/* eslint-disable no-nested-ternary */
import {
  View,
  VStack,
  Circle,
  Pressable,
  Heading,
  Text,
  Center,
} from "native-base";
import React from "react";

import { globalState } from "../state";

const Categories = () => {
  const state = globalState();
  const { categories } = state;

  const sortedCategories = JSON.parse(JSON.stringify(categories)).sort(
    (a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }

      return 0;
    }
  );

  return [
    <Center key="messageKey">
      <Heading marginBottom="2rem" marginTop="2rem" color="text.light" bold>
        What would you like to serve?
      </Heading>
    </Center>,
    <View
      key="categoriesKey"
      flexDirection="row"
      justifyContent="space-between"
      flexWrap="wrap"
      paddingX="1rem"
    >
      {sortedCategories.map((category) => (
        <Pressable
          onPress={() => {
            state.category = category;
            state.currentView = "products";
          }}
          key={Math.round(Math.random() * 1000000000)}
          marginBottom="1rem"
        >
          {({ isHovered, isFocused, isPressed }) => (
            <VStack>
              <Circle
                size="26vw"
                bg={
                  isPressed
                    ? "coolGray.200"
                    : isHovered
                    ? "coolGray.200"
                    : "coolGray.300"
                }
              >
                <Heading color="gray.900">
                  {category.charAt(0).toUpperCase()}
                </Heading>
              </Circle>
              <Center>
                <Text color="text.light">{category}</Text>
              </Center>
            </VStack>
          )}
        </Pressable>
      ))}
    </View>,
  ];
};

export default Categories;
