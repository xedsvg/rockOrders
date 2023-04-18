import React, { useState, useEffect } from "react";
import { View, Heading, HStack, ScrollView } from "native-base";
import { globalState } from "../state";

import Product from "../components/Product";

const Products = () => {
  const state = globalState();
  const { category, products } = state;

  const [message, setMessage] = useState(`What ${category} would you like?`);
  const [localProducts, setLocalProducts] = useState([]);
  const [localSubCategories, setLocalSubCategories] = useState([]);

  const addToCartAndChangeMessage = (product) => {
    state.cartFunctions.add(product);
    setMessage(`Excellent! Any other ${category}?`);
  };

  const removeFromCartAndChangeMessage = (product) => {
    state.cartFunctions.remove(product);
    setMessage(`Less is more! Any other ${category}?`);
  };

  const extractProductsBasedOnCategory = () => {
    const prod = products.filter((product) => product.category === category);
    setLocalProducts(prod);
    extractSubCategories(prod);
  };

  const extractSubCategories = (localProducts) => {
    const localSubCat = new Set();
    localProducts.map((product) => {
      localSubCat.add(product.subCategory);
    });
    setLocalSubCategories([...localSubCat]);
  };


  useEffect(()=> {
     extractProductsBasedOnCategory();
  }, [])

  return (
    <View
      justifyContent="space-evenly"
      alignItems="start"
      flexWrap="wrap"
      flexDirection="row"
      marginTop="4"
    >
      <Heading marginBottom="2rem" marginTop="1rem" color="black" bold>
        {message}
      </Heading>
     
      <ScrollView w="full" h="80vh">
      {localSubCategories.map((subCategory) => (
        <View key={subCategory || 'Other'}>
          <Heading size="sm" marginBottom="2rem" marginTop="1rem" color="black" bold>
            { subCategory || 'Other'}
          </Heading>
          <HStack justifyContent={"space-evenly"} flexWrap="wrap">
          {localProducts.map((product) => {
            if (product.subCategory === subCategory)
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
      ))}
      </ScrollView>

    </View>
  );
};

export default Products;