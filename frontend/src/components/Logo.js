import { Center, Text, Image, HStack } from "native-base";
import React from "react";
import { StyleSheet } from "react-native";

import { globalState } from "../state";

const styles = StyleSheet.create({
  bgContainer: {
    flex: 1,
    width: "70vw",
    height: "7vh",
    aspectRatio: 16 / 9,
  },
});

function Logo() {
  const { restaurantName } = globalState();

  return (
    <HStack
      bg="brand.800"
      height="8vh"
      w="full"
      justifyContent="center"
      zIndex={0}
      alignItems="center"
      // flex={1}
    >
      <Center
        w="full"
        rounded="md"
        // flex={1}
      >
        <Text color="text.light">{restaurantName}</Text>
        {/* <Image
          resizeMode="contain"
          style={styles.bgContainer}
          source={{
            uri: "https://rocknrolla.ro/images/rocklogo-3.png",
          }}
          alt={restaurantName}
        /> */}
      </Center>
    </HStack>
  );
}

export default Logo;
