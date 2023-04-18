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
    cartTotal: 0,

    tabTotal: 0,

    products: [],
    categories: [],
    category: null,

    subCategories: [],
    selectedCategories: [],

    viewCartOrTabButton: "",

    openOrders: [],

    ActionView: 'tab',

    api: null,

    developerMode: true
});

const crossRefCartAndMenu = (cart, products) => {
    if (!cart.length) return;

    cart.every((cartProduct) => {
        products = products.map((menuProduct) => {
            if (menuProduct._id === cartProduct._id) {
                menuProduct.qty = cartProduct.qty;
            }
            return menuProduct;
        });
        return true;
    });
};

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

// const cleanMenu = (products) => {
//     return products.map((product) => {
//         product.qty.set(none);
//         product.totalPrice.set(none);
//         return product;
//     });
// };

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

        cartFunctions: {
            add(item) {
                const mutableItem = JSON.parse(JSON.stringify(item));
                const cart = ustate.cart.get();

                const existingItemIndex = cart.findIndex((i) => i._id === mutableItem._id);
                if (existingItemIndex !== -1) {
                    //RTFM: hookstate update syntax
                    ustate.cart[existingItemIndex].qty.set(qty => qty + 1);
                    ustate.cart[existingItemIndex].totalPrice.set(tp => tp + mutableItem.price);
                } else {
                    mutableItem.qty = 1;
                    mutableItem.totalPrice = mutableItem.price;
                    //RTFM: hookstate merge syntax
                    ustate.cart.merge([mutableItem]);
                }

                ustate.cartTotal.set(ct => ct + mutableItem.price);
                crossRefCartAndMenu(ustate.cart, ustate.products);
            },

            remove(item) {
                const mutableItem = JSON.parse(JSON.stringify(item));
                const cart = ustate.cart.get();

                const existingItemIndex = cart.findIndex((i) => i._id === mutableItem._id);
                if (existingItemIndex !== -1) {
                    if (cart[existingItemIndex].qty > 1) {
                        ustate.cart[existingItemIndex].qty.set(qty => qty - 1);
                        ustate.cart[existingItemIndex].totalPrice.set(tp => tp - item.price);
                    } else {
                        //RTFM: hookstate delete syntax
                        ustate.cart[existingItemIndex].set(none);
                        ustate.cartTotal.set(ct => ct - mutableItem.price);
                    }
                }
                ustate.cartTotal.set(ct => ct - mutableItem.price);
                crossRefCartAndMenu(ustate.cart, ustate.products);
            },

            get getTotal() {
                return ustate.cartTotal.get();
            },

            async send() {
                const api = ustate.api.get();
                const cart = ustate.cart.get();
                const tableInfo = JSON.parse(JSON.stringify(ustate.tableInfo.get()));
                const products = ustate.products.get();

                await api.sendOrder(cart, tableInfo);
                ustate.cart.set([]);
                ustate.cartTotal.set(0);
                ustate.tableInfo.set(await api.getTableInfo(tableInfo._id));
                console.log(products);
            }
        },

        get tabTotal() {
            return ustate.tabTotal.get();
        },

        get products() {
            return ustate.products.get();
        },

        set products(products) {
            const { categories, subCategories } = extractCategoriesAndSubCategories(products);
            crossRefCartAndMenu(ustate.cart.get(), products);
            ustate.products.set(products);
            ustate.categories.set(categories);
            ustate.subCategories.set(subCategories);
        },

        get subCategories() {
            return ustate.subCategories.get();
        },

        get selectedCategories() {
            return ustate.selectedCategories.get();
        },
        set selectedCategories(selectedCategories) {
            ustate.selectedCategories.set(selectedCategories);
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
            if(ustate.viewHistory.get().slice(-1)[0] !== viewName){
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