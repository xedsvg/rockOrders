import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";

export default function Home({ GoToTableHandler, LoginButtonHandler }) {
  
  const [image, setImage] = useState(null);
  const [idData, setIdData] = useState(null);  //table 3
  
  const clickImage = async () => {
    setIdData('63dce85b98df5617195153fc');
  };

  return (
    <View>
      <Image
        style={{
          width: 270,
          height: 270,
          alignSelf: "center",
          marginBottom: 30,
        }}
        source={require("../assets/images/qr_code.gif")}
      />

      <TouchableOpacity
        style={{ paddingTop: 10, marginTop: 10, marginBottom: 40, margin: 10 }}
        onPress={() => {
          clickImage();
        }}
      >
        <View style={styles.button}>
          <Text
            style={{
              color: "white",
              textAlign: "center",
            }}
          >
            Scan QR code
          </Text>
        </View>
      </TouchableOpacity>

      {idData ? (
        <TouchableOpacity
          style={{
            paddingTop: 10,
            marginTop: 10,
            marginBottom: 40,
            margin: 10,
          }}
          onPress={async () => {
            await GoToTableHandler(idData);
          }}
        >
          <View style={styles.button}>
            <Text
              style={{
                color: "white",
                textAlign: "center",
              }}
            >
              Go to Table
            </Text>
          </View>
        </TouchableOpacity>
      ) : null}

      {location.hostname === "hlocalhost" ? (
        <>
          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: "black",
              marginHorizontal: 50,
              marginBottom: 20,
            }}
          />
          <Text
            style={{
              color: "red",
              textAlign: "center",
            }}
          >
            For Shop owner use only*
          </Text>

          <TextInput
            style={{
              height: 40,
              backgroundColor: "white",
              color: "black",
              borderWidth: 1,
              borderColor: "#D1D1D1",
              borderRadius: 5,
              padding: 10,
              marginTop: 28,
              //
              fontSize: 14,
              marginHorizontal: 10,
            }}
            placeholder="Owner password"
            // value={" "}
            onChangeText={(text) => setRestaurantId(text)}
          />
          {/* Shop ID Button */}
          <TouchableOpacity
            style={{
              paddingTop: 10,
              marginTop: 20,
              marginBottom: 20,
              margin: 10,
            }}
            onPress={async () => {
              await LoginButtonHandler(restaurantId);
            }}
          >
            <View
              style={{
                backgroundColor: "gray",
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
                Login Owner
              </Text>
            </View>
          </TouchableOpacity>
        </>
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
