import * as eva from "@eva-design/eva";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { Dimensions } from "react-native";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import Colors from "../constants/Colors";
import { CoreContextProvider } from "../core/CoreContext";
// eslint-disable-next-line import/no-named-default
import { default as theme } from "../core/custom-theme.json";
import RequestFactory from "../core/request-factory";
import RequestConfigList from "../core/request-config-list";
import { StoreContextProvider } from "../core/StoreContext";
import { RootStore } from "../stores/RootStore";
import LinkingConfiguration from "./LinkingConfiguration";
import Root from "../core/Root";

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#fff",
    primary: Colors.light.tint,
  },
};

const requestFactory = new RequestFactory({
  requestConfigList: RequestConfigList,
});
const createRequest = requestFactory.createRequest.bind(requestFactory);
const store = new RootStore();
store.setCreateRequest(createRequest);

const { height } = Dimensions.get("window");
const modalHeight = height - 210;

function RootNavigator() {
  return (
    <StoreContextProvider value={store}>
      <CoreContextProvider value={{ modalHeight }}>
        <IconRegistry icons={EvaIconsPack} />
        <ApplicationProvider {...eva} theme={{ ...eva.light, ...theme }}>
          <Root />
        </ApplicationProvider>
      </CoreContextProvider>
    </StoreContextProvider>
  );
}

export default function Navigation() {
  return (
    <NavigationContainer linking={LinkingConfiguration} theme={MyTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}
