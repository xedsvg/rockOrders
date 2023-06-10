/* eslint-disable consistent-return */
/* eslint-disable no-console */
// eslint-disable-next-line import/no-import-module-exports
import { baseUrl } from "../settings";

export class Api {
  constructor(notificationCallback) {
    this.notify = notificationCallback || console.log;
  }

  async post(path, body) {
    try {
      const response = await fetch(`${baseUrl}${path}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      // Check if the request was successful
      if (response.ok) {
        const responseBody = await response.json();
        return responseBody;
      }
      this.notify(`Network response was not ok.`);
    } catch (error) {
      this.notify(`Error: ${error}`);
      return null;
    }
  }

  async get(path) {
    try {
      const data = await fetch(`${baseUrl}${path}`);
      return data.json();
    } catch (error) {
      this.notify(`Error: ${error}`);
      return null;
    }
  }

  async sendOrder(cart, tabId) {
    await this.post(`/user/orders/new/${tabId}`, { cartProducts: cart });
    this.notify({ title: "Order sent!", duration: 3000, type: "success" });
  }

  async getRestaurantByHostname(hostname) {
    return this.post(`/app/hostnameCheck`, { hostname });
  }

  async getRestaurantByName(restaurantName) {
    return this.get(`/app/restaurantName/${restaurantName}`);
  }

  async getRestaurantById(restaurantId) {
    return this.get(`/app/restaurantId/${restaurantId}`);
  }

  async getTables(restaurantId) {
    return this.get(`/owner/tables/${restaurantId}`);
  }

  async getTable(tableId) {
    return this.get(`/owner/table/${tableId}`);
  }

  async getTableInfo(tableId) {
    return this.get(`/user/tables/${tableId}`);
  }

  async getMenu(restaurantId) {
    return this.get(`/user/menus/${restaurantId}`);
  }

  async callWaiter(tabId) {
    await this.get(`/user/actions/callWaiter/${tabId}`);
    this.notify({
      title: "Requested a waiter!",
      duration: 3000,
      type: "success",
    });
  }

  async getOpenOrders(restaurantId) {
    return this.get(`/owner/orders/active/${restaurantId}`);
  }

  async clearCallWaiter(tabId) {
    return this.get(`/owner/actions/clearCallWaiter/${tabId}`);
  }

  async payCash(tabId) {
    await this.get(`/user/actions/payCash/${tabId}`);
    this.notify({
      title: "Requested the tab to be paid cash!",
      duration: 3000,
    });
  }

  async payCard(tabId) {
    await this.get(`/user/actions/payCard/${tabId}`);
    this.notify({
      title: "Requested the tab to be paid by card!",
      duration: 3000,
    });
  }

  async closeTable(tableId) {
    await this.get(`/owner/table/close/${tableId}`);
    this.notify({ title: "Closed the table!", duration: 3000 });
  }
}

export const version = "0.0.1";
