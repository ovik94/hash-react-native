import React, { createRef, useContext, useState } from "react";
import { observer } from "mobx-react-lite";
import { StyleSheet } from "react-native";
import ActionSheet from "react-native-actions-sheet";
import {
  Button,
  Icon,
  Layout,
  Spinner,
  Text,
  ViewPager,
} from "@ui-kitten/components";
import formatAmountString from "../../components/utils/formatAmountString";
import Colors from "../../constants/Colors";
import { CoreContext } from "../../core/CoreContext";
import useStores from "../../hooks/useStores";
import { IDailyReport } from "../../stores/DailyReportsStore";
import ExpensesStep from "./ExpensesStep";
import InfoStep from "./InfoStep";
import ReceiptsStep from "./ReceiptsStep";

const StepScreens = [InfoStep, ReceiptsStep, ExpensesStep];

export interface IStepProps {
  onNext: () => void;
  onPrevious: () => void;
  setData: (value: any) => void;
  data: IDailyReport;
  onComplete: (data: IDailyReport) => void;
  type: string;
  navigation: any;
}

const styles = StyleSheet.create({
  stepContainer: {
    paddingHorizontal: 16,
  },
  loading: {
    flex: 1,
    marginTop: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  sheet: {
    padding: 16,
  },
  sheetContent: {
    width: "100%",
    minHeight: 200,
    padding: 32,
  },
  sheetButton: {
    width: "100%",
    marginTop: 32,
  },
  sheetIcon: {
    width: 32,
    height: 32,
    marginRight: 8,
  },
});

const AddDailyReportScreen = ({ navigation, route }: any) => {
  const {
    dailyReportStore: { addReport, updateReport, isLoadingSheet, sheetMessage },
  } = useStores();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<IDailyReport>(
    route?.params?.report || ({} as IDailyReport)
  );
  const { modalHeight } = useContext(CoreContext);
  const actionSheetRef = createRef<ActionSheet>();
  const type = route?.params?.type || "add";

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
    actionSheetRef.current?.setModalVisible(true);
    setNewData(result);

    if (type === "add") {
      addReport(result);
    } else {
      updateReport(result);
    }
  };

  return (
    <Layout>
      <ViewPager
        selectedIndex={step}
        onSelect={(index) => setStep(index)}
        swipeEnabled={false}
      >
        {StepScreens.map((screen, index) => {
          const StepComponent = screen;
          return (
            // eslint-disable-next-line react/no-array-index-key
            <Layout
              style={{ ...styles.stepContainer, height: modalHeight + 155 }}
              key={index}
            >
              <StepComponent
                onNext={onNext}
                onPrevious={onPrevious}
                data={data}
                setData={setNewData}
                onComplete={onComplete}
                type={type}
                navigation={navigation}
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
        onClose={() => navigation.navigate("Root")}
      >
        <Layout style={styles.sheetContent}>
          {isLoadingSheet && (
            <Layout style={styles.loading}>
              <Spinner />
            </Layout>
          )}
          {!isLoadingSheet && (
            <Layout>
              <Layout style={{ flexDirection: "row", alignItems: "center" }}>
                <Icon
                  style={{
                    ...styles.sheetIcon,
                    tintColor: sheetMessage
                      ? Colors.light.error
                      : Colors.light.success,
                  }}
                  name={sheetMessage ? "alert-triangle" : "checkmark-circle-2"}
                />
                <Text status={sheetMessage ? "danger" : "basic"}>
                  {sheetMessage ||
                    (type === "add"
                      ? "Отчет успешно сохранен"
                      : "Отчет успешно обновлен")}
                </Text>
              </Layout>
              {!sheetMessage && (
                <Text status="info" style={{ marginTop: 16 }}>
                  {`Сдать наличных: ${formatAmountString(data.totalCash)}`}
                </Text>
              )}
              <Button
                onPress={() => actionSheetRef.current?.setModalVisible(false)}
                style={styles.sheetButton}
              >
                {sheetMessage ? "Закрыть" : "Отлично"}
              </Button>
            </Layout>
          )}
        </Layout>
      </ActionSheet>
    </Layout>
  );
};

export default observer(AddDailyReportScreen);
