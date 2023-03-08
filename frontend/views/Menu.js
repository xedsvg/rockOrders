import { baseUrl } from "../settings";

import React, { useEffect, useState } from "react";
import { View, Text, Center, Actionsheet, Box, VStack, HStack, Button, Heading, Divider } from "native-base";

import Products from "../components/Products";

import Categories from "../components/Categories";

export default function Menu({ restaurantId, cart, setCart, isOpen, onClose, setViewCartOrTabButton }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [category, setCategory] = useState("");


  const addToCart = (item) => {
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

  const removeFromCart = (item) => {
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
  const crossCheckCartAndMenu = (products) => {
    if (!cart.length) return products;

    cart.every((cartProduct) => {
      products = products.map((menuProduct) => {
        if (menuProduct._id === cartProduct._id) {
          menuProduct.qty = cartProduct.qty;
        }
        return menuProduct;
      });
      return true;
    });

    return products;
  };

  const extractCategoriesAndSubCategories = (products) => {
    const categories = new Set();
    const subCategories = new Set();

    products.every((menuItem) => {
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
      setViewCartOrTabButton("View Order");
      setProducts(crossCheckCartAndMenu(products));
      extractCategoriesAndSubCategories(products);
    })();
  }, []);

  return (
    <View>
        { !category ? <Categories categories={categories} setCategory={setCategory} /> : null }
        {  category ? <Products category={category} products={products} addToCart={addToCart} removeFromCart={removeFromCart} /> : null }

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
