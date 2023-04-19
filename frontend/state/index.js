import { hookstate, useHookstate, none } from '@hookstate/core';

const hstate = hookstate({
    restaurantId: null,
    restaurantName: "default",

    user: "customer",
    viewHistory: ['scan'],

    tableInfo: null,
    tableId: null,
    tableNr: null,

    orders: [],

    cart: [],
    totalProducts: 0,
    cartTotal: 0,

    tabTotal: 0,

    categories: [],
    category: null,

    subCategories: [],

    viewCartOrTabButton: "",

    openOrders: [],

    ActionView: 'tab',

    api: null,

    developerMode: true
});


const extractCategoriesAndSubCategories = (products) => {
    const categories = new Set();
    const subCategories = new Set();

    products.every((menuItem) => {
        menuItem.category ? categories.add(menuItem.category) : null;
        menuItem.subCategory ? subCategories.add(menuItem.subCategory) : null;
        return true;
    });

    return { categories: Array.from(categories), subCategories: Array.from(subCategories) };
};

export function globalState() {
    const ustate = useHookstate(hstate);

    return ({
        get developerMode() {
            return ustate.developerMode.get();
        },

        get api() {
            return ustate.api.get();
        },
        set api(api) {
            ustate.api.set(api);
        },

        get cart() {
            return ustate.cart.get();
        },

        get totalProducts() {
            return ustate.totalProducts.get();
        },

        cartFunctions: {

            add(item) {
                const cart = ustate.cart.get();

                const itemIndex = cart.findIndex((i) => i._id === item._id);
                ustate.cart[itemIndex].qty.set(qty => qty + 1);
                ustate.cart[itemIndex].totalPrice.set(tp => tp + item.price);

                ustate.cartTotal.set(ct => ct + item.price);
                ustate.totalProducts.set(ustate.cart.get().reduce((acc, item) => acc + item.qty, 0));
            },

            remove(item) {
                const cart = ustate.cart.get();

                const itemIndex = cart.findIndex((i) => i._id === item._id);
                if (ustate.cart[itemIndex].qty.get() > 0) {
                    ustate.cart[itemIndex].qty.set(qty => qty - 1);
                    ustate.cart[itemIndex].totalPrice.set(tp => tp - item.price);
                    ustate.cartTotal.set(ct => ct - item.price);
                }
                ustate.totalProducts.set(ustate.cart.get().reduce((acc, item) => acc + item.qty, 0));
            },

            get getTotal() {
                return ustate.cartTotal.get();
            },

            async send() {
                const api = ustate.api.get();
                const cart = ustate.cart.get();
                const tableId = ustate.tableId.get();
                const tableInfo = ustate.tableInfo.get();

                const cartWithQty = cart.filter((item) => item.qty > 0);
                await api.sendOrder(cartWithQty, tableInfo.currentTab._id);

                ustate.cart.forEach((item) => {
                    item.qty.set(0);
                    item.totalPrice.set(0);
                });
                ustate.cartTotal.set(0);
                ustate.totalProducts.set(ustate.cart.get().reduce((acc, item) => acc + item.qty, 0));
                ustate.tableInfo.set(await api.getTableInfo(tableId));
            },
        },

        get tabTotal() {
            return ustate.tabTotal.get();
        },

        get products() {
            return ustate.cart.get();
        },

        set products(products) {
            const { categories, subCategories } = extractCategoriesAndSubCategories(products);
            products = products.map((product) => {
                if (!product.qty) {
                    product.qty = 0;
                }
                if (!product.totalPrice) {
                    product.totalPrice = 0;
                }
                return product;
            });

            ustate.cart.set(products);
            ustate.categories.set(categories);
            ustate.subCategories.set(subCategories);
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

        get cartOrTab() {
            return ustate.viewCartOrTabButton.get();
        },
        set cartOrTab(value) {
            ustate.viewCartOrTabButton.set(value);
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

        get tableInfo() {
            return ustate.tableInfo.get();
        },
        set tableInfo(info) {
            ustate.tableNr.set(info.tableNo);
            ustate.orders.set(info.currentTab.orders);
            ustate.tabTotal.set(info.currentTab.orders.reduce((acc, order) => acc + order.totalAmount, 0));
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
        }
    })
}