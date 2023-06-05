import { Navbar } from "@mantine/core";
import { Dispatch, FC, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import {
  Dashboard,
  ClipboardList,
  DeviceDesktopAnalytics,
} from "tabler-icons-react";
import NavButton from "./NavButton";
import { useRouter } from "next/router";

interface NavProps {
  opened: boolean;
  setOpened: Dispatch<SetStateAction<boolean>>;
}

const routes = [
  {
    path: "/",
    label: "dashboard",
    color: "blue",
    icon: <Dashboard size={20} />,
  },
  {
    path: "/sequences",
    label: "sequences",
    color: "teal",
    icon: <ClipboardList size={20} />,
  },
  {
    path: "/device",
    label: "device",
    color: "red",
    icon: <DeviceDesktopAnalytics size={20} />,
  },
];

const Nav: FC<NavProps> = ({ opened, setOpened }) => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <Navbar
      p="md"
      hiddenBreakpoint="sm"
      hidden={!opened}
      width={{ sm: 200, lg: 300 }}
      dir={t("dir")}
    >
      <Navbar.Section>
        {routes.map(({ color, path, label, icon }) => (
          <NavButton
            key={path}
            onClick={() => {
              router.push(path);
              setOpened(false);
            }}
            icon={icon}
            color={color}
            label={t(label)}
          />
        ))}
      </Navbar.Section>
    </Navbar>
  );
};

export default Nav;
