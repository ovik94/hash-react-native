import React, { useState } from 'react';
import { Controller, FieldError } from 'react-hook-form';
import { IndexPath, Layout, Select, SelectItem } from "@ui-kitten/components";
import { StyleSheet } from "react-native";

interface IFormSelect {
  name: string;
  label: string;
  items: Array<{ value: string; label: string; }>
  control: any;
  defaultValue?: string;
  disabled?: boolean;
  error?: FieldError;
  required?: boolean;
  styles?: any;
  caption?: string;

  [otherProps: string]: any
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16
  }
});

export default function FormSelect({
  name,
  control,
  label,
  error,
  required,
  disabled,
  defaultValue,
  items,
  caption,
  ...otherProps
}: IFormSelect) {
  return (
    <Controller
      control={control}
      rules={{
        required
      }}
      defaultValue={defaultValue}
      name={name}
      render={({ field: { onChange, value } }) => {
        const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0));

        const onSelect = (index: IndexPath | IndexPath[]) => {
          if (index instanceof IndexPath) {
            const selectedValue = items[index.row].value;
            onChange(selectedValue);
            setSelectedIndex(index);
          }
        };

        return (
          <Layout style={styles.container}>
            <Select
              label={label}
              selectedIndex={selectedIndex}
              disabled={disabled}
              onSelect={onSelect}
              value={value || otherProps.placeholder}
              status={error ? 'danger' : 'basic'}
              caption={error?.message || caption}
              {...otherProps}
            >
              {items.map(item => <SelectItem title={item.label} key={item.value}/>)}
            </Select>
          </Layout>
        )
      }}
    />
  )
};
