import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Linking } from 'react-native';
import { Icon, Layout, Spinner } from '@ui-kitten/components';
import SwipeListItem from '../components/swipe-list-item/SwipeListItem';
import SwipeList from '../components/swipe-list/SwipeList';
import useStores from '../hooks/useStores';
import { IContractors } from '../stores/ContractorsStore';
import { IDailyReport } from '../stores/DailyReportsStore';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  loading: {
    flex: 1,
    marginTop: 32,
    justifyContent: 'center',
    alignItems: 'center'
  },
  swipeListIcon: {
    width: 24,
    height: 24,
    tintColor: '#fff',
    marginHorizontal: 8
  }
});

export default function ContractorsScreen() {
  const { contractorsStore: { fetchContractors, contractors, isLoading } } = useStores();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!contractors) {
      fetchContractors();
    }
  }, [contractors]);

  const renderItem = ({ item }: { item: IContractors }) => (
    <SwipeListItem
      iconName="person-outline"
      title={item.title}
      subtitle={`${item.manager || ''} ${item.description ? (`- ${item.description}`) : ''}`}
      primaryText={item.phone}
    />
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchContractors().then(() => setRefreshing(false));
  };

  const rightActionComponent = <Icon style={styles.swipeListIcon} name="phone-call-outline" />;

  const onRightAction = (id: string) => {
    const tel = ((contractors || []).find(item => item.id === id) || {} as IContractors).phone;
    Linking.openURL(`tel:${tel}`);
  };

  return (
    <View style={styles.container}>
      {isLoading && <Layout style={styles.loading}><Spinner /></Layout>}
      {!isLoading && (
        <SwipeList
          data={contractors}
          renderItem={renderItem}
          refreshing={refreshing}
          onRefresh={onRefresh}
          keyExtractor={(item: IDailyReport) => item.id}
          rightActionComponent={rightActionComponent}
          onRightAction={onRightAction}
        />
      )}
    </View>
  );
}
