import { baseUrl } from "../settings";

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
        this.notify("Order sent!");
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
    
}