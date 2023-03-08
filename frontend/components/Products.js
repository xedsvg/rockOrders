import React, { useState } from "react";
import { View, Heading } from "native-base";

import Product from "./Product";

const Products = ({ category, products, addToCart, removeFromCart }) => {
  const [ message, setMessage ] = useState(`What ${category} would you like?`);

  const addToCartAndChangeMessage = (product) => {
    addToCart(product);
    setMessage(`Excellent! Any other ${category}?`);
  }
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

      {products.map((product) => {
        if (product.category === category)
          return (
            <Product
              key={product._id}
              product={product}
              addToCart={addToCartAndChangeMessage}
              removeFromCart={removeFromCart}
            />
          );
      })}
    </View>
  );
};

export default Products;
