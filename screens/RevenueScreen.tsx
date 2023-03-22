import React, { useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { StyleSheet, View } from 'react-native';
import { Button, Layout, Spinner, Text } from '@ui-kitten/components';
import useStores from '../hooks/useStores';
import { useForm } from "react-hook-form";
import FormSelect from "../components/form-controls/FormSelect";
import { IDailyReport } from "../stores/DailyReportsStore";
import getYear from 'date-fns/getYear';
import { getMonth } from "date-fns";
import { PieChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { formatAmountString } from "../components/utils/formatAmountString";

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
  month: number;
  year: number;
};

const SelectMonthOptions = [
  { label: 'Январь', value: 1 },
  { label: 'Февраль', value: 2 },
  { label: 'Март', value: 3 },
  { label: 'Апрель', value: 4 },
  { label: 'Май', value: 5 },
  { label: 'Июнь', value: 6 },
  { label: 'Июль', value: 7 },
  { label: 'Август', value: 8 },
  { label: 'Сентябрь', value: 9 },
  { label: 'Октябрь', value: 10 },
  { label: 'Ноябрь', value: 11 },
  { label: 'Декабрь', value: 12 }
];

const SelectYearOptions = [
  { label: '2023', value: 2023 }
]

const RevenueScreen = () => {
  const { dailyReportStore: { fetchReports, reports } } = useStores();
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState<Array<IDailyReport>>([]);
  const [ipAcquiringSum, setIpAcquiringSum] = useState(0);
  const [oooAcquiringSum, setOooAcquiringSum] = useState(0);
  const [ipCashSum, setIpCashSum] = useState(0);
  const [oooCashSum, setOooCashSum] = useState(0);
  const [totalSum, setTotalSum] = useState(0);

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      month: 3,
      year: 2023
    }
  });

  useEffect(() => {
    if (!reports) {
      setLoading(true);
      fetchReports().finally(() => setLoading(false));
    }
  }, [reports]);

  const transformedDate = (date: string) => {
    const dateArray = date.split('.');
    const day = Number(dateArray[0]) + 1;
    const month = Number(dateArray[1]) - 1;
    const year = Number(dateArray[2]);
    return new Date(year, month, day);
  };

  const onSubmit = (newData: FormData) => {
    const chartData = (reports || []).filter(item => {
      const year = getYear(transformedDate(item.date));
      return year === newData.year;
    }).filter(item => {
      const month = getMonth(transformedDate(item.date));
      return month + 1 === newData.month;
    });

    setChartData(chartData);
  };

  useEffect(() => {
    const ipAcquiring = chartData.reduce((sum, current) => sum + Number(current.ipAcquiring), 0);
    const oooAcquiring = chartData.reduce((sum, current) => sum + Number(current.oooAcquiring), 0);
    const ipCash = chartData.reduce((sum, current) => sum + Number(current.ipCash), 0);
    const oooCash = chartData.reduce((sum, current) => sum + Number(current.oooCash), 0);
    const total = chartData.reduce((sum, current) => sum + Number(current.totalSum), 0);
    setIpAcquiringSum(Math.floor(ipAcquiring));
    setOooAcquiringSum(Math.floor(oooAcquiring));
    setIpCashSum(Math.floor(ipCash));
    setOooCashSum(Math.floor(oooCash));
    setTotalSum(Math.floor(total));
  }, [chartData]);

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

  const screenWidth = Dimensions.get("window").width;

  return (
    <View style={styles.container}>
      {loading && <Layout style={styles.loading}><Spinner/></Layout>}
      {!loading && (
        <Layout>
          <FormSelect
            items={SelectMonthOptions}
            name="month"
            label="Месяц"
            placeholder="Месяц"
            error={errors.month}
            control={control}
            required
          />
          <FormSelect
            items={SelectYearOptions}
            name="year"
            label="Год"
            placeholder="Год"
            error={errors.year}
            control={control}
            required
          />

          <Button onPress={handleSubmit(onSubmit)} style={styles.button}>
            Рссчитать
          </Button>

          <Text category="h5" style={{ fontWeight: 'bold', marginBottom: 16 }}>{`Общая выручка: ${formatAmountString(String(totalSum))}`}</Text>

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
    </View>
  );
};

export default observer(RevenueScreen);
