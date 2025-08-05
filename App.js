import React, { useState, useEffect } from "react";
import { Platform, StatusBar, StyleSheet, View, Text } from "react-native";

import AppNavigator from "./navigation/AppNavigator";

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        {Platform.OS === "ios" && <StatusBar barStyle="default" />}
        <AppNavigator />
      </View>
    );
  }
}

async function loadResourcesAsync() {
  await Promise.all(
    [
      // Replace the Asset.loadAsync calls with standard React Native Image component
      require("./assets/images/back_rsa.png"),
      require("./assets/images/rsa_logo.png"),
      require("./assets/images/amv_internacional.png"),
      require("./assets/images/amv_local.png"),
      require("./assets/images/patrimonial.png"),
      // ...
    ].map((imageSource) => Image.prefetch(imageSource))
  );

  // Keep the useFonts part as it is
  await useFonts({
    // This is the font that we are using for our tab bar

    //Fuentes
    "catamaran-black": require("./assets/fonts/Catamaran-Black.ttf"),
    "catamaran-bold": require("./assets/fonts/Catamaran-Bold.ttf"),
    "catamaran-ex-bold": require("./assets/fonts/Catamaran-ExtraBold.ttf"),
    "catamaran-ex-light": require("./assets/fonts/Catamaran-ExtraLight.ttf"),
    "catamaran-light": require("./assets/fonts/Catamaran-Light.ttf"),
    "catamaran-medium": require("./assets/fonts/Catamaran-Medium.ttf"),
    catamaran: require("./assets/fonts/Catamaran-Regular.ttf"),
    "catamaran-sem-bold": require("./assets/fonts/Catamaran-SemiBold.ttf"),
    "catamaran-thin": require("./assets/fonts/Catamaran-Thin.ttf"),

    //Fuente de Iconos
    icomoon: require("./assets/fonts/icomoon.ttf"),
  });
}

function handleLoadingError(error: Error) {
  console.warn(error);
}

function handleFinishLoading(setLoadingComplete) {
  setLoadingComplete(true);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
