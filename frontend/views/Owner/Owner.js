import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert} from 'react-native';
import Orders from './Orders'
import AddItem from './AddItem'
import Support from './Support'
import { baseUrl } from '../../settings';

export default function Owner({ownerId}) {

    const [viewMode, setViewMode] = useState("orders");
    const [orders, setOrders] = useState([]);
    
    const fetchOrders = async () => {
        const orders = await (await fetch(`${baseUrl}/getOrders/${ownerId}`)).json();
        await setOrders(orders);
    }

    useEffect(()=>{
        (async () => {
            await fetchOrders();
          })();
    },[])

    const deleteItemButtonHandler = async (id) => {
        const success = await (await fetch(`${baseUrl}/deleteOrder/${id}`, { 
            method: "DELETE",
            body: JSON.stringify({ id: id })
        })).json();
        if ( success ) {
            Alert.alert(`Order deleted!`);
            fetchOrders();
        } else Alert.alert(`Error deleting order!`);
    }

    const AddItemButtonHandler = (obj) => {
        fetch(`${baseUrl}/addItem/`,{
            method:"post",
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                name: obj.name,
                price: obj.price,
                quantity: obj.quantity,
                restaurantId: ownerId,
                imgUrl: obj.imgUrl
            })
        })
        .then(res=>res.json())
        .then(data=>{
            Alert.alert(`New Item has been Added`);
            console.log("This is received:-", data);
        })
        .catch(err=>{
            Alert.alert("Some Error while Adding the Item...")
            console.log(err.message);
        });
    }

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

                        <TouchableOpacity
                            style={{ 
                                flex: 1,
                                backgroundColor: viewMode === "add" ? "#999999" : null, 
                                margin: 5,
                                borderRadius: 8,
                            }}
                            onPress={() => setViewMode("add")}
                        >
                                <View
                                    style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Text style={{ marginLeft: 0, fontSize: 16,  lineHeight: 22, color: "black" }}>Add Items</Text>
                                </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{ 
                                flex: 1,
                                backgroundColor: viewMode === "support" ? "#999999" : null, 
                                margin: 5,
                                borderRadius: 8,
                            }}
                            onPress={() => setViewMode("support")}
                        >
                            <View
                                    style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                <Text style={{ marginLeft: 0, fontSize: 16,  lineHeight: 22, color: "black" }}>Support</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>  

                {viewMode === "orders" && <Orders orders={orders} deleteItemButtonHandler={deleteItemButtonHandler} />}
                {viewMode === "add" && <AddItem AddItemButtonHandler={AddItemButtonHandler} />}
                {viewMode === "support" && <Support/>}
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
