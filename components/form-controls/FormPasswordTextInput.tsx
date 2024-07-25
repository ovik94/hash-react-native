import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { ImageProps, StyleSheet } from "react-native";
import { Input, Layout, Icon } from "@ui-kitten/components";
import { IFormTextInput } from "./FormTextInput";

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
});

export default function FormPasswordTextInput({
  name,
  control,
  label,
  error,
  caption,
  type,
  defaultValue,
  required,
  ...otherProps
}: IFormTextInput) {
  return (
    <Controller
      control={control}
      rules={{
        required,
      }}
      name={name}
      defaultValue={defaultValue}
      render={({ field: { onChange, value } }) => {
        const [secureTextEntry, setSecureTextEntry] = useState(true);

        const toggleSecureEntry = (): void => {
          setSecureTextEntry(!secureTextEntry);
        };

        const renderIcon = (props?: Partial<ImageProps>) => (
          <Icon
            {...props}
            onPress={toggleSecureEntry}
            name={secureTextEntry ? "eye-off" : "eye"}
          />
        );

        const onChangeText = (text: string) => {
          onChange(text);
        };

        return (
          <Layout style={styles.container}>
            <Input
              label={label}
              onChangeText={onChangeText}
              value={value}
              keyboardType={type}
              status={error ? "danger" : "basic"}
              caption={error?.message || caption}
              accessoryRight={renderIcon}
              secureTextEntry={secureTextEntry}
              {...otherProps}
            />
          </Layout>
        );
      }}
    />
  );
}
