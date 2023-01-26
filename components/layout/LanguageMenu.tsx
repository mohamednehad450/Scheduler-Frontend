import { ActionIcon, Menu, MenuItem, MenuLabel } from "@mantine/core"
import Link from "next/link"
import { useRouter } from "next/router"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { Language } from "tabler-icons-react"



const LanguageMenu: FC<{ subMenu?: boolean }> = ({ subMenu }) => {

    const { t } = useTranslation()
    const router = useRouter()

    return subMenu ? (
        <>
            <MenuLabel>{t('lang')}</MenuLabel>
            <Link href={"#"} locale="ar">
                <MenuItem disabled={router.locale === "ar"}>
                    {"العربية"}
                </MenuItem>
            </Link>
            <Link href={"#"} locale="en">
                <MenuItem disabled={router.locale === "en"}>
                    {"English"}
                </MenuItem>
            </Link></>
    ) : (
        <Menu title={`${t("lang")}`} control={<ActionIcon><Language /></ActionIcon>} >
            <MenuLabel>{t('lang')}</MenuLabel>
            <Link href={"#"} locale="ar">
                <MenuItem disabled={router.locale === "ar"}>
                    {"العربية"}
                </MenuItem>
            </Link>
            <Link href={"#"} locale="en">
                <MenuItem disabled={router.locale === "en"}>
                    {"English"}
                </MenuItem>
            </Link>
        </Menu>
    )
}


export default LanguageMenu