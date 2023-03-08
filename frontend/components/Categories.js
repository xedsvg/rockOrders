import React from "react";
import {
  View,
  VStack,
  Circle,
  Pressable,
  Icon,
  Heading,
  Text,
  Center,
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";

const Categories = ({ categories, setCategory }) => {
  return (
    <View flexDirection="row" justifyContent="space-evenly" flexWrap="wrap">
      <Heading marginBottom="2rem" marginTop="1rem" color="black" bold>
        What would you like to serve?
      </Heading>
      {categories.map((category) => (
        <Pressable
          onPress={() => {setCategory(category)}}
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
                  {/* <Icon as={<MaterialIcons name="audiotrack" />} color="white" size={5} /> */}
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
  );
};

export default Categories;
