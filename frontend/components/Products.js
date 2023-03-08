import React from "react";
import { View } from "native-base";

import Product from "./Product";

const Products = ({ products, addToCart, removeFromCart }) => {

  return (
    <View
      justifyContent="space-evenly"
      alignItems="start"
      flexWrap="wrap"
      flexDirection="row"
      marginTop="4"
    >
      {products.map((product) => (
        <Product
          key={product._id}
          product={product}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
        />
      ))}
    </View>
  );
};

export default Products;
