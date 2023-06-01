/* eslint-disable no-console */
import { io } from "socket.io-client";

import { Api } from "./api";

export class Socket {
  constructor(notificationCallback, restaurantId, owner, tabId) {
    this.notify = notificationCallback || console.log;
    this.socket = io.connect("http://localhost:3000", {
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
