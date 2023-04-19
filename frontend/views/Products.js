import React, { useState, useEffect } from "react";
import { View, Heading, HStack, Center } from "native-base";
import { globalState } from "../state";

import Product from "../components/Product";

const Products = () => {
  const state = globalState();
  const { category } = state;

  const [message, setMessage] = useState(`What ${category} would you like?`);

  const addToCartAndChangeMessage = (product) => {
    state.cartFunctions.add(product);
    setMessage(`Excellent! Any other ${category}?`);
  };

  const removeFromCartAndChangeMessage = (product) => {
    state.cartFunctions.remove(product);
    setMessage(`Less is more! Any other ${category}?`);
  };

  useEffect(() => {
    const subCategoriesSet = new Set();
    state.products.map((product) => {
      if (product.category === category) {
        subCategoriesSet.add(product.subCategory);
      }
    });
    state.subCategories = [...subCategoriesSet];
  }, [])

  return [
    <Center><Heading marginBottom="2rem" marginTop="1rem" color="black" bold> {message} </Heading></Center>,

    state.subCategories.map((subCategory) => (
      <View key={subCategory || 'Other'}>
        <Heading size="sm" marginBottom="2rem" marginTop="1rem" color="black" bold>
          {subCategory || 'Other'}
        </Heading>
        <HStack justifyContent={"space-evenly"} flexWrap="wrap">
          {state.products.map((product) => {
            if (product.subCategory === subCategory && product.category === category)
              return (
                <Product
                  key={product._id}
                  product={product}
                  addToCart={addToCartAndChangeMessage}
                  removeFromCart={removeFromCartAndChangeMessage}
                />
              );
          })}
        </HStack>
      </View>
    ))
  ];
};

export default Products;