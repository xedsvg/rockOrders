import React from "react";

import { StyleSheet } from "react-native";
import { Text, HStack, Center } from "native-base";

export default function Navbar({ restaurantName, children }) {
  return (
    <HStack bg="lightBlue.800" space={3} justifyContent="center" style={styles.navbarbox} >
        {children ? children : (
        <Center w="20" rounded="md" shadow={3} > 
            <Text color="blueGray.200">{restaurantName}</Text>
        </Center>
        )}
  </HStack>
  );
}

const styles = StyleSheet.create({
    navbarbox: {
      minHeight: "5vh",
      // backgroundColor: "#222222",
      padding: "1rem",
      borderRadius: "1rem",
      marginTop: "5vh"
    },
  });
  