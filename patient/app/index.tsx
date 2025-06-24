import { Text, View } from "react-native";
import { StyleSheet } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={styles.center}>welcome to medimap search a nearby pharmacy now!</Text>
    </View>
  );
}

const styles = StyleSheet.create({   
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  center : {     textAlign: "center" },
  text: {
    fontSize: 20,
    color: "#333",
  },
});