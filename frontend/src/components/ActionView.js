import React from "react";
import { globalState } from "../state";

import { Actionsheet, Box, Button, Center, Divider, Heading, HStack, Text, VStack } from "native-base";

const ActionView = ({ isOpen, onClose }) => {
    const state = globalState();

    if (state.totalProducts)
        return (
            <Center>
                <Actionsheet isOpen={isOpen} onClose={onClose}>
                    <Actionsheet.Content>
                        <Box w={["250", "300"]} justifyContent="center">
                            <VStack space={3}>
                                <HStack alignItems="center" justifyContent="center">
                                    <Heading>Your Order</Heading>
                                </HStack>

                                {state.cart.map((cartItem) => {
                                    if (cartItem.qty > 0) {
                                        return (
                                            <HStack key={cartItem._id} alignItems="center" justifyContent="space-between">
                                                <Text color="text.light" fontWeight="medium">{cartItem.qty} x {cartItem.name}</Text>
                                                <Text color="blueGray.400">{cartItem.qty * cartItem.price} RON</Text>
                                            </HStack>
                                        )
                                    }
                                })}
                                <Divider bg="black" thickness="1" />
                                <HStack alignItems="center" justifyContent="space-between">
                                    <Text color="text.light" fontWeight="medium">Total Order Amount</Text>
                                    <Text color="emerald.600">{state.cartFunctions.getTotal} RON</Text>
                                </HStack>
                            </VStack>
                            <Divider bg="white" thickness="5" />
                            <Button onPress={()=> {state.cartFunctions.send(); onClose();}} my="2">Send order!</Button>
                        </Box>
                    </Actionsheet.Content>
                </Actionsheet>
            </Center>
        );
    else return (
        <Center>
            <Actionsheet isOpen={isOpen} onClose={onClose}>
                <Actionsheet.Content>
                    <Box w={["250", "300"]} justifyContent="center">
                        <VStack space={3}>
                            <HStack alignItems="center" justifyContent="center">
                                <Heading>Your Tab</Heading>
                            </HStack>
                            <HStack alignItems="center" justifyContent="space-between">
                                <Text color="text.light" fontWeight="medium">Total Amount</Text>
                                <Text color="emerald.600">{state.tabTotal} RON</Text>
                            </HStack>
                        </VStack>
                        <Button onPress={async ()=> {await state.payCash(); onClose();}} my="2">Pay cash</Button>
                        <Button onPress={async ()=> {await state.payCard(); onClose();}} my="2">Pay card</Button>
                        <Button onPress={async ()=> {await state.callWaiter(); onClose();}} my="2">Request waiter</Button>
                    </Box>
                </Actionsheet.Content>
            </Actionsheet>
        </Center>
    );
}

export default ActionView;