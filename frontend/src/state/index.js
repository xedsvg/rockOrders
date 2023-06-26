/* eslint-disable no-restricted-syntax */
/* eslint-disable array-callback-return */
/* eslint-disable no-param-reassign */
/* eslint-disable react-hooks/rules-of-hooks */
import { hookstate, useHookstate, none } from "@hookstate/core";
import { devtools } from "@hookstate/devtools";

const hstate = hookstate(
  {
    restaurantId: null,
    restaurantName: "Welcome to Tabley!",

    isExternal: false,

    user: "customer",
    viewHistory: ["scan"],

    ownerView: "tables",
    ownerActionViewIsOpen: false,

    tableInfo: null,
    tableId: null,
    tableNr: null,
    selectedTable: null,

    orders: [],

    products: [],

    currentProduct: null,

    cart: [],
    totalProducts: 0,
    cartTotal: 0,

    tabTotal: 0,

    categories: [],
    category: null,

    subCategories: [],

    openOrders: [],
    openOrdersPerTable: [],
    tables: [],

    ActionView: "tab",

    api: null,
    socketIo: null,

    developerMode: false,
  },
  devtools({ key: "globalState" })
);

const extractCategoriesAndSubCategories = (products) => {
  const categories = new Set();
  const subCategories = new Set();

  products.every((menuItem) => {
    if (menuItem.category) categories.add(menuItem.category);
    if (menuItem.subCategory) subCategories.add(menuItem.subCategory);
    return true;
  });

  return {
    categories: Array.from(categories),
    subCategories: Array.from(subCategories),
  };
};

const transformOpenOrdersToOpenOrdersPerTable = (openOrders) => {
  // these are raw orders, not hookstate objects
  openOrders.forEach((order, oIndex) => {
    // filter out the orders that are not 'recieved' aka open
    if (order.status !== "recieved") {
      openOrders.splice(oIndex, 1);
    } else {
      // Modify the items to only include the recipe that was ordered
      for (const variant of order.variations) {
        // Iterate over the quantity
        while (variant.qty > 0) {
          // Find the item in the order that matches the variant
          const item = order.items.find((i) => i._id === variant.id);
          // if the item was deleted, skip it
          if (item) {
            // Create a copy of the item
            const newItem = JSON.parse(JSON.stringify(item));
            // Delete the item from the order so we don't loop over it again
            const itemIndex = order.items.indexOf(item);
            order.items.splice(itemIndex, 1);
            // Update the recipe and quantity
            newItem.recipe = newItem.recipe.filter(
              (recipe) => recipe._id === variant.recipe
            );
            newItem.cartQty = 1;
            // Update the quantity of the variant
            variant.qty -= 1;
            // Add the updated item to the result
            order.items.push(newItem);
          }
        }
      }
      // Reduce the items to only include the unique items and their quantity
      // order.items.forEach((item, iIndex) => {
      //   const existingItem = order.items.find((i, index) => {
      //     if (i.type === "product") {
      //       if (i._id === item._id) {
      //         order.items.splice(index, 1);
      //         return true;
      //       }
      //     }
      //     if (i.type === "variation") {
      //       if (i._id === item._id && i.recipe[0]._id === item.recipe[0]._id) {
      //         order.items.splice(index, 1);
      //         return true;
      //       }
      //     }
      //     return false;
      //   });
      //   if (existingItem) {
      //     console.log(existingItem);
      //     if (!item.cartQty) {
      //       item.cartQty = 1;
      //     } else {
      //       item.cartQty += 1;
      //     }
      //   }
      // });

      order.items = order.items.reduce((acc, item) => {
        const existingItemIndex = acc.findIndex((i) => {
          if (i.type === "product") {
            return i._id === item._id;
          }
          if (i.type === "variation") {
            return i._id === item._id && i.recipe[0]._id === item.recipe[0]._id;
          }
          return false;
        });

        if (existingItemIndex !== -1) {
          if (!acc[existingItemIndex].cartQty) {
            acc[existingItemIndex].cartQty = 1;
          } else {
            acc[existingItemIndex].cartQty += 1;
          }
        } else {
          if (!item.cartQty) {
            item.cartQty = 1;
          }
          acc.push(item);
        }

        return acc;
      }, []);
    }
  });
  console.log(openOrders);
  return openOrders;
};

export function globalState() {
  const ustate = useHookstate(hstate);

  return {
    get isExternal() {
      return ustate.isExternal.get();
    },
    set isExternal(bool) {
      ustate.isExternal.set(bool);
    },

    get developerMode() {
      return ustate.developerMode.get();
    },

    set developerMode(bool) {
      ustate.developerMode.set(bool);
    },

    get selectedTable() {
      return ustate.selectedTable.get();
    },
    set selectedTable(table) {
      ustate.selectedTable.set(table);
    },

    get socketio() {
      return ustate.socketio.get();
    },
    set socketIo(socketIo) {
      ustate.socketIo.set(socketIo);
    },

    get api() {
      return ustate.api.get();
    },
    set api(api) {
      ustate.api.set(api);
    },

    removeCurrentProduct() {
      ustate.currentProduct.set(none);
    },
    get currentProduct() {
      return ustate.currentProduct.get();
    },
    set currentProduct(product) {
      ustate.currentProduct.set(JSON.parse(JSON.stringify(product)));
    },

    get ownerActionViewIsOpen() {
      return ustate.ownerActionViewIsOpen.get();
    },

    set ownerActionViewIsOpen(isOpen) {
      ustate.ownerActionViewIsOpen.set(isOpen);
    },

    get ownerView() {
      return ustate.ownerView.get();
    },

    set ownerView(view) {
      ustate.ownerView.set(view);
    },

    get tables() {
      return ustate.tables.get();
    },

    set tables(tables) {
      ustate.tables.set(tables);
    },

    setActiveTable(table) {
      const tables = ustate.tables.get();
      const tableIndex = tables.findIndex((t) => t._id === table._id);
      ustate.tables[tableIndex].set(table);
    },

    removeActiveTable(tableId) {
      const tables = ustate.tables.get();
      const tableIndex = tables.findIndex((t) => t._id === tableId);
      ustate.tables[tableIndex].currentTab.set(null);
      ustate.tables[tableIndex].tabOpen.set(false);
    },

    async callWaiter() {
      const api = ustate.api.get();
      await api.callWaiter(ustate.tableInfo.get().currentTab._id);
    },

    async payCash() {
      const api = ustate.api.get();
      await api.payCash(ustate.tableInfo.get().currentTab._id);
    },

    async payCard() {
      const api = ustate.api.get();
      await api.payCard(ustate.tableInfo.get().currentTab._id);
    },

    get cart() {
      return ustate.cart.get();
    },

    get totalProducts() {
      return ustate.totalProducts.get();
    },

    cartFunctions: {
      add(qty, variationIndex) {
        if (qty < 1) return;
        const cart = ustate.cart.get();
        const item = ustate.currentProduct.get();
        const { type } = item;

        if (type === "product") {
          // search for item in cart
          let itemIndex = cart.findIndex((i) => i._id === item._id);

          if (itemIndex === -1) {
            // Add item to cart
            ustate.currentProduct.cartQty.set(qty);
            ustate.cart[cart.length].set(JSON.parse(JSON.stringify(item)));
            // Update item index
            itemIndex = cart.findIndex((i) => i._id === item._id);
          } else {
            ustate.cart[itemIndex].cartQty.set((cartQty) => cartQty + qty);
          }

          // Update total price for product
          ustate.cart[itemIndex].totalPrice.set(
            (tp) => (tp || 0) + item.price * qty
          );

          // Update total price for cart
          ustate.cartTotal.set((ct) => ct + item.price * qty);
          // Update total products for cart icon
          ustate.totalProducts.set((totalProducts) => totalProducts + qty);
        } else if (type === "variation") {
          console.log("trying to add variation to cart");
          // search for variation in cart with same recipe
          const itemIndex = cart.findIndex(
            (i) =>
              i._id === item._id &&
              JSON.stringify(i.recipe[0]) ===
                JSON.stringify(item.recipe[variationIndex])
          );

          if (itemIndex === -1) {
            console.log("item not found in cart");
            // Add variation to cart
            ustate.currentProduct.cartQty.set(qty);
            ustate.cart[cart.length].set(JSON.parse(JSON.stringify(item)));
            // Remove all variations that are not selected
            console.log(ustate.cart[cart.length - 1]);
            console.log("removed all variations that are not selected");
            ustate.cart[cart.length - 1].recipe.set((oldRecipe) => {
              const newRecipe = [...oldRecipe];
              newRecipe.splice(0, variationIndex);
              newRecipe.splice(1);
              console.log("variation selected", variationIndex);
              console.log(newRecipe);
              return newRecipe;
            });

            ustate.cart[cart.length - 1].totalPrice.set(
              (tp) => (tp || 0) + item.recipe[0].price * qty
            );
          } else {
            console.log("item found in cart updating only qty");
            ustate.cart[itemIndex].cartQty.set((cartQty) => cartQty + qty);

            ustate.cart[itemIndex].totalPrice.set(
              (tp) => (tp || 0) + item.recipe[0].price * qty
            );
          }

          ustate.cartTotal.set((ct) => ct + item.recipe[0].price * qty);
          // Update total products for cart icon
          ustate.totalProducts.set((totalProducts) => totalProducts + qty);
        }
      },

      update(qty) {
        if (qty < 0) return;
        const cart = ustate.cart.get();
        const item = ustate.currentProduct.get();

        // Substract old item qty from cart total and total nr of products
        ustate.cartTotal.set((ct) => ct - item.totalPrice);

        ustate.totalProducts.set(
          (totalProducts) => totalProducts - item.cartQty
        );

        // Search for item in cart
        let itemIndex = cart.findIndex((i) => i._id === item._id);

        if (item.type === "product") {
          // Delete item from cart - lazy way
          ustate.cart[itemIndex].set(none);

          // Add it back only if it's at least 1
          if (qty > 0) {
            ustate.currentProduct.cartQty.set(qty);

            ustate.currentProduct.totalPrice.set(item.price * qty);

            ustate.cartTotal.set(
              (ct) => ct + ustate.currentProduct.totalPrice.value
            );
            ustate.totalProducts.set(
              (totalProducts) =>
                totalProducts + ustate.currentProduct.cartQty.value
            );

            ustate.cart[itemIndex].set(
              JSON.parse(JSON.stringify(ustate.currentProduct.value))
            );
          }
        } else if (item.type === "variation") {
          // search for the exact item in cart. The first itemIndex does not guarantee the same recipe
          itemIndex = cart.findIndex(
            (i) =>
              i._id === item._id &&
              JSON.stringify(i.recipe[0]) === JSON.stringify(item.recipe[0])
          );

          if (qty === 0) {
            ustate.cart[itemIndex].set(none);
          } else {
            ustate.cart[itemIndex].cartQty.set(qty);
            ustate.cart[itemIndex].totalPrice.set(item.recipe[0].price * qty);
            ustate.cartTotal.set((ct) => ct + item.recipe[0].price * qty);
            ustate.totalProducts.set((totalProducts) => totalProducts + qty);
          }
          ustate.currentProduct.totalPrice.set(item.recipe[0].price * qty);
        }
      },

      get getTotal() {
        return ustate.cartTotal.get();
      },

      async send() {
        const api = ustate.api.get();
        const cart = ustate.cart.get();
        const tableInfo = ustate.tableInfo.get();

        try {
          await api.sendOrder(cart, tableInfo.currentTab._id);
          ustate.cart.set(none);
          ustate.cart.merge([]);
          ustate.cartTotal.set(0);
          ustate.totalProducts.set(0);
        } catch (err) {
          console.log(err);
        }
      },
    },

    get tabTotal() {
      return ustate.tabTotal.get();
    },

    get products() {
      return ustate.products.get();
    },

    set products(products) {
      const { categories, subCategories } =
        extractCategoriesAndSubCategories(products);

      ustate.categories.set(categories);
      ustate.subCategories.set(subCategories);
      ustate.products.set(products);
    },

    get subCategories() {
      return ustate.subCategories.get();
    },
    set subCategories(subCategories) {
      ustate.subCategories.set(subCategories);
    },

    get category() {
      return ustate.category.get();
    },
    set category(category) {
      ustate.category.set(category);
    },

    get categories() {
      return ustate.categories.get();
    },

    get user() {
      return ustate.user.get();
    },
    set user(user) {
      ustate.user.set(user);
    },

    get tableId() {
      return ustate.tableId.get();
    },
    set tableId(tableId) {
      ustate.tableId.set(tableId);
    },

    get tableNr() {
      return ustate.tableNr.get();
    },

    get orders() {
      return ustate.orders.get();
    },
    addOrder(order) {
      ustate.orders.set((prev) => [order, ...prev]);
    },
    updateOrderStatus(orderId, status) {
      const orders = ustate.orders.get();
      const orderIndex = orders.findIndex((order) => order._id === orderId);
      ustate.orders[orderIndex].status.set(status);
    },

    get tableInfo() {
      return ustate.tableInfo.get();
    },
    set tableInfo(info) {
      ustate.tableNr.set(info.tableNo);
      ustate.orders.set(info.currentTab.orders);

      ustate.tabTotal.set(
        info.currentTab.orders.reduce((acc, order) => {
          if (order.status !== "canceled") return acc + order.totalAmount;
          return acc;
        }, 0)
      );

      ustate.tableInfo.set(info);
    },

    get currentView() {
      return ustate.viewHistory.get().slice(-1)[0];
    },
    set currentView(viewName) {
      if (ustate.viewHistory.get().slice(-1)[0] !== viewName) {
        ustate.viewHistory.merge([viewName]);
      }
    },
    viewGoBack() {
      const viewHistory = JSON.parse(JSON.stringify(ustate.viewHistory.get()));
      viewHistory.pop();
      ustate.viewHistory.set(viewHistory);
    },

    get openOrdersPerTable() {
      return ustate.openOrdersPerTable.get();
    },

    get openOrders() {
      return ustate.openOrders.get();
    },

    set openOrders(orders) {
      ustate.openOrders.set(orders);
      ustate.openOrdersPerTable.set(
        transformOpenOrdersToOpenOrdersPerTable(orders)
      );
    },

    pushNewOrder(order) {
      ustate.openOrders.set((prev) => [order, ...prev]);
      // update openOrdersPerTable
    },

    updateOpenOrderStatus(orderId, status) {
      const openOrders = ustate.openOrders.get();
      const openOrderIndex = openOrders.findIndex(
        (order) => order._id === orderId
      );
      if (status === "canceled") {
        // Remove the canceled order from the openOrders array
        ustate.openOrders[openOrderIndex].set(none);
      } else {
        // If the status is not 'canceled', just update the status
        ustate.openOrders[openOrderIndex].status.set(status);
      }
      // update openOrdersPerTable
    },

    get restaurantId() {
      return ustate.restaurantId.get();
    },
    set restaurantId(id) {
      ustate.restaurantId.set(id);
    },

    get restaurantName() {
      return ustate.restaurantName.get();
    },
    set restaurantName(name) {
      ustate.restaurantName.set(name);
    },

    get ActionView() {
      return ustate.ActionView.get();
    },
    set ActionView(value) {
      ustate.ActionView.set(value);
    },
  };
}

export const version = "0.0.1";
