import { baseUrl } from "./settings";

import React, { useEffect, useState } from "react";

import { View, Center, Text, extendTheme, NativeBaseProvider, VStack, useTheme, ScrollView, Heading } from "native-base";

const newColorTheme = {
  brand: {
    900: "#8287af",
    800: "#7c83db",
    700: "#b3bef6",
  },
};
const theme = extendTheme({ colors: newColorTheme });

import Navbar from "./views/Navbar";
import Home from "./views/Home";
import Table from "./views/Table";
import Menu from "./views/Menu";
// import Owner from "./views/Owner/Owner";

export default function App() {

  const [viewMode, setViewMode] = useState("scan");

  const [user, setUser] = useState("customer");
  const [ownerId, setOwnerId] = useState();

  const [qrCode_url, setQrCode_url] = useState(null);

  const [restaurantId, setRestaurantId] = useState(null);
  const [restaurantName, setRestaurantName] = useState(null);

  const [tableId, setTableId] = useState(null);

  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    (async () => {
      const {
        restaurantId = "RestaurantIdNotSet",
        restaurantName = "Restaurant name not set",
      } = await (await fetch(`${baseUrl}/settings`)).json();
      await setRestaurantId(restaurantId);
      await setRestaurantName(restaurantName);
      console.log(restaurantId, restaurantName)
    })();
  }, []);
  

  const GoToMenuButtonHandler = async () => {
    await setViewMode("menu");
  };

  const GoToTableHandler = async (tableId) => {
    await setTableId(tableId);
    await setViewMode("table");
  };

  const ExitButtonHandler = () => {
    setViewMode("scan");
  };

  const LoginButtonHandler = async (id) => {
    const { _id } = await (await fetch(`${baseUrl}/login/${id}`)).json();
    if (_id === -1) {
      Alert.alert("Restaurant not found, #404. Try Again.");
    } else {
      setOwnerId(_id);
      setUser("owner");
    }
  };


  return (
    <NativeBaseProvider theme={theme}>
      <VStack flex={1} space={2} alignItems="center">
      
      <Navbar restaurantName={restaurantName} >
        {(user == "customer" && viewMode != "scan") ? (
          [<Center w="20" rounded="md" shadow={3} key="back"> 
            <Text onPress={() => setViewMode("scan")} color="blueGray.200">Back</Text>
          </Center>,
          <Center w="20" rounded="md" shadow={3} key="menu"> 
            <Text onPress={GoToMenuButtonHandler} color="blueGray.200">Menu</Text>
        </Center>,
          <Center w="20" rounded="md" shadow={3} key="cart"> 
            <Text onPress={() => setViewMode("cart")} color="blueGray.200">View Tab</Text>
        </Center>]
        ) : null }
      </Navbar>

      <View flex={1} minWidth="full">
        {viewMode === "scan" && user == "customer" && (
          <Home
            restaurantName={restaurantName}
            GoToTableHandler={GoToTableHandler}
            LoginButtonHandler={LoginButtonHandler}
          />
        )}

        {viewMode === "menu" && user == "customer" && (
          <Menu restaurantId={restaurantId} cart={cart} setCart={setCart} ExitButtonHandler={ExitButtonHandler}/>
        )}
        {viewMode === "table" && user == "customer" && <Table orders={orders} setOrders={setOrders} cart={cart} setCart={setCart}/>}

        {/* {user == "owner" && <Owner ownerId={ownerId} />} */}
      </View>
      </VStack>
    </NativeBaseProvider>
  );
}