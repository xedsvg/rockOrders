import React, { useEffect } from 'react';
import { globalState } from '../../state';

import OpenOrders from './OpenOrders'

import { Socket } from "../../api";
import { toastEmitter } from '../../components/Toast';
import { slideEmitter } from '../../components/Slider';

const Owner = () => {
  const state = globalState();
  const { restaurantId, api } = state;

  useEffect(() => {
    (async () => {
      state.openOrders = await api.getOpenOrders(restaurantId);
      // this is a hack to not have to await the writing of the socketIo object to the state
      slideEmitter.emit('toggleSlider');
      
      const socket = new Socket(null, restaurantId, true);
      // when loading the orders, check if there is a call waiter set in the database and show the notification
      socket.on("order:new", (data) => {
        state.pushNewOrder(data.order);
      });

      socket.on("order:update", (data) => {
        console.log(data);
        state.updateOpenOrderStatus(data.id, data.status);
      });

      socket.on("waiter:notification", (data) => {
        const { tableNo, tabId } = data;
        
        toastEmitter.emit('showToastWithDismiss', {
          id: tabId,
          title: `Table ${tableNo} called for a waiter`,
          dismissCallback: async () => {
            await api.clearCallWaiter(tabId);
          }
        });
      });

      state.socketIo = socket;
    })();
  }, [])

  return (
    <OpenOrders />
  );
}

export default Owner;