import { Dispatch, FC, SetStateAction } from "react";
import {
  ActionIcon,
  Burger,
  Button,
  Group,
  Header,
  MediaQuery,
  Menu,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useAuth } from "../context";
import { useTranslation } from "react-i18next";
import LanguageMenu from "./LanguageMenu";
import SocketUrlMenu from "./SocketUrlMenu";
import ThemeToggle from "./ThemeToggle";
import { useMediaQuery } from "@mantine/hooks";
import { Logout, Settings } from "tabler-icons-react";

interface HeaderProps {
  opened: boolean;
  setOpened: Dispatch<SetStateAction<boolean>>;
}

const MyHeader: FC<HeaderProps> = ({ opened, setOpened }) => {
  const auth = useAuth();
  const theme = useMantineTheme();
  const { t } = useTranslation();
  const expandSettings = useMediaQuery(
    `(min-width: ${theme.breakpoints.sm})`,
    false
  );

  return (
    <Header height={64} px="md" style={{ zIndex: 1 }} dir={t("dir")}>
      <Group position="apart" align={"center"} style={{ height: "100%" }}>
        <Group>
          <MediaQuery largerThan="sm" styles={{ display: "none" }}>
            <Burger
              opened={opened}
              onClick={() => setOpened((o) => !o)}
              size="sm"
              color={theme.colors.gray[6]}
            />
          </MediaQuery>
          <Text size="lg">{t("scheduler")}</Text>
        </Group>
        <Group>
          {expandSettings ? (
            <>
              <SocketUrlMenu />
              {auth?.state === "signedIn" && (
                <Group>
                  <Text>{auth?.username}</Text>
                  <Button variant="subtle" onClick={() => auth?.logout()}>
                    {t("logout")}
                  </Button>
                </Group>
              )}
              <LanguageMenu />
            </>
          ) : (
            <Menu>
              <Menu.Target>
                <ActionIcon>
                  <Settings />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <LanguageMenu subMenu />
                <Menu.Divider />
                <SocketUrlMenu subMenu />
                <Menu.Divider />
                {auth?.state === "signedIn" && (
                  <>
                    <Menu.Label>{t("account")}</Menu.Label>
                    <Menu.Item icon={<Logout />} onClick={() => auth?.logout()}>
                      {t("logout")}
                    </Menu.Item>
                  </>
                )}
              </Menu.Dropdown>
            </Menu>
          )}
          <ThemeToggle />
        </Group>
      </Group>
    </Header>
  );
};

export default MyHeader;
