import React, { useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import { StyleSheet, View, Linking } from "react-native";
import { Icon, Layout, Spinner } from "@ui-kitten/components";
import SwipeListItem from "../components/swipe-list-item/SwipeListItem";
import SwipeList from "../components/swipe-list/SwipeList";
import useStores from "../hooks/useStores";
import { IDailyReport } from "../stores/DailyReportsStore";
import { ICounterparty } from "../stores/CounterpartiesStore";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  loading: {
    flex: 1,
    marginTop: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  swipeListIcon: {
    width: 24,
    height: 24,
    tintColor: "#fff",
    marginHorizontal: 8,
  },
});

const ContractorsScreen = () => {
  const {
    counterpartiesStore: { fetchCounterparties, counterparties, isLoading },
  } = useStores();
  const [refreshing, setRefreshing] = useState(false);

  const listData = useMemo(
    () => (counterparties || []).filter((item) => item.type === "provider"),
    [counterparties]
  );

  console.log(counterparties, "counterparties");
  useEffect(() => {
    if (!counterparties) {
      console.log("-----fetch-----");
      fetchCounterparties();
    }
  }, [counterparties]);

  const renderItem = ({ item }: { item: ICounterparty }) => (
    <SwipeListItem
      iconName="person-outline"
      title={`${item.name} ${item.companyName ? `(${item.companyName})` : ""}`}
      subtitle={item.description}
      primaryText={item.phone}
    />
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchCounterparties().then(() => setRefreshing(false));
  };

  const rightActionComponent = (
    <Icon style={styles.swipeListIcon} name="phone-call-outline" />
  );

  const onRightAction = (id: string) => {
    const tel = (
      (listData || []).find((item) => item.id === id) || ({} as ICounterparty)
    ).phone;
    Linking.openURL(`tel:${tel}`);
  };

  return (
    <View style={styles.container}>
      {isLoading && (
        <Layout style={styles.loading}>
          <Spinner />
        </Layout>
      )}
      {!isLoading && (
        <SwipeList
          data={listData}
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
};

export default observer(ContractorsScreen);
