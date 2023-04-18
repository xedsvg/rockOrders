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

const Table = () => {
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
          {state.cart.length ? <Cart /> : null}
          {state.orders.length ? state.orders.map((order, orderNr) => { return (<Order key={order._id} orderNr={orderNr} order={order} />) }) : null}
          {(!state.orders.length && !state.cart.length) ? <MockOrder /> : null}
        </ScrollView>

      </VStack>
    </Center>
  );
}

export default Table;