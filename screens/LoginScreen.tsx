import React, { useEffect, useMemo } from "react";
import { observer } from "mobx-react-lite";
import { StyleSheet } from "react-native";
import { useForm } from "react-hook-form";
import { Layout, Spinner, Button, Text } from "@ui-kitten/components";
import { FormSelect, FormPasswordTextInput } from "../components";

import useStores from "../hooks/useStores";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 50,
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
  button: {
    marginTop: 16,
  },
});

type LoginFormData = {
  admin: { id: string; name: string };
  password: string;
};

const LoginScreen = () => {
  const {
    userStore: { users, fetchUsers, login, isLoading },
  } = useStores();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  useEffect(() => {
    if (!users) {
      fetchUsers();
    }
  }, [users]);

  const renderAdminNameValue = (data: { id: string; name: string }) => (
    <Text>{data.name}</Text>
  );

  const adminList = useMemo(
    () =>
      users
        ? users
            .filter((user) => user.role === "admin" || user.role === "teller")
            .map((user) => ({
              value: { id: user.id, name: user.name },
              label: user.name,
            }))
        : [],
    [users]
  );

  const onSubmit = (data: LoginFormData) => {
    login({ password: data.password, id: data.admin.id });
  };

  return (
    <Layout style={styles.container}>
      {isLoading && (
        <Layout style={styles.loading}>
          <Spinner />
        </Layout>
      )}
      {!isLoading && (
        <>
          <FormSelect
            items={adminList}
            name="admin"
            label="Имя"
            placeholder="Имя"
            error={errors.admin?.id}
            control={control}
            renderValue={renderAdminNameValue}
            required
          />
          <FormPasswordTextInput
            name="password"
            label="Пароль"
            placeholder="Пароль"
            error={errors.password}
            control={control}
            required
          />
          <Button style={styles.button} onPress={handleSubmit(onSubmit)}>
            Далее
          </Button>
        </>
      )}
    </Layout>
  );
};

export default observer(LoginScreen);
