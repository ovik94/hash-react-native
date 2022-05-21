import React, { useState } from 'react';
import { Controller, FieldError } from 'react-hook-form';
import { StyleSheet } from 'react-native';
import { Datepicker, Icon, IconProps, Layout, NativeDateService } from '@ui-kitten/components';
import { I18nDayNames, I18nMonthNames } from "@ui-kitten/components/ui/calendar/i18n/type";
import dateFormatter from "../utils/dateFormatter";

interface IFormDatePicker {
  name: string;
  label: string;
  control: any;
  defaultValue?: string | Date;
  caption?: string;
  disabled?: boolean;
  error?: FieldError;
  required?: boolean;
}

const i18n: { dayNames: I18nDayNames; monthNames: I18nMonthNames } = {
  dayNames: {
    short: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    long: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
  },
  monthNames: {
    short: ['Янв', 'Фев', 'Март', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
    long: [
      'Январь',
      'Февраль',
      'Март',
      'Апрель',
      'Май',
      'Июнь',
      'Июль',
      'Август',
      'Сентябрь',
      'Октябрь',
      'Ноябрь',
      'Декабрь',
    ],
  },
};

const CalendarIcon = (props: IconProps) => (
  <Icon {...props} name='calendar' />
);

export default function FormDatePicker({
  name,
  control,
  label,
  error,
  caption,
  required,
  defaultValue = new Date(),
}: IFormDatePicker) {
  const formatDateService = new NativeDateService('ru', { format: 'DD.MM.YYYY', startDayOfWeek: 1, i18n });

  return (
    <Controller
      control={control}
      rules={{
        required
      }}
      defaultValue={defaultValue}
      name={name}
      render={({ field: { onChange, value } }) => {
        const onChangeDate = (selectedDate: Date | string | undefined) => {
          if (selectedDate) {
            onChange(selectedDate);
          }
        };

        return (
          <Layout style={styles.container}>
            <Datepicker
              label={label}
              status={error ? 'danger' : 'basic'}
              caption={error?.message || caption}
              placeholder='дд.мм.гггг'
              date={value}
              onSelect={onChangeDate}
              accessoryRight={CalendarIcon}
              dateService={formatDateService}
            />
          </Layout>
        )
      }}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16
  },
});
