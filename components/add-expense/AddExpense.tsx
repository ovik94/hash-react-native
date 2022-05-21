import React, { useRef, useState } from 'react';
import { Animated, StyleSheet } from 'react-native';
import uuid from 'react-native-uuid';
import { Button, Card, Icon, IndexPath, Input, Layout, Modal, Select, SelectItem, Text } from '@ui-kitten/components';
import Colors from '../../constants/Colors';
import SwipeListItem from '../swipe-list-item/SwipeListItem';
import SwipeList from '../swipe-list/SwipeList';
import { formatAmountString } from '../utils/formatAmountString';

export interface IExpense {
  id: string;
  category: ICategory;
  sum: string;
  title?: string;
  comment?: string;
}

interface IAddExpense {
  data: Array<IExpense> | null;
  onAdd: (data: IExpense) => void;
  onDelete: (id: string) => void;
  showModal: boolean;
  setShowModal: (value: boolean) => void;
}

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
  title: {
    fontWeight: 'bold',
    marginBottom: 16
  },
  select: {
    flexGrow: 2,
    marginBottom: 16
  },
  button: {
    marginVertical: 32
  },
  input: {
    marginBottom: 16
  },
  sheetContainer: {
    padding: 32,
    height: 250
  },
  categoryIcon: {
    height: 24,
    width: 24,
    tintColor: Colors.light.tabIconDefault,
    marginHorizontal: 8
  }
});

export interface ICategory {
  id: string;
  title: string;
  icon: string;
}

const Categories: Array<ICategory> = [
  { id: 'kitchen', title: 'Закуп сырья кухня', icon: 'shopping-cart' },
  { id: 'beer', title: 'Закуп пиво', icon: 'shopping-cart' },
  { id: 'salary', title: 'ФОТ', icon: 'heart' },
  { id: 'courier', title: 'Курьер', icon: 'car' },
  { id: 'taxi', title: 'Такси', icon: 'car' },
  { id: 'marketing', title: 'Маркетинг, промо-материалы', icon: 'globe' },
  { id: 'household', title: 'Хоз. нужда', icon: 'globe' },
  { id: 'other', title: 'Прочие расходы', icon: 'more-horizontal' }
];

export default function AddExpense({ onAdd, showModal, setShowModal, data, onDelete }: IAddExpense) {
  const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0));
  const [category, setCategory] = useState<ICategory | undefined>(undefined);
  const [sum, setSum] = useState<string | undefined>(undefined);
  const [comment, setComment] = useState<string | undefined>(undefined);
  const [hasErrorCategory, setErrorCategory] = useState(false);
  const [hasErrorSum, setErrorSum] = useState(false);
  const rowSwipeAnimatedValues: { [key: string]: Animated.Value } = {};
  const animatedValueRef = useRef(rowSwipeAnimatedValues);

  const onSelect = (index: IndexPath | IndexPath[]) => {
    if (index instanceof IndexPath) {
      setSelectedIndex(index);
      setCategory(Categories[index.row]);
      setErrorCategory(false);
    }
  };

  const onChangeSum = (nextValue: string) => {
    setSum(nextValue);
    setErrorSum(false);
  };

  const onChangeComment = (value: string) => {
    setComment(value);
  };

  const clear = () => {
    setCategory(undefined);
    setSum(undefined);
    setErrorCategory(false);
    setErrorSum(false);
    setComment(undefined);
  };

  const onSubmit = () => {
    if (category && sum) {
      onAdd({ category, sum, comment, id: String(uuid.v4()) });
      clear();
    }

    if (!category) {
      setErrorCategory(true);
    }

    if (!sum) {
      setErrorSum(true);
    }
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
          subtitle={item.comment}
          primaryText={formatAmountString(item.sum)}
        />
      </Animated.View>
    );
  };

  const rightActionComponent = <Icon style={styles.swipeListIcon} name="trash" />;

  return (
    <Layout style={styles.container}>
      <SwipeList
        data={data}
        renderItem={renderItem}
        rightActionComponent={rightActionComponent}
        keyExtractor={(item: IExpense) => item.id}
        onRightAction={onDeleteExpense}
      />
      <Modal
        visible={showModal}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setShowModal(false)}
        style={{ width: 300 }}
      >
        <Card>
          <Text category="h6" style={styles.title}>Добавить расходную операцию</Text>
          <Select
            style={styles.select}
            label="Категория расхода"
            status={hasErrorCategory ? 'danger' : 'basic'}
            selectedIndex={selectedIndex}
            onSelect={onSelect}
            value={category?.title || 'Категория'}
          >
            {Categories.map(item => (
              <SelectItem
                accessoryLeft={<Icon style={styles.categoryIcon} name={item.icon} />}
                title={item.title}
                key={item.id}
              />
            ))}
          </Select>
          <Input
            style={styles.input}
            value={sum}
            label="Сумма"
            status={hasErrorSum ? 'danger' : 'basic'}
            placeholder="Введите сумму"
            onChangeText={onChangeSum}
            keyboardType="decimal-pad"
          />
          <Input
            value={comment}
            label="Комментарий"
            placeholder="Введите комментарий"
            onChangeText={onChangeComment}
          />
          <Button style={styles.button} onPress={onSubmit}>Добавить</Button>
        </Card>
      </Modal>
    </Layout>
  );
}
