import { MaterialIcons } from "@expo/vector-icons";
import { Center, Text, IconButton, HStack, Badge, VStack } from "native-base";
import React from "react";

import { globalState } from "../state";

function Navbar({ onOpen }) {
  const state = globalState();
  const { restaurantName, user, currentView } = state;

  return (
    <HStack
      bg="brand.800"
      minH="10vh"
      w="full"
      justifyContent="center"
      marginBottom="3vh"
      zIndex={0}
      space={4}
      alignItems="center"
    >
      {user == "customer" && currentView != "scan" ? (
        [
          <Center key="back">
            <VStack>
              <IconButton
                onPress={state.viewGoBack}
                _icon={{
                  as: MaterialIcons,
                  name: "chevron-left",
                  color: "text.light",
                }}
                size="md"
              />
            </VStack>
          </Center>,

          <Center key="menu">
            <VStack>
              <IconButton
                onPress={() => {
                  state.currentView = "categories";
                }}
                _icon={{
                  as: MaterialIcons,
                  name: "list-alt",
                  color: "text.light",
                }}
                size="md"
              />
            </VStack>
          </Center>,

          <Center key="cart">
            <VStack>
              {state.totalProducts ? (
                <Badge
                  bg="red.400"
                  rounded="full"
                  mb={-4}
                  mr={-4}
                  zIndex={1}
                  variant="solid"
                  alignSelf="flex-end"
                  _text={{
                    fontSize: 12,
                  }}
                >
                  {state.totalProducts}
                </Badge>
              ) : null}
              <IconButton
                onPress={onOpen}
                _icon={{
                  as: MaterialIcons,
                  name: state.totalProducts ? "shopping-cart" : "receipt",
                  color: "text.light",
                }}
                size="md"
              />
            </VStack>
          </Center>,
        ]
      ) : (
        <Center w="20" rounded="md">
          <Text color="text.light">{restaurantName}</Text>
        </Center>
      )}
    </HStack>
  );
}

export default Navbar;
{
  /* <VStack>

        <Button mx={{
        base: "auto",
        md: 0
      }} p="2" bg="cyan.500" _text={{
        fontSize: 14
      }}>
          Notifications
        </Button>
      </VStack> */
}
