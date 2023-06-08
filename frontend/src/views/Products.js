import { View, Heading, FlatList, Center } from "native-base";
import React, { useState, useEffect } from "react";

import Product from "../components/Product";
import { globalState } from "../state";

const Products = () => {
  const state = globalState();
  const { category } = state;

  const [message, setMessage] = useState(`What ${category} would you like?`);

  // const addToCartAndChangeMessage = (product, variation) => {
  //   state.cartFunctions.add(product, variation);
  //   setMessage(`Excellent! Any other ${category}?`);
  // };

  // const removeFromCartAndChangeMessage = (product) => {
  //   state.cartFunctions.remove(product);
  //   setMessage(`Less is more! Any other ${category}?`);
  // };

  useEffect(() => {
    const subCategoriesSet = new Set();
    state.products.forEach((product) => {
      if (product.category === category) {
        subCategoriesSet.add(product.subCategory);
      }
    });
    // Hookstate does not support Sets, so we convert it to an array
    state.subCategories = [...subCategoriesSet];
  }, []);

  return [
    <Center key="messageKey">
      <Heading marginBottom="2rem" marginTop="2rem" color="text.light" bold>
        {message}
      </Heading>
    </Center>,

    state.subCategories.map((subCategory) => (
      <View key={subCategory || "Other"} maxW="95%" paddingX="1rem">
        <Heading
          size="sm"
          marginBottom=".5rem"
          marginTop="1.5rem"
          color="text.light"
          bold
        >
          {subCategory || "Other"}
        </Heading>
        <FlatList
          key={subCategory || "Other"}
          data={state.products.filter(
            (product) =>
              product.subCategory === subCategory &&
              product.category === category
          )}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <Product product={item} />}
        />
      </View>
    )),
  ];
};

export default Products;
