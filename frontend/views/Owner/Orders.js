import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

export default function Order({ orders, deleteItemButtonHandler }) {
  return (
    <View>
      <Text
        style={{
          alignSelf: "center",
          marginBottom: 40,
          fontSize: 16,
          
          color: "black",
        }}
      >
        {orders ? "Current orders" : "No orders"}
      </Text>
      {orders ? (
        <View>
          {orders.map((item) => {
            return (
              <View
                style={{
                  backgroundColor: "#ECECEC",
                  borderRadius: 10,
                  marginHorizontal: 20,
                  marginBottom: 20,
                }}
                key={item._id}
              >
                <Text
                  style={{
                    marginLeft: 0,
                    fontSize: 22,
                    
                    marginTop: 10,
                    color: "black",
                    textAlign: "center",
                  }}
                >
                  Table No. {item.tableNo}
                </Text>
                <View
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: "black",
                    marginHorizontal: 90,
                    marginTop: 10,
                  }}
                />

                <View
                  style={{
                    backgroundColor: "#C8C8C8",
                    borderRadius: 10,
                    marginTop: 20,
                    marginHorizontal: 10,
                  }}
                >
                  <Text
                    style={{
                      marginLeft: 10,
                      fontSize: 16,
                      
                      marginTop: 10,
                      color: "black",
                    }}
                  >
                    All Products:-{" "}
                  </Text>
                  <Text
                    style={{
                      marginLeft: 10,
                      fontSize: 14,
                      
                      lineHeight: 22,
                      marginTop: 10,
                      color: "black",
                    }}
                  >
                    {item.items.split(",").map((e) => {
                      return <Text key={e}>{e + "\n"}</Text>;
                    })}
                  </Text>
                </View>

                <View
                  style={{
                    backgroundColor: "#C8C8C8",
                    borderRadius: 10,
                    marginTop: 20,
                    marginHorizontal: 10,
                  }}
                >
                  <Text
                    style={{
                      marginLeft: 10,
                      fontSize: 16,
                      
                      marginTop: 10,
                      color: "black",
                    }}
                  >
                    Order Total
                  </Text>
                  <Text
                    style={{
                      marginLeft: 10,
                      fontSize: 16,
                      
                      marginTop: 10,
                      color: "green",
                      marginBottom: 10,
                    }}
                  >
                    {item.totalAmount}
                  </Text>
                </View>

                <TouchableOpacity
                  style={{
                    paddingTop: 10,
                    marginTop: 10,
                    marginBottom: 20,
                    margin: 10,
                  }}
                  onPress={async () => {
                    await deleteItemButtonHandler(item._id);
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "#222222",
                      padding: 12,
                      borderRadius: 6,
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        textAlign: "center",
                        
                      }}
                    >
                      Received by User 🖖🏼
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#222222",
    padding: 12,
    borderRadius: 6,
  },
});
