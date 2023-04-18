import React, { useEffect } from "react";

import {
  VStack,
  HStack,
  Heading,
  Text,
  Center,
  Actionsheet,
  Button,
  Box,
  ScrollView,
} from "native-base";

import { globalState } from "../state";

import TableStatus from "../components/TableStatus";
import Cart from "../components/Cart";
import Order from "../components/Order";
import MockOrder from "../components/MockOrder";

export default function Table({ isOpen, onClose }) {
  const state = globalState();

  useEffect(() => {
    state.cartOrTab = "View Tab";
  }, [state.cart]);
  
  return (
    <Center flex={1} w="full">
      <VStack flex={1} space={1} alignItems="flex-start">

        {/* **** Table Status **** */}
        <TableStatus />

        {/* **** Current order and past orders **** */}
        <ScrollView h="10" w="full">
          {state.cart.length ? <Cart/> : null}
          {state.orders.length && state.orders.map((order, orderNr) => { return (<Order key={order._id} orderNr={orderNr} order={order} />) })}
          {!state.orders.length && !state.cart.length && <MockOrder />}
        </ScrollView>

      </VStack>

      {/* **** Tab Details and Actions **** */}
      <Center>
        <Actionsheet isOpen={isOpen} onClose={onClose}>
          <Actionsheet.Content>
            <Box w={["250", "300"]} justifyContent="center">
              <VStack space={3}>
                <HStack alignItems="center" justifyContent="center">
                  <Heading>Your Tab</Heading>
                </HStack>
                <HStack alignItems="center" justifyContent="space-between">
                  <Text fontWeight="medium">Total Amount</Text>
                  <Text color="emerald.600">{state.tabTotal} RON</Text>
                </HStack>
              </VStack>
              <Button my="2">Pay cash</Button>
              <Button my="2">Pay card</Button>
              <Button my="2">Request waiter</Button>
            </Box>
          </Actionsheet.Content>
        </Actionsheet>
      </Center>
    </Center>
  );
}
