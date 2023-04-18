import React from "react";
import { globalState } from "../state";

import { View, Center, Text, Icon, HStack } from "native-base";

import { MaterialIcons } from "@expo/vector-icons";

const Navbar = ({ onOpen }) => {
  const state = globalState();
  const { restaurantName, user, cartOrTab, currentView } = state;

  return (
    <HStack
      bg="brand.800"
      minH="10vh"
      w="full"
      space={3}
      justifyContent="center"
      marginBottom="3vh"
      zIndex={0}
    >

      {(user == "customer" && currentView != "scan") ? (
        <View>
          <Center w="20" key="back">
            <Icon as={<MaterialIcons name="chevron-left" />} size={5} onPress={state.viewGoBack} color="blueGray.200" />
            <Text color="blueGray.200">Back</Text>
          </Center>
          <Center w="20" key="menu" >
            <Icon as={<MaterialIcons name="event-note" />} onPress={() => { state.currentView = 'categories' }} size={5} color="blueGray.200" />
            <Text color="blueGray.200">Menu</Text>
          </Center>
          <Center w="20" key="cart">
            <Icon as={<MaterialIcons name={cartOrTab.includes("Order") ? "shopping-cart" : "list-alt"} />} onPress={onOpen} size={5} color="blueGray.200" />
            <Text color="blueGray.200">{cartOrTab}</Text>
          </Center>
        </View>
      ) : (
        <Center w="20" rounded="md" >
          <Text color="gray.100">{restaurantName}</Text>
        </Center>
      )}
    </HStack>
  );
}

export default Navbar;
