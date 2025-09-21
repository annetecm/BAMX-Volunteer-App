import React, { FC } from "react";
import {View, ScrollView, Image, Text, StyleSheet } from "react-native";
import { SafeAreaView} from 'react-native-safe-area-context';
interface Props {
  title?: string;
}

const VolunteerScreen: FC<Props> = ({ title = "Voluntarios BAMX" }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll}>
        <Image
          source={{
            uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/TMlVuEdvrh/ihk3pw34_expires_30_days.png",
          }}
          resizeMode="stretch"
          style={styles.mainImage}
        />
        <Text style={styles.title}>{title}</Text>
        <View style={styles.footer}>
          <Image
            source={{
              uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/TMlVuEdvrh/lpro584x_expires_30_days.png",
            }}
            resizeMode="stretch"
            style={styles.icon}
          />
          <Text style={styles.footerText}>{"12 dev"}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FF9B63" },
  scroll: { flex: 1, paddingHorizontal: 50 },
  mainImage: { height: 260, marginTop: 223, marginBottom: 22, alignSelf: "stretch" },
  title: { color: "#FFFFFF", fontSize: 16, marginBottom: 322, fontWeight: "bold"},
  footer: { alignItems: "center", marginBottom: 50 },
  icon: { width: 21, height: 10, marginBottom: 4 },
  footerText: { color: "#FFFFFF", fontSize: 12, fontWeight: "bold" },
});

export default VolunteerScreen;
