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
  pattern?: RegExp;

  [otherProps: string]: any
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8
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
  pattern = /^\d*(\.\d{0,2})?$/,
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
      render={({ field: { onChange, value } }) => {
        const onChangeText = (text: string) => {
          if (pattern && !pattern.test(text)) {
            if (!value) {
              onChange('');
            }
            return;
          }

          onChange(text)
        };

        return (
          <Layout style={styles.container}>
            <Input
              label={label}
              onChangeText={onChangeText}
              value={value}
              keyboardType={type}
              status={error ? 'danger' : 'basic'}
              caption={error?.message || caption}
              {...otherProps}
            />
          </Layout>
        )
      }}
    />
  );
}
