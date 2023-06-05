import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
  createEmotionCache,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { ModalsProvider } from "@mantine/modals";
import { FC, PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";
import { ProvideAuth, useAuth } from "./auth";
import { ProvideCRUD, useCRUD } from "./CRUD";
import {
  ProvideSocket,
  useSocket,
  TickHandler,
  DeviceState,
  DeviceStateHandler,
  ChannelChangeHandler,
} from "./socket";
import { modals } from "../modals";
import rtlPlugin from "stylis-plugin-rtl";

const rtlCache = createEmotionCache({
  key: "mantine-rtl",
  stylisPlugins: [rtlPlugin],
});
const AppContext: FC<PropsWithChildren<{}>> = ({ children }) => {
  const { t } = useTranslation();

  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "mantine-color-scheme",
    defaultValue: "light",
    getInitialValueInEffect: true,
  });

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  const rtl = t("dir") === "rtl";
  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        emotionCache={rtl ? rtlCache : undefined}
        theme={{
          dir: rtl ? "rtl" : "ltr",
          colorScheme,
        }}
      >
        <ProvideAuth>
          <ProvideCRUD>
            <ProvideSocket>
              <ModalsProvider modals={modals}>{children}</ModalsProvider>
            </ProvideSocket>
          </ProvideCRUD>
        </ProvideAuth>
      </MantineProvider>
    </ColorSchemeProvider>
  );
};

export { AppContext, useSocket, useAuth, useCRUD };
export type {
  DeviceState,
  DeviceStateHandler,
  TickHandler,
  ChannelChangeHandler,
};
