import React from "react";
import {
  View,
  VStack,
  Divider,
  Circle,
  Icon,
  Heading,
  Text,
  Center,
} from "native-base";

const Categories = ({ categories }) => {
  const click = () => console.log("click click");

  return (
      <View flexDirection="row" justifyContent="space-evenly" flexWrap="wrap">
      <Heading marginBottom="2rem" marginTop="1rem" color="black" bold>What would you like to serve?</Heading>
        {categories.map((category) => (
          <VStack onPress={click} key={Math.round(Math.random() * 1000000000)} marginBottom="1rem">
            <Circle size="26vw" bg="gray.300">
              <Heading color="gray.900">
                {category.charAt(0).toUpperCase()}
              </Heading>
              {/* <Icon as={<MaterialIcons name="audiotrack" />} color="white" size={5} /> */}
            </Circle>
            <Center>
              <Text color="gray.500">{category}</Text>
            </Center>
          </VStack>
        ))}
      </View>
  );
};

export default Categories;
