import { StyleSheet, Text, View } from 'react-native';


export default function Support() {

    return (
        <View>
            <Text style={{ alignSelf: "center", marginBottom: 20, fontSize: 16,  color: "black" }}>Not satisfied with our app?</Text>
            <View style={{borderBottomWidth: 1, borderBottomColor: "black", marginHorizontal: 90, marginBottom: 40}} />
            <Text style={{marginLeft: 20, fontSize: 16, lineHeight: 22,  color: "black" }}>
                Meh.
            </Text>

            <View style={{flexDirection: "row"}}>
                <Text style={{marginLeft: 20, marginTop: 40, fontSize: 16, lineHeight: 22,  color: "black" }}>
                    Contact Sic.
                </Text>
            </View>

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
