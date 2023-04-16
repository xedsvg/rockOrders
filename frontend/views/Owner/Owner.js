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

    const changeStatusHandler = async () => {
    }

    useEffect(()=>{
        (async () => {
            await fetchOrders();
          })();
    },[])

    return (
        <View>
        <View style={{ flex: 1, justifyContent: 'center', padding: 24, marginTop: 30, marginBottom: 20}}>
                <View style={{ flexDirection: 'row', height: 55, backgroundColor: "#ECECEC", borderRadius: 8 }}>
                            
                        <TouchableOpacity
                            style={{ 
                                flex: 1,
                                backgroundColor: viewMode === "orders" ? "#999999" : null, 
                                margin: 5,
                                borderRadius: 8,
                            }}
                            onPress={() => setViewMode("orders")}
                        >
                            <View
                                    style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                <Text style={{ marginLeft: 0, fontSize: 16,  lineHeight: 22, color: "black" }}>Orders</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>  
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
