import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert} from 'react-native';

import Orders from './Orders'

import { baseUrl } from '../../settings';

export default function Owner({restaurantId}) {
    const [viewMode, setViewMode] = useState("orders");
    const [orders, setOrders] = useState([]);
    
    const fetchOrders = async () => {
        const orders = await (await fetch(`${baseUrl}/orders/active/${restaurantId}`)).json();
        
        await setOrders(orders);
    }

    const changeStatusHandler = async (orderId, status) => {
      const data = await fetch(`${baseUrl}/orders/update/${orderId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: status })
      });
      alert("Order status changed to " + status + data.status);
    };
  

    useEffect(()=>{
        (async () => {
            await fetchOrders();
          })();
    },[])

    return (
        <View>
        
                {viewMode === "orders" && <Orders orders={orders} changeStatusHandler={changeStatusHandler} />}
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button : {
    backgroundColor: "#222222",
    padding: 12,
    borderRadius: 6,
}
});
