import { ActionIcon, Menu, MenuItem, MenuLabel } from "@mantine/core";
import { useRouter } from "next/router";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Language } from "tabler-icons-react";

const LanguageMenu: FC<{ subMenu?: boolean }> = ({ subMenu }) => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  return subMenu ? (
    <>
      <MenuLabel>{t("lang")}</MenuLabel>
      <MenuItem
        onClick={() => i18n.changeLanguage("ar")}
        disabled={router.locale === "ar"}
      >
        {"العربية"}
      </MenuItem>
      <MenuItem
        onClick={() => i18n.changeLanguage("en")}
        disabled={router.locale === "en"}
      >
        {"English"}
      </MenuItem>
    </>
  ) : (
    <Menu
      title={`${t("lang")}`}
      control={
        <ActionIcon>
          <Language />
        </ActionIcon>
      }
    >
      <MenuLabel>{t("lang")}</MenuLabel>
      <MenuItem
        onClick={() => i18n.changeLanguage("ar")}
        disabled={router.locale === "ar"}
      >
        {"العربية"}
      </MenuItem>
      <MenuItem
        onClick={() => i18n.changeLanguage("en")}
        disabled={router.locale === "en"}
      >
        {"English"}
      </MenuItem>
    </Menu>
  );
};

export default LanguageMenu;
