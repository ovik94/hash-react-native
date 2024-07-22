import React, { ReactElement } from "react";
import { StyleSheet, ImageProps, View } from "react-native";
import { Button, ButtonProps, Spinner } from "@ui-kitten/components";
import { RenderFCProp } from "@ui-kitten/components/devsupport";

const styles = StyleSheet.create({
  indicator: {
    justifyContent: "center",
    alignItems: "center",
  },
});

const LoadingIndicator = (props: ImageProps): ReactElement => (
  <View style={[props.style, styles.indicator]}>
    <Spinner size="small" />
  </View>
);

interface ILoadingButton extends ButtonProps {
  readonly loading: boolean;
}
export default function LoadingButton({ loading, ...props }: ILoadingButton) {
  return (
    <Button
      {...props}
      appearance={loading ? "outline" : "filled"}
      accessoryLeft={
        loading
          ? (LoadingIndicator as RenderFCProp<Partial<ImageProps>> | undefined)
          : undefined
      }
    >
      {props.children}
    </Button>
  );
}
