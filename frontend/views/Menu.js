// import React, { useEffect } from "react";
// import { View, Text, Center, Actionsheet, Box, VStack, HStack, Button, Heading, Divider } from "native-base";

// import { globalState } from "../state";

// import Products from "../components/Products";
// // import Categories from "../components/Categories";

// export default function Menu({ isOpen, onClose }) {
//   const state = globalState();
//   const { restaurantId } = state;

//   useEffect(() => {
//     state.cartOrTab = "View Order";
//     (async () => {
//       state.products = await state.api.getMenu(restaurantId);
//     })();
//   }, []);


//   return (
//     <View>
//       {!state.category && <Categories/>}
//       {state.category && <Products/> }

//       {/* Cart View and Actions */}
//       <Center>
//         <Actionsheet isOpen={isOpen} onClose={onClose}>
//           <Actionsheet.Content>
//             <Box w={["250", "300"]} justifyContent="center">
//               <VStack space={3}>
//                 <HStack alignItems="center" justifyContent="center">
//                   {state.cart.length ? <Heading>Your Order</Heading> : <Heading>Your order is empty :(</Heading>}
//                 </HStack>

//                 {state.cart.map((cartItem) => (
//                   <HStack key={Math.round(Math.random() * 1000000000)} alignItems="center" justifyContent="space-between">
//                     <Text fontWeight="medium">{cartItem.qty} x {cartItem.name}</Text>
//                     <Text color="blueGray.400">{cartItem.qty * cartItem.price} RON</Text>
//                   </HStack>
//                 ))}
//                 {state.cart.length ? <Divider bg="black" thickness="1" /> : null}
//                 <HStack alignItems="center" justifyContent="space-between">
//                   <Text fontWeight="medium">Total Order Amount</Text>
//                   <Text color="emerald.600">{state.cartFunctions.getTotal} RON</Text>
//                 </HStack>
//               </VStack>
//               <Divider bg="white" thickness="5" />
//               <Button isDisabled={!state.cart.length} onPress={state.cartFunctions.send} my="2">Send order!</Button>
//             </Box>
//           </Actionsheet.Content>
//         </Actionsheet>
//       </Center>
//     </View>
//   );
// }
