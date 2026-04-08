import { Image, StyleSheet, View } from "react-native";

export const AppLogoMark = () => (
  <View style={styles.frame}>
    <Image
      source={require("../../../assets/pdfs/logo/FBLA Central Logo.png")}
      style={styles.logo}
      resizeMode="contain"
    />
  </View>
);

const styles = StyleSheet.create({
  frame: {
    paddingHorizontal: 8
  },
  logo: {
    width: 34,
    height: 34
  }
});
