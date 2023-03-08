import { baseUrl } from "../settings";

import React, { useEffect, useState } from "react";
import { View, Text } from "native-base";

import Item from "../components/Item";
import Categories from "../components/Categories";

export default function Menu({ restaurantId, cart, setCart }) {
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
      {/* {categories.map((category) => (
        <Categories
          key={Math.round(Math.random() * 1000000000).toString()}
          category={category}
        />
      ))} */}

      <View
        justifyContent="space-evenly"
        alignItems="start"
        flexWrap="wrap"
        flexDirection="row"
        marginTop="4"
      >
        {menuItems.map((item) => (
          <Item
            key={item._id}
            product={item}
            addToCart={addItemToCart}
            removeFromCart={removeItemToCart}
          />
        ))}
      </View>
    </View>
  );
}
