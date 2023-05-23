import { baseUrl } from "../settings";
import { io } from "socket.io-client";

export class Socket {
    constructor(notificationCallback, restaurantId, owner, tabId) {
        this.notify = notificationCallback || console.log;
        this.socket = io.connect(`http://localhost:3000`, {
            query: {
                restaurantId,
                owner,
                tabId
            }
        });
    }

    on(event, callback) {
        this.socket.on(event, callback);
    }

    disconnect() {
        this.socket.disconnect();
    }

}

export class Api {
    constructor(notificationCallback) {
        this.notify = notificationCallback || console.log;
    }

    async post(path, body) {
        try {
            return await fetch(`${baseUrl}${path}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });
        } catch (error) {
            this.notify("Error: " + error);
        }
    }

    async get(path) {
        try {
            const data = await fetch(`${baseUrl}${path}`);
            return await data.json();
        } catch (error) {
            this.notify("Error: " + error);
        }
    }

    async sendOrder(cart, tabId) {
        await this.post(`/user/orders/new/${tabId}`, { cartProducts: cart });
        this.notify({ title: "Order sent!", duration: 3000, type: "success" });
    }

    async getSettings() {
        return await this.get("/app/settings");
    }

    async getTableInfo(tableId) {
        return await this.get(`/user/tables/${tableId}`);
    }

    async getMenu(restaurantId) {
        return await this.get(`/user/menus/${restaurantId}`);
    }

    async callWaiter(tabId) {
        await this.get(`/user/actions/callWaiter/${tabId}`);
        this.notify({ title: "Requested a waiter!", duration: 3000, type: "success" });
    }

    async getOpenOrders(restaurantId) {
        return this.get(`/owner/orders/active/${restaurantId}`);
    }

    async clearCallWaiter(tabId) {
        return this.get(`/owner/actions/clearCallWaiter/${tabId}`);
    }

    async payCash(tabId) {
        await this.get(`/user/actions/payCash/${tabId}`);
        this.notify({ title: "Requested the tab to be paid cash!", duration: 3000 });
    }

    async payCard(tabId) {
        await this.get(`/user/actions/payCard/${tabId}`);
        this.notify({ title: "Requested the tab to be paid by card!", duration: 3000 });
    }
}
