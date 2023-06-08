/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/prop-types */
import { MaterialIcons } from "@expo/vector-icons";
import { Center, IconButton, HStack, Badge, VStack, Text } from "native-base";
import React from "react";
import { Pressable } from "react-native";

import { globalState } from "../state";

function Navbar({ onOpen }) {
  const state = globalState();
  const { user, currentView } = state;

  return (
    <HStack
      height="12vh"
      w="full"
      justifyContent="space-around"
      zIndex={0}
      alignItems="center"
      paddingX={8}
      bg="paper.medium"
      borderBottomRadius={25}
      borderBottomColor="#352A57"
      borderBottomWidth={6}
      borderTopWidth={2.5}
      borderTopColor={currentView !== "scan" ? "#352A57" : "transparent"}
      borderTopStyle="dashed"
    >
      {user === "customer" && currentView !== "scan"
        ? [
            <Center key="back">
              <Pressable onPress={state.viewGoBack}>
                <VStack alignItems="center" space="0">
                  <IconButton
                    onPress={state.viewGoBack}
                    _icon={{
                      as: MaterialIcons,
                      name: "chevron-left",
                      color: "text.light",
                    }}
                    size="md"
                  />
                  <Text color="text.light">Back</Text>
                </VStack>
              </Pressable>
            </Center>,

            <Center key="menu">
              <Pressable
                onPress={() => {
                  state.currentView = "categories";
                }}
              >
                <VStack alignItems="center" space="0">
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
                  <Text color="text.light">Menu</Text>
                </VStack>
              </Pressable>
            </Center>,

            <Center key="cart">
              <Pressable onPress={onOpen}>
                <VStack alignItems="center" space="0">
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
                  {state.totalProducts ? (
                    <Text color="text.light">Cart</Text>
                  ) : (
                    <Text color="text.light">Tab</Text>
                  )}
                </VStack>
              </Pressable>
            </Center>,
          ]
        : null}
    </HStack>
  );
}

export default Navbar;
