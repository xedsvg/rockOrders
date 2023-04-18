import React from "react";
import { globalState } from "../state";

import { Actionsheet, Box, Button, Center, Divider, Heading, HStack, Text, VStack } from "native-base";

const ActionView = ({ isOpen, onClose }) => {
    const state = globalState();

    if (state.cart.length)
        return (
            <Center>
                <Actionsheet isOpen={isOpen} onClose={onClose}>
                    <Actionsheet.Content>
                        <Box w={["250", "300"]} justifyContent="center">
                            <VStack space={3}>
                                <HStack alignItems="center" justifyContent="center">
                                    {state.cart.length ? <Heading>Your Order</Heading> : <Heading>Your order is empty :(</Heading>}
                                </HStack>

                                {state.cart.map((cartItem) => (
                                    <HStack key={Math.round(Math.random() * 1000000000)} alignItems="center" justifyContent="space-between">
                                        <Text fontWeight="medium">{cartItem.qty} x {cartItem.name}</Text>
                                        <Text color="blueGray.400">{cartItem.qty * cartItem.price} RON</Text>
                                    </HStack>
                                ))}
                                {state.cart.length ? <Divider bg="black" thickness="1" /> : null}
                                <HStack alignItems="center" justifyContent="space-between">
                                    <Text fontWeight="medium">Total Order Amount</Text>
                                    <Text color="emerald.600">{state.cartFunctions.getTotal} RON</Text>
                                </HStack>
                            </VStack>
                            <Divider bg="white" thickness="5" />
                            <Button isDisabled={!state.cart.length} onPress={state.cartFunctions.send} my="2">Send order!</Button>
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
        );
}

export default ActionView;