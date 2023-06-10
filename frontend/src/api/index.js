/* eslint-disable no-console */
import { io } from "socket.io-client";

import { Api } from "./api";
import { baseUrl } from "../settings";

export class Socket {
  constructor(notificationCallback, restaurantId, owner, tabId) {
    this.notify = notificationCallback || console.log;
    const url = new URL(baseUrl);
    this.socket = io.connect(`${url.protocol}//${url.hostname}`, {
      query: {
        restaurantId,
        owner,
        tabId,
      },
    });
  }

  on(event, callback) {
    this.socket.on(event, callback);
  }

  disconnect() {
    this.socket.disconnect();
  }
}

export { Api };
