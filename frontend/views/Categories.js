import React from "react";
import {
  View,
  VStack,
  Circle,
  Pressable,
  Heading,
  Text,
  Center,
} from "native-base";
import { globalState } from "../state";

const Categories = () => {
  const state = globalState();

  return [
    <Center>
      <Heading marginBottom="2rem" marginTop="1rem" color="black" bold>
        What would you like to serve?
      </Heading>
    </Center>
    ,
    <View flexDirection="row" justifyContent="space-between" flexWrap="wrap">
      {state.categories.map((category) => (
        <Pressable
          onPress={() => {
            state.category = category
            state.currentView = "products"
          }}
          key={Math.round(Math.random() * 1000000000)}
          marginBottom="1rem"
        >
          {({ isHovered, isFocused, isPressed }) => {
            return (
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
                  <Text color="gray.500">{category}</Text>
                </Center>
              </VStack>
            );
          }}
        </Pressable>
      ))}
    </View>
  ];
};

export default Categories;
