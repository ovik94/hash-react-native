import React, { createRef, useContext, useState } from 'react';
import { StyleSheet } from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import { Button, Icon, Layout, Spinner, Text, ViewPager } from '@ui-kitten/components';
import Colors from '../../constants/Colors';
import { CoreContext } from '../../core/CoreContext';
import { IDailyReport } from './DailyReportScreen';
import ExpensesStep from './ExpensesStep';
import InfoStep from './InfoStep';
import ReceiptsStep from './ReceiptsStep';

const StepScreens = [InfoStep, ReceiptsStep, ExpensesStep];

export interface IStepProps {
  onNext: () => void;
  onPrevious: () => void;
  setData: (value: any) => void;
  data: IDailyReport;
  onComplete: (data: IDailyReport) => void;
  type: string;
}

const styles = StyleSheet.create({
  stepContainer: {
    paddingHorizontal: 16
  },
  loading: {
    flex: 1,
    marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  sheet: {
    padding: 16
  },
  sheetContent: {
    width: '100%',
    minHeight: 200,
    padding: 32
  },
  sheetButton: {
    width: '100%',
    marginTop: 32
  },
  sheetIcon: {
    width: 32,
    height: 32,
    marginHorizontal: 8
  }
});

export default function AddDailyReportScreen({ navigation, route }: any) {
  const [step, setStep] = useState(0);
  const [message, setMessage] = useState<string>();
  const [data, setData] = useState<IDailyReport>(route?.params?.report || {} as IDailyReport);
  const [loading, setLoading] = useState(false);
  const { modalHeight, createRequest } = useContext(CoreContext);
  const actionSheetRef = createRef<ActionSheet>();
  const type = route?.params?.type || 'add';

  const onNext = () => {
    setStep(step + 1);
  };

  const setNewData = (newData: any) => {
    setData({ ...data, ...newData });
  };

  const onPrevious = () => {
    setStep(step - 1);
  };

  const onComplete = (result: IDailyReport) => {
    setLoading(true);
    actionSheetRef.current?.setModalVisible(true);

    createRequest(type === 'add' ? 'addReport' : 'updateReport', result)
      .then(({ status }) => {
        if (status !== 'OK') {
          setMessage('Что-то пошло не так. Отчет не добавился');
        }
      })
      .catch((err) => {
        setMessage('Что-то пошло не так. Отчет не добавился');
      })
      .finally(() => setLoading(false));
  };

  return (
    <Layout>
      <ViewPager
        selectedIndex={step}
        onSelect={index => setStep(index)}
        swipeEnabled={false}
      >
        {StepScreens.map((screen, index) => {
          const StepComponent = screen;
          return (
            // eslint-disable-next-line react/no-array-index-key
            <Layout style={{ ...styles.stepContainer, height: modalHeight + 155 }} key={index}>
              <StepComponent
                onNext={onNext}
                onPrevious={onPrevious}
                data={data}
                setData={setNewData}
                onComplete={onComplete}
                type={type}
              />
            </Layout>
          );
        })}
      </ViewPager>
      <ActionSheet
        ref={actionSheetRef}
        containerStyle={styles.sheet}
        animated
        gestureEnabled
        onClose={() => navigation.navigate('Root')}
      >
        <Layout style={styles.sheetContent}>
          {loading && <Layout style={styles.loading}><Spinner /></Layout>}
          {!loading && (
            <Layout>
              <Layout style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon
                  style={{ ...styles.sheetIcon, tintColor: message ? Colors.light.error : Colors.light.success }}
                  name={message ? 'alert-triangle' : 'checkmark-circle-2'}
                />
                <Text status={message ? 'danger' : 'basic'}>
                  {message || (type === 'add' ? 'Отчет успешно сохранен' : 'Отчет успешно обновлен')}
                </Text>
              </Layout>
              <Button onPress={() => actionSheetRef.current?.setModalVisible(false)} style={styles.sheetButton}>
                {message ? 'Закрыть' : 'Отлично'}
              </Button>
            </Layout>
          )}
        </Layout>
      </ActionSheet>
    </Layout>
  );
}
