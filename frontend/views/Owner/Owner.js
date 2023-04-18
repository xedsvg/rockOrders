import React, { useEffect } from 'react';
import { globalState } from '../../state';

import OpenOrders from './OpenOrders'

import { baseUrl } from '../../settings';

const Owner = () => {
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

export default Owner;