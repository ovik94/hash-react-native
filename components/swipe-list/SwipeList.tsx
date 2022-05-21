import { SwipeListView } from "react-native-swipe-list-view";
import { StyleSheet, View, TouchableOpacity, Animated } from "react-native";
import { Layout } from "@ui-kitten/components";
import React, { useRef } from "react";

const styles = StyleSheet.create({
  container: {},
  rowBack: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backBtnLeft: {
    backgroundColor: '#CD3264',
    left: 0,
  },
  backBtnRight: {
    backgroundColor: '#147D78',
    right: 0,
  },
  trash: {
    height: 25,
    width: 25,
  },
});

interface ISwipeList {
  data: Array<{
    id: string;
    [other: string]: any
  }> | null;
  renderItem: (rowData: any, rowMap: { string: any }) => JSX.Element;
  leftActionComponent?: JSX.Element;
  rightActionComponent?: JSX.Element;
  onLeftAction?: (key: string) => void;
  onRightAction?: (key: string) => void;

  [otherProps: string]: any;
}

export default function SwipeList({
  data,
  renderItem,
  leftActionComponent,
  rightActionComponent,
  onLeftAction,
  onRightAction,
  ...otherProps
}: ISwipeList) {
  const rowSwipeAnimatedValues: { [key: string]: Animated.Value } = {};
  const animatedValueRef = useRef(rowSwipeAnimatedValues)

  const renderHiddenItem = (data: any, rowMap: any) => {
    if (!animatedValueRef.current[data.item.id]) {
      animatedValueRef.current[data.item.id] = new Animated.Value(0);
    }

    return (
      <View style={styles.rowBack}>
        <TouchableOpacity
          style={[styles.backBtn, styles.backBtnLeft]}
          onPress={onLeftAction ? () => onLeftAction(data.item.id) : undefined}
        >
          <Animated.View
            style={{
              transform: [{
                scale: animatedValueRef.current[data.item.id]
                  .interpolate({
                    inputRange: [1, 90],
                    outputRange: [0, 1.5],
                    extrapolate: 'clamp'
                  })
              }]
            }}
          >
            {leftActionComponent}
          </Animated.View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.backBtn, styles.backBtnRight]}
          onPress={onRightAction ? () => onRightAction(data.item.id) : undefined}
        >
          <Animated.View
            style={{
              transform: [{
                scale: animatedValueRef.current[data.item.id]
                  .interpolate({
                    inputRange: [1, 90],
                    outputRange: [0, 1.5],
                    extrapolate: 'clamp'
                  })
              }]
            }}
          >
            {rightActionComponent}
          </Animated.View>
        </TouchableOpacity>
      </View>
    );
  }

  const onSwipeValueChange = (swipeData: { key: string; value: number; direction: 'left' | 'right'; isOpen: boolean; }) => {
    const { key, value } = swipeData;
    animatedValueRef.current[key].setValue(Math.abs(value));
  };

  return (
    <Layout style={styles.container}>
      <SwipeListView
        data={data}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        leftOpenValue={75}
        stopLeftSwipe={75}
        rightOpenValue={-75}
        stopRightSwipe={-75}
        useNativeDriver={false}
        onSwipeValueChange={onSwipeValueChange}
        disableLeftSwipe={!Boolean(rightActionComponent)}
        disableRightSwipe={!Boolean(leftActionComponent)}
        {...otherProps}
      />
    </Layout>
  );
}