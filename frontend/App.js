import { baseUrl } from "./settings";

import React, { useEffect, useState } from "react";
import { View, Center, Text, NativeBaseProvider, VStack, useDisclose, Icon } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";

import { theme } from "./theme";

import Navbar from "./components/Navbar";
import QrScan from "./views/QrScan";
import Table from "./views/Table";
import Menu from "./views/Menu";

// import Owner from "./views/Owner/Owner";

export default function App() {

  /*********************** Prep this for a state library ************************/
  /*********** Navigation and navigation history ************/
  const [viewMode, setViewMode] = useState("scan");
  const [viewHistory, setViewHistory] = useState(["scan"]);

  /*********** User vs Owner view ************/
  const [user, setUser] = useState("customer");

  /*********** Restaurant info ************/
  const [restaurantId, setRestaurantId] = useState(null);
  const [restaurantName, setRestaurantName] = useState(null);

  /*********** Table info ************/
  const [tableId, setTableId] = useState(null);
  const [tableInfo, setTableInfo] = useState(null);

  /*********** Menu info ************/  
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [category, setCategory] = useState("");


  /*********** Tab and Cart view state ************/
  const [viewCartOrTabButton, setViewCartOrTabButton] = useState("");
  const { isOpen, onOpen, onClose } = useDisclose();

  useEffect(() => {
    (async () => {
      const {
        restaurantId = "RestaurantIdNotSet",
        restaurantName = "Restaurant name not set",
      } = await (await fetch(`${baseUrl}/settings`)).json();
      await setRestaurantId(restaurantId);
      await setRestaurantName(restaurantName);
    })();
  }, []);
  
  const grabTableInfo = async (tableId) => {
    const { currentTab: { orders }, tableNo } = await (await fetch(`${baseUrl}/getTableSession/${tableId}`)).json();
    await setTableInfo({ tableNo });
    await setOrders(orders);
  };



  const GoToMenuButtonHandler = async () => {
    const goToView = "menu";
    await setViewHistory([...viewHistory, goToView]);
    await setViewMode(goToView);
  };

  const GoToTableHandler = async (tableId) => {
    const goToView = "table";
    await grabTableInfo(tableId);
    await setTableId(tableId);
    await setViewHistory([...viewHistory, goToView]);
    await setViewMode(goToView);
  };

  const BackButtonHandler = async () => {
    const goToView = viewHistory[viewHistory.length - 2 ];
    await setViewMode(goToView);
    await setViewHistory(viewHistory.slice(0, -1));
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
      <VStack flex={1} space={2} alignItems="center" bg="brand.800">
      
      <Navbar restaurantName={restaurantName}>
        {(user == "customer" && viewMode != "scan") ? (
          [<Center w="20" key="back"> 
            <Icon as={<MaterialIcons name="chevron-left" />} size={5} onPress={BackButtonHandler} color="blueGray.200" />
            <Text color="blueGray.200">Back</Text>
          </Center>,
          <Center w="20" key="menu" > 
            <Icon as={<MaterialIcons name="event-note" />} onPress={GoToMenuButtonHandler} size={5} color="blueGray.200" />
            <Text color="blueGray.200">Menu</Text>
        </Center>,
          <Center w="20" key="cart"> 
            <Icon as={<MaterialIcons name={viewCartOrTabButton.includes("Order") ? "shopping-cart" : "list-alt"} />} onPress={onOpen} size={5} color="blueGray.200" />
            <Text color="blueGray.200">{viewCartOrTabButton}</Text>
        </Center>]
        ) : null }
      </Navbar>

      <View flex={1} minWidth="full" padding="3vw" borderTopRadius={25} zIndex={1} top="-4vh" background="paper.medium">
        {viewMode === "scan" && user == "customer" && (
          <QrScan
            restaurantName={restaurantName}
            restaurantId={restaurantId}
            tableId={tableId}
            setTableId={setTableId}
            GoToTableHandler={GoToTableHandler}
            LoginButtonHandler={LoginButtonHandler}
          />
        )}

        {viewMode === "menu" && user == "customer" && (
          <Menu
          restaurantId={restaurantId}
          cart={cart} setCart={setCart} 
          BackButtonHandler={BackButtonHandler} setViewCartOrTabButton={setViewCartOrTabButton}
          isOpen={isOpen} onOpen={onOpen} onClose={onClose} 
          products={products} setProducts={setProducts}
          categories={categories} setCategories={setCategories}
          subCategories={subCategories} setSubCategories={setSubCategories}
          selectedCategories={selectedCategories} setSelectedCategories={setSelectedCategories}
          category={category} setCategory={setCategory}
          />
        )}
        {viewMode === "table" && user == "customer" && <Table tableInfo={tableInfo} orders={orders} setOrders={setOrders} cart={cart} setCart={setCart} isOpen={isOpen} onOpen={onOpen} onClose={onClose} setViewCartOrTabButton={setViewCartOrTabButton}/>}

        {/* {user == "owner" && <Owner ownerId={ownerId} />} */}
      </View>
      </VStack>
    </NativeBaseProvider>
  );
}