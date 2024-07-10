import React, { FC, memo } from "react";
import { StyleSheet } from "react-native";
import { Button, Icon, IconProps, Layout } from "@ui-kitten/components";

interface IReloadButton {
  onReload?: () => void;
}

const styles = StyleSheet.create({
  reloadButton: {
    marginTop: 32,
  },
});

const ReloadIcon = (props: IconProps) => <Icon {...props} name="sync" />;

const ReloadButton: FC<IReloadButton> = ({ onReload }) => {
  return (
    <Layout>
      <Button
        onPress={onReload}
        style={styles.reloadButton}
        appearance="outline"
        status="info"
        accessoryLeft={ReloadIcon}
      >
        Обновить
      </Button>
    </Layout>
  );
};

export default memo(ReloadButton);
