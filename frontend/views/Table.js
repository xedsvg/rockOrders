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

import TableStatus from "../components/TableStatus";
import Order from "../components/Order";

export default function Table({ tableInfo, orders, cart, isOpen, onClose, setViewCartOrTabButton }) {
  useEffect(() => {
    setViewCartOrTabButton("View Tab");
  }, []);

  return (
    <Center flex={1} w="full">
      <VStack flex={1} space={1} alignItems="flex-start">

        {/* **** Table Status **** */}
        <TableStatus tableInfo={tableInfo} />

        {/* **** Active Orders **** */}
        <ScrollView h="10" w="full">
          {cart.length ? <Order key={"current-cart"} cart={cart} /> : null}
          {console.log(orders.length)}
          {(orders.length || cart.length) ? orders.map((order, orderNr) => { order.nr = orderNr + 1; console.log(`Order nr ${order.nr}`); return (<Order key={order._id || "placeholder"} order={order} />)}) : <Order />}
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
                  <Text fontWeight="medium">Sub Total</Text>
                  <Text color="blueGray.400">$298.77</Text>
                </HStack>

                <HStack alignItems="center" justifyContent="space-between">
                  <Text fontWeight="medium">Tax</Text>
                  <Text color="blueGray.400">$38.84</Text>
                </HStack>

                <HStack alignItems="center" justifyContent="space-between">
                  <Text fontWeight="medium">Total Amount</Text>
                  <Text color="emerald.600">$337.61</Text>
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
