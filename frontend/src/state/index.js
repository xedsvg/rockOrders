/* eslint-disable array-callback-return */
/* eslint-disable no-param-reassign */
/* eslint-disable react-hooks/rules-of-hooks */
import { hookstate, useHookstate, none } from "@hookstate/core";
import { devtools } from "@hookstate/devtools";

const hstate = hookstate(
  {
    restaurantId: null,
    restaurantName: "default",

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

export function globalState() {
  const ustate = useHookstate(hstate);

  return {
    get developerMode() {
      return ustate.developerMode.get();
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

        // Search for item in cart, add it if not found with defaults, else update quantity
        let itemIndex = cart.findIndex((i) => i._id === item._id);

        if (itemIndex === -1) {
          // Add item to cart
          ustate.currentProduct.cartQty.set(qty);
          ustate.cart[cart.length].set(JSON.parse(JSON.stringify(item)));
        } else {
          ustate.cart[itemIndex].cartQty.set((cartQty) => cartQty + qty);
        }

        itemIndex = cart.findIndex((i) => i._id === item._id);

        // Handle products
        if (type === "product") {
          // Update total price for product
          ustate.cart[itemIndex].totalPrice.set(
            (tp) => (tp || 0) + item.price * qty
          );

          // Update total price for cart
          ustate.cartTotal.set((ct) => ct + item.price * qty);
          // Handle variations
        } else if (type === "variation" && variationIndex) {
          // Remove all other variations
          ustate.currentProduct.recipe.set((oldRecipe) => {
            const newRecipe = [...oldRecipe];
            newRecipe.splice(0, variationIndex);
            newRecipe.splice(1);
            return newRecipe;
          });

          ustate.cart[itemIndex].totalPrice.set(
            (tp) => (tp || 0) + item.recipe[0].price * qty
          );

          ustate.cartTotal.set((ct) => ct + item.recipe[0].price * qty);
        }

        // Update total products for cart icon
        ustate.totalProducts.set((totalProducts) => totalProducts + qty);
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
        const itemIndex = cart.findIndex((i) => i._id === item._id);
        // Delete item from cart - lazy way
        ustate.cart[itemIndex].set(none);

        // Add it back only if it's at least 1
        if (qty > 0) {
          ustate.currentProduct.cartQty.set(qty);

          if (item.type === "product") {
            ustate.currentProduct.totalPrice.set(item.price * qty);
          } else if (item.type === "variation") {
            ustate.currentProduct.totalPrice.set(item.recipe[0].price * qty);
          }

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
      },

      get getTotal() {
        return ustate.cartTotal.get();
      },

      async send() {
        alert("disabled");
        // const api = ustate.api.get();
        // const cart = ustate.cart.get();
        // const tableInfo = ustate.tableInfo.get();

        // const cartWithQty = cart.filter((item) => item.qty > 0);
        // // todo: add error handling
        // await api.sendOrder(cartWithQty, tableInfo.currentTab._id);

        // ustate.cart.forEach((item) => {
        //   item.qty.set(0);
        //   item.totalPrice.set(0);
        // });
        // ustate.cartTotal.set(0);
        // ustate.totalProducts.set(
        //   ustate.cart.get().reduce((acc, item) => acc + item.qty, 0)
        // );
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

    get openOrders() {
      return ustate.openOrders.get();
    },
    set openOrders(orders) {
      ustate.openOrders.set(orders);
    },
    pushNewOrder(order) {
      ustate.openOrders.set((prev) => [order, ...prev]);
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
