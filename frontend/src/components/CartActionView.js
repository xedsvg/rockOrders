/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/* eslint-disable react/prop-types */
import {
  Actionsheet,
  Box,
  Button,
  Center,
  Divider,
  Heading,
  HStack,
  Text,
  VStack,
} from "native-base";
import React from "react";

import { globalState } from "../state";

function CartActionView({ isOpen, onClose }) {
  const state = globalState();

  if (state.totalProducts) {
    return (
      <Center>
        <Actionsheet isOpen={isOpen} onClose={onClose}>
          <Actionsheet.Content>
            <Box w={["250", "300"]} justifyContent="center">
              <VStack space={3}>
                <HStack alignItems="center" justifyContent="center">
                  <Heading color="text.light">Your Order</Heading>
                </HStack>

                {state.cart.map((cartItem) => (
                  <HStack
                    key={
                      cartItem.type === "variation"
                        ? cartItem.recipe[0]._id
                        : cartItem._id
                    }
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Text
                      color="text.light"
                      fontWeight="medium"
                      onPress={() => {
                        state.currentProduct = cartItem;
                        onClose();
                      }}
                    >
                      {cartItem.cartQty} x {cartItem.name}{" "}
                      {cartItem.type === "variation"
                        ? `(${cartItem.recipe[0]?.name})`
                        : null}
                    </Text>
                    <Text color="blueGray.400">
                      {cartItem.type === "variation"
                        ? `${cartItem.cartQty * cartItem.recipe[0].price} RON`
                        : `${cartItem.cartQty * cartItem.price} RON`}
                    </Text>
                  </HStack>
                ))}
                <Divider bg="black" thickness="1" />
                <HStack alignItems="center" justifyContent="space-between">
                  <Text color="text.light" fontWeight="medium">
                    Total Order Amount
                  </Text>
                  <Text color="emerald.600">
                    {state.cartFunctions.getTotal} RON
                  </Text>
                </HStack>
              </VStack>
              <Divider bg="transparent" thickness="5" />
              <Button
                onPress={() => {
                  state.cartFunctions.send();
                  onClose();
                }}
                my="2"
              >
                Send order!
              </Button>
            </Box>
          </Actionsheet.Content>
        </Actionsheet>
      </Center>
    );
  }
  return (
    <Center>
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          <Box w={["250", "300"]} justifyContent="center">
            <Divider bg="trasparent" thickness="2" />
            <VStack space={3}>
              <HStack alignItems="center" justifyContent="center">
                <Heading color="text.light">Your Tab</Heading>
              </HStack>
              <Divider bg="trasparent" thickness="3" />
              <HStack alignItems="center" justifyContent="space-between">
                <Text color="text.light" fontWeight="medium">
                  Total Amount
                </Text>
                <Text color="emerald.600">{state.tabTotal} RON</Text>
              </HStack>
              <Divider bg="trasparent" thickness="3" />
            </VStack>
            {state.tabTotal ? (
              <Button
                onPress={async () => {
                  await state.payCash();
                  onClose();
                }}
                my="2"
              >
                Pay cash
              </Button>
            ) : null}
            {state.tabTotal ? (
              <Button
                onPress={async () => {
                  await state.payCard();
                  onClose();
                }}
                my="2"
              >
                Pay card
              </Button>
            ) : null}
            <Button
              onPress={async () => {
                await state.callWaiter();
                onClose();
              }}
              my="2"
            >
              Request waiter
            </Button>
          </Box>
        </Actionsheet.Content>
      </Actionsheet>
    </Center>
  );
}

export default CartActionView;
