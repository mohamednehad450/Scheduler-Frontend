import { AppShell, useMantineTheme } from "@mantine/core";
import { FC, PropsWithChildren, useState } from "react";
import Nav from "./Nav";
import MyHeader from "./MyHeader";
import { useAuth } from "../context";
import SignInCard from "./SignInCard";

const AppLayout: FC<PropsWithChildren<{}>> = ({ children }) => {
  const theme = useMantineTheme();
  const auth = useAuth();
  const [opened, setOpened] = useState(false);

  return (
    <AppShell
      styles={{
        root: { direction: theme.dir },
        main: {
          background:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      fixed
      navbar={
        auth?.state === "signedIn" ? (
          <Nav opened={opened} setOpened={setOpened} />
        ) : undefined
      }
      header={<MyHeader opened={opened} setOpened={setOpened} />}
      padding={0}
    >
      {auth?.state === "signedIn" ? children : <SignInCard />}
    </AppShell>
  );
};

export default AppLayout;
