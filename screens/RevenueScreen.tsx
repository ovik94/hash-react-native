import React, { useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { StyleSheet, View } from 'react-native';
import { Button, Layout, Spinner, Text } from '@ui-kitten/components';
import useStores from '../hooks/useStores';
import { useForm } from "react-hook-form";
import { IDailyReport } from "../stores/DailyReportsStore";
import { subMonths, lastDayOfMonth, startOfMonth } from "date-fns";
import { PieChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { formatAmountString } from "../components/utils/formatAmountString";
import FormDatePicker from "../components/form-controls/FormDatePicker";
import dateFormatter from "../components/utils/dateFormatter";

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
  button: {
    width: '100%',
    marginVertical: 24,
  },
  sheet: {
    padding: 16
  }
});

type FormData = {
  from: Date;
  to: Date;
};

const RevenueScreen = () => {
  const { dailyReportStore: { fetchReports } } = useStores();
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState<Array<IDailyReport>>([]);
  const [chartParams, setChartParams] = useState<{ from?: string; to?: string; } | null>(null);
  const [ipAcquiringSum, setIpAcquiringSum] = useState(0);
  const [oooAcquiringSum, setOooAcquiringSum] = useState(0);
  const [ipCashSum, setIpCashSum] = useState(0);
  const [oooCashSum, setOooCashSum] = useState(0);
  const [totalSum, setTotalSum] = useState(0);

  const { control, handleSubmit, formState: { errors }, setValue } = useForm<FormData>();

  const screenWidth = Dimensions.get("window").width;

  useEffect(() => {
    if (chartParams) {
      setLoading(true);
      fetchReports(chartParams).then((res) => {
        setReports(res);
        setLoading(false)
      });
    }
  }, [chartParams]);

  const onSubmit = (newData: FormData) => {
    let params: { from?: string; to?: string; } = {};

    if (newData.to) {
      params.to = dateFormatter(newData.to);
    }

    if (newData.from) {
      params.from = dateFormatter(newData.from);
    }
    setChartParams(!Object.keys(params).length ? null : params);
  };

  useEffect(() => {
    const ipAcquiring = reports.reduce((sum, current) => sum + Number(current.ipAcquiring), 0);
    const oooAcquiring = reports.reduce((sum, current) => sum + Number(current.oooAcquiring), 0);
    const ipCash = reports.reduce((sum, current) => sum + Number(current.ipCash), 0);
    const oooCash = reports.reduce((sum, current) => sum + Number(current.oooCash), 0);
    const total = reports.reduce((sum, current) => sum + Number(current.totalSum), 0);
    setIpAcquiringSum(Math.floor(ipAcquiring));
    setOooAcquiringSum(Math.floor(oooAcquiring));
    setIpCashSum(Math.floor(ipCash));
    setOooCashSum(Math.floor(oooCash));
    setTotalSum(Math.floor(total));
  }, [reports]);

  const peiData = useMemo(() => {
    return [
      {
        name: "ИП Эквайринг",
        population: ipAcquiringSum,
        color: "#bf3d3d",
        legendFontColor: "#7F7F7F",
        legendFontSize: 11
      },
      {
        name: "ООО Эквайринг",
        population: oooAcquiringSum,
        color: "#117860",
        legendFontColor: "#7F7F7F",
        legendFontSize: 11
      },
      {
        name: "ИП Наличные",
        population: ipCashSum,
        color: "#eb8686",
        legendFontColor: "#7F7F7F",
        legendFontSize: 11
      },
      {
        name: "ООО Наличные",
        population: oooCashSum,
        color: "#98d9ca",
        legendFontColor: "#7F7F7F",
        legendFontSize: 11
      }
    ]
  }, [ipAcquiringSum, oooAcquiringSum, ipCashSum, oooCashSum]);

  useEffect(() => {
    onSetCurrentMonth();
  }, []);

  const onSetPrevMonth = () => {
    const start = startOfMonth(subMonths(new Date(), 1));
    const end = lastDayOfMonth(subMonths(new Date(), 1));

    setValue('from', start);
    setValue('to', end);
  };

  const onSetCurrentMonth = () => {
    const start = startOfMonth(new Date());
    const end = lastDayOfMonth(new Date());

    setValue('from', start);
    setValue('to', end);
  }

  return (
    <View style={styles.container}>
      <Layout>
        <FormDatePicker
          name="from"
          label="Начало периода"
          error={errors.from}
          control={control}
          required
        />
        <FormDatePicker
          name="to"
          label="Конец периода"
          error={errors.to}
          control={control}
          required
        />

        <Layout style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Button onPress={onSetPrevMonth} appearance='outline' size='small' status='info'>
            Прошлый месяц
          </Button>
          <Button onPress={onSetCurrentMonth} appearance='outline' size='small' status='info'>
            Текущий месяц
          </Button>
        </Layout>
        <Button onPress={handleSubmit(onSubmit)} style={styles.button}>
          Рссчитать
        </Button>

        {loading && <Layout style={styles.loading}><Spinner/></Layout>}
        {!loading && (
          <Layout>
            <Text category="h5" style={{
              fontWeight: 'bold',
              marginBottom: 16
            }}>
              {`Общая выручка: ${formatAmountString(String(totalSum))}`}
            </Text>

            <PieChart
              data={peiData}
              width={screenWidth}
              height={200}
              chartConfig={{
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              }}
              accessor={"population"}
              backgroundColor={"transparent"}
              paddingLeft={"-20"}
              center={[15, 10]}
              absolute
            />
          </Layout>
        )}
      </Layout>
    </View>
  );
};

export default observer(RevenueScreen);
