import React from 'react';
import { Controller, FieldError } from 'react-hook-form';
import { StyleSheet, KeyboardType } from 'react-native';
import { Input, Layout } from '@ui-kitten/components';

interface IFormTextInput {
  name: string;
  label: string;
  control: any;
  defaultValue?: string;
  caption?: string;
  error?: FieldError;
  type?: KeyboardType;
  required?: boolean;

  [otherProps: string]: any
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16
  }
});

export default function FormTextInput({
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
        required
      }}
      name={name}
      defaultValue={defaultValue}
      render={({ field: { onChange, value } }) => (
        <Layout style={styles.container}>
          <Input
            label={label}
            onChangeText={onChange}
            value={value}
            keyboardType={type}
            status={error ? 'danger' : 'basic'}
            caption={error?.message || caption}
            {...otherProps}
          />
        </Layout>
      )}
    />
  );
}
