import React, { ReactElement } from 'react';
import { StyleSheet } from 'react-native';
import { Icon, IconProps, Layout, Text } from "@ui-kitten/components";

export interface IListItem {
  iconComponent?: JSX.Element;
  iconName?: string;
  title?: string;
  subtitle?: string;
  primaryText?: string;
}

const SwipeListItem = ({ iconComponent, title, subtitle, primaryText, iconName }: IListItem) => {
  const icon = iconComponent || <Icon style={styles.icon} name={iconName}/>;

  return (
    <Layout style={styles.inner}>
      {icon}
      <Layout style={styles.info}>
        <Text category="h6">{title}</Text>
        {subtitle && <Text category="label">{subtitle}</Text>}
      </Layout>
      <Text category="p2" style={{ fontWeight: 'bold' }}>{primaryText}</Text>
    </Layout>
  );
}

const styles = StyleSheet.create({
  inner: {
    paddingVertical: 8,
    paddingRight: 8,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    borderBottomWidth: 1,
  },
  info: {
    flex: 1,
    justifyContent: 'space-between'
  },
  icon: {
    width: 32,
    height: 32,
    tintColor: '#8F9BB3',
    marginRight: 8
  }
});

export default SwipeListItem;