import { baseUrl } from "../settings";

import React, { useEffect, useState } from "react";
import { View, Text, Center, Actionsheet, Box, VStack, HStack, Button, Heading, Divider } from "native-base";

import Item from "../components/Item";
import Categories from "../components/Categories";

export default function Menu({ restaurantId, cart, setCart, isOpen, onClose }) {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const [selectedCategories, setSelectedCategories] = useState([]);

  const addItemToCart = (item) => {
    let itemInCart = false;
    let localCart = cart;

    localCart = localCart.map((cartProduct) => {
      if (cartProduct._id === item._id) {
        cartProduct.qty++;
        itemInCart = true;
      }
      return cartProduct;
    });

    if (!itemInCart) {
      localCart.push({ ...item, qty: 1 });
    }

    setCart(localCart);
  };

  const removeItemToCart = (item) => {
    let localCart = cart;
    if (localCart.length) {
      localCart = localCart.map((cartProduct) => {
        if (cartProduct._id === item._id) {
          cartProduct.qty--;
        }
        return cartProduct;
      });
    }

    setCart(localCart);
  };

  // Adds the qty for a product in cart to the menu object
  const crossCheckCartAndMenu = (menuItems) => {
    if (!cart.length) return menuItems;

    cart.every((cartProduct) => {
      menuItems = menuItems.map((menuProduct) => {
        if (menuProduct._id === cartProduct._id) {
          menuProduct.qty = cartProduct.qty;
        }
        return menuProduct;
      });
      return true;
    });

    return menuItems;
  };

  const extractCategoriesAndSubCategories = (menuItems) => {
    const categories = new Set();
    const subCategories = new Set();

    menuItems.every((menuItem) => {
      menuItem.category ? categories.add(menuItem.category) : null;
      menuItem.subCategory ? subCategories.add(menuItem.subCategory) : null;
      return true;
    });

    setCategories([...categories]);
    setSubCategories([...subCategories]);
  };

  const computeCartTotal = () => {
    let total = 0; 
    cart.map((cartItem)=>{
      total = total + ( parseInt(cartItem.qty) * parseInt(cartItem.price) );
    }); 
    return total;
  };

  useEffect(() => {
    (async () => {
      const products = await (
        await fetch(`${baseUrl}/getMenu/${restaurantId}`)
      ).json();

      setMenuItems(crossCheckCartAndMenu(products));
      extractCategoriesAndSubCategories(products);
    })();
  }, []);

  return (
    <View>
        <Categories categories={categories} />

      <View
        justifyContent="space-evenly"
        alignItems="start"
        flexWrap="wrap"
        flexDirection="row"
        marginTop="4"
      >
        {/* {menuItems.map((item) => (
          <Item
            key={item._id}
            product={item}
            addToCart={addItemToCart}
            removeFromCart={removeItemToCart}
          />
        ))} */}
      </View>

      {/* Cart View and Actions */}
      <Center>
        <Actionsheet isOpen={isOpen} onClose={onClose}>
          <Actionsheet.Content>
            <Box w={["250", "300"]} justifyContent="center">
              <VStack space={3}>
                <HStack alignItems="center" justifyContent="center">
                  {cart.length ? <Heading>Your Order</Heading> : <Heading>Your order is empty :(</Heading>}
                </HStack>

                {cart.map((cartItem)=> (
                  <HStack key={Math.round(Math.random() * 1000000000)} alignItems="center" justifyContent="space-between">
                  <Text fontWeight="medium">{cartItem.qty} x {cartItem.name}</Text>
                  <Text color="blueGray.400">{cartItem.qty*cartItem.price} RON</Text>
                </HStack>
                ))}
                { cart.length ? <Divider bg="black" thickness="1" /> : null }
                <HStack alignItems="center" justifyContent="space-between">
                  <Text fontWeight="medium">Total Order Amount</Text>
                  <Text color="emerald.600">{computeCartTotal()} RON</Text>
                </HStack>
              </VStack>
              <Divider bg="white" thickness="5" />
              <Button disabled={!cart.length} my="2">Send order!</Button>
            </Box>
          </Actionsheet.Content>
        </Actionsheet>
      </Center>
    </View>
  );
}
