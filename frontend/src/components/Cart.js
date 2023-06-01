// /* eslint-disable no-nested-ternary */
// import {
//   Box,
//   Pressable,
//   Badge,
//   HStack,
//   VStack,
//   Spacer,
//   Text,
//   Button,
//   View,
//   Divider,
// } from "native-base";
// import React from "react";

// import { globalState } from "../state";

// function Cart() {
//   const state = globalState();
//   const { cart, cartTotal } = state;

//   return (
//     <VStack space={4} alignItems="center" marginBottom="2.5">
//       <Box alignItems="center" w="full">
//         <Pressable w="full">
//           {({ isHovered, isPressed }) => (
//             <Box
//               bg={
//                 isPressed
//                   ? "coolGray.200"
//                   : isHovered
//                   ? "coolGray.200"
//                   : "coolGray.100"
//               }
//               style={{
//                 transform: [
//                   {
//                     scale: isPressed ? 0.96 : 1,
//                   },
//                 ],
//               }}
//               p="5"
//               rounded="8"
//               shadow={3}
//               bcartWidth="1"
//               bcartColor="coolGray.300"
//             >
//               <HStack alignItems="center">
//                 <Badge
//                   colorScheme="warning"
//                   _text={{
//                     color: "white",
//                   }}
//                   variant="solid"
//                   rounded="4"
//                 >
//                   Not sent
//                 </Badge>
//                 <Spacer />
//                 <Text color="text.light" fontSize={10}>
//                   now
//                 </Text>
//               </HStack>
//               <Text color="text.light" mt="3" fontWeight="medium" fontSize="xl">
//                 Current order
//               </Text>
//               {cart.map((cartItem) => (
//                 <View
//                   flexDirection="row"
//                   justifyContent="space-between"
//                   key={cartItem._id}
//                 >
//                   <Text color="text.light" mt="2" fontSize="sm">
//                     {cartItem.qty} x{cartItem.name}
//                   </Text>

//                   <Text color="text.light" mt="2" fontSize="sm">
//                     {cartItem.price * cartItem.qty} RON
//                   </Text>
//                 </View>
//               ))}
//               <Divider bg="transparent" thickness="10" />
//               <Divider bg="black" thickness="1" />
//               <View
//                 flexDirection="row"
//                 justifyContent="space-between"
//                 key="total"
//               >
//                 <Text color="text.light" mt="2" fontSize="sm">
//                   Total:
//                 </Text>

//                 <Text color="text.light" mt="2" fontSize="sm">
//                   {cartTotal} RON
//                 </Text>
//               </View>
//               <View>
//                 <Divider bg="transparent" thickness="10" />
//                 <HStack justifyContent="space-between">
//                   <Button colorScheme="warning"> Add details</Button>
//                   <Button
//                     colorScheme="success"
//                     onPress={state.cartFunctions.send}
//                   >
//                     Send Order!
//                   </Button>
//                 </HStack>
//               </View>
//             </Box>
//           )}
//         </Pressable>
//       </Box>
//     </VStack>
//   );
// }

// export default Cart;
