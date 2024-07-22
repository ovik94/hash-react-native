import React, { FC, useState } from "react";
import { StyleSheet } from "react-native";
import { Icon, Layout, MenuItem, OverflowMenu } from "@ui-kitten/components";
import Colors from "../../constants/Colors";

interface IHeaderRight {
  navigation: any;
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 8,
  },
});

const HeaderRightFt: FC<IHeaderRight> = ({ navigation }) => {
  const [visible, setVisible] = useState(false);

  const renderToggle = () => (
    <Icon
      name="more-vertical"
      onPress={() => setVisible(true)}
      style={{ width: 32, height: 32, marginRight: 16 }}
      fill={Colors.light.text}
    />
  );

  const onAddReport = () => {
    navigation.navigate("AddDailyReportFT");
    setVisible(false);
  };

  return (
    <Layout style={styles.container}>
      <OverflowMenu
        anchor={renderToggle}
        visible={visible}
        placement="bottom end"
        onBackdropPress={() => setVisible(false)}
      >
        <MenuItem title="Создать отчет" onPress={onAddReport} />
      </OverflowMenu>
    </Layout>
  );
};

export default HeaderRightFt;
