import React, { useEffect } from 'react';
import { globalState } from '../../state';
import { View } from 'react-native';

import Orders from './Orders'

import { baseUrl } from '../../settings';

export default function Owner() {
  const state = globalState();
  const { openOrders, restaurantId } = state;

  useEffect(() => {
    (async () => {
      const data = await (await fetch(`${baseUrl}/orders/active/${restaurantId}`)).json();
      state.openOrders = data;
      console.log(data);
      console.log(openOrders);
    })();
  }, [])

  return (
      <Orders/>
  );
}
