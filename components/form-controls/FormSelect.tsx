import React, { useState } from 'react';
import { Controller, FieldError } from 'react-hook-form';
import { StyleSheet } from 'react-native';
import { IndexPath, Layout, Select, SelectItem } from '@ui-kitten/components';

interface IFormSelect {
  name: string;
  label: string;
  items: Array<{ value: any; label: string; }>
  control: any;
  defaultValue?: string;
  disabled?: boolean;
  error?: FieldError;
  required?: boolean;
  styles?: any;
  caption?: string;
  renderItem?: (item: any) => JSX.Element;
  renderValue?: (data: any) => JSX.Element;

  [otherProps: string]: any
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8
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
  renderItem,
  renderValue,
  ...otherProps
}: IFormSelect) {
  const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0));

  return (
    <Controller
      control={control}
      rules={{
        required
      }}
      defaultValue={defaultValue}
      name={name}
      render={({ field: { onChange, value } }) => {
        const onSelect = (index: IndexPath | IndexPath[]) => {
          if (index instanceof IndexPath) {
            const selectedValue = items[index.row].value;
            onChange(selectedValue);
            setSelectedIndex(index);
          }
        };

        let selectValue = otherProps.placeholder;

        if (renderValue && value) {
          selectValue = renderValue(value);
        } else if (!renderValue && value) {
          selectValue = value;
        }

        return (
          <Layout style={styles.container}>
            <Select
              label={label}
              selectedIndex={selectedIndex}
              disabled={disabled}
              onSelect={onSelect}
              value={selectValue}
              status={error ? 'danger' : 'basic'}
              caption={error?.message || caption}
              {...otherProps}
            >
              {items.map(item => (renderItem ? renderItem(item.value) : <SelectItem title={item.label} key={item.value} />))}
            </Select>
          </Layout>
        );
      }}
    />
  );
}
