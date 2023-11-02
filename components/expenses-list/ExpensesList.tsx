import React, { FC, useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Animated, StyleSheet } from 'react-native';
import { Button, Icon, IconProps, Layout, Spinner, Text } from '@ui-kitten/components';
import Colors from '../../constants/Colors';
import useStores from '../../hooks/useStores';
import { IExpense } from '../../stores/ExpensesStore';
import SwipeListItem from '../swipe-list-item/SwipeListItem';
import SwipeList from '../swipe-list/SwipeList';
import { formatAmountString } from '../utils/formatAmountString';

const styles = StyleSheet.create({
  container: {
    marginVertical: 16
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  swipeListIcon: {
    width: 24,
    height: 24,
    tintColor: '#fff',
    marginHorizontal: 8
  },
  expenseIcon: {
    width: 24,
    height: 24,
    tintColor: Colors.light.tabIconDefault,
    marginRight: 16
  },
  reloadButton: {
    marginTop: 32
  },
  loading: {
    flex: 1,
    marginTop: 32,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

const ReloadIcon = (props: IconProps) => (
  <Icon {...props} name="sync" />
);

export type IExpenseType = 'reportAdd' | 'reportUpdate' | 'expensesList';
interface IExpenseList {
  data?: Array<IExpense>;
  type: IExpenseType;
  hasRefresh?: boolean;
}

const ExpensesList: FC<IExpenseList> = ({ data, type, hasRefresh = true }) => {
  const { expensesStore: { fetchExpenses, deleteExpense, setExpenses, expenses, screenMessage } } = useStores();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const rowSwipeAnimatedValues: { [key: string]: Animated.Value } = {};
  const animatedValueRef = useRef(rowSwipeAnimatedValues);

  useEffect(() => {
    if (type === 'reportUpdate' && data) {
      setExpenses(data);
    } else {
      setLoading(true);
      fetchExpenses(data).finally(() => setLoading(false));
    }
  }, [type]);

  const onDelete = (id: string) => {
    deleteExpense(id);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchExpenses(data).then(() => setRefreshing(false));
  };

  const onDeleteExpense = (id: string) => {
    Animated.timing(animatedValueRef.current[id], {
      toValue: 0,
      duration: 300,
      useNativeDriver: false
    }).start(() => onDelete(id));
  };

  const renderItem = ({ item }: { item: IExpense }) => {
    if (!animatedValueRef.current[item.id]) {
      animatedValueRef.current[item.id] = new Animated.Value(1);
    }

    return (
      <Animated.View
        style={{
          height: animatedValueRef.current[item.id].interpolate({
            inputRange: [0, 1],
            outputRange: [0, 50]
          })
        }}
      >
        <SwipeListItem
          iconComponent={<Icon style={styles.expenseIcon} name={item.category.icon} />}
          title={item.category.title}
          subtitle={`${item.counterparty || ''} ${item.comment || ''}`}
          primaryText={formatAmountString(item.sum)}
        />
      </Animated.View>
    );
  };

  const rightActionComponent = <Icon style={styles.swipeListIcon} name="trash" />;

  const onReload = () => {
    setLoading(true);
    fetchExpenses(data).then(() => setLoading(false));
  };

  return (
    <Layout style={styles.container}>
      {loading && <Layout style={styles.loading}><Spinner /></Layout>}
      {!loading && (
        <>
          {expenses?.length === 0 && type === 'expensesList' && (
            <Layout>
              <Text status="info">Расходов пока нет</Text>
              <Button
                onPress={onReload}
                style={styles.reloadButton}
                size="small"
                appearance="outline"
                status="info"
                accessoryLeft={ReloadIcon}
              >
                Обновить
              </Button>
            </Layout>
          )}
          <SwipeList
            data={expenses}
            renderItem={renderItem}
            rightActionComponent={rightActionComponent}
            keyExtractor={(item: IExpense) => item.id}
            onRightAction={onDeleteExpense}
            refreshing={refreshing}
            onRefresh={hasRefresh ? onRefresh : undefined}
          />
          {!!screenMessage && <Text status="danger">{screenMessage}</Text>}
        </>
      )}
    </Layout>
  );
};

export default observer(ExpensesList);
