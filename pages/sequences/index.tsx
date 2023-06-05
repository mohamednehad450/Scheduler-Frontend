import {
  Tabs,
  Container,
  Title,
  Group,
  ActionIcon,
  Flex,
  useMantineTheme,
} from "@mantine/core";
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Calendar, CalendarOff, List, Plus, Refresh } from "tabler-icons-react";
import { SequenceList } from "../../components/sequences";
import { Sequence } from "../../components/common";
import { useRouter } from "next/router";
import { useCRUD } from "../../components/context";
import { useTranslation } from "react-i18next";
import { openContextModal } from "@mantine/modals";
import { useMediaQuery } from "@mantine/hooks";

const Sequences: NextPage = () => {
  const [active, setActive] = useState<"all" | "active" | "running">("all");
  const [sequences, setSequences] = useState<Sequence[]>([]);

  const router = useRouter();
  const crud = useCRUD();

  const { t } = useTranslation();
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  useEffect(() => {
    crud?.sequenceCRUD?.list().then((d) => setSequences(d.data));
  }, [crud]);

  return (
    <>
      <Head>
        <title>{t("sequences_title")}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container
        h="100%"
        size={"lg"}
        p="0"
        sx={(s) => ({
          background: s.colorScheme === "light" ? s.white : s.colors.dark[7],
        })}
      >
        <Group position="apart">
          <Title p={"lg"}>{t("sequences")}</Title>
          <Group>
            <ActionIcon
              color={"gray"}
              variant="light"
              size={32}
              mx="xs"
              onClick={() =>
                openContextModal({
                  modal: "SequenceModal",
                  title: t("add_new_sequence"),
                  size: "xl",
                  fullScreen: isMobile,
                  innerProps: {
                    onChange: (newSeq) =>
                      router.push("/sequences/" + newSeq.id),
                  },
                })
              }
            >
              <Plus size={32} />
            </ActionIcon>
            <ActionIcon
              color={"gray"}
              variant="light"
              size={32}
              mx="xs"
              onClick={() => {
                setSequences([]);
                crud?.sequenceCRUD?.list().then((d) => setSequences(d.data));
              }}
            >
              <Refresh size={32} />
            </ActionIcon>
          </Group>
        </Group>
        <Flex direction={"column"}>
          <Tabs
            value={active}
            onTabChange={(v) => setActive(v as typeof active)}
          >
            <Tabs.List px="md">
              <Tabs.Tab value="all" icon={<List size={16} />}>
                {t("all")}
              </Tabs.Tab>
              <Tabs.Tab value="active" icon={<Calendar size={16} />}>
                {t("the_activated")}
              </Tabs.Tab>
              <Tabs.Tab value="running" icon={<CalendarOff size={16} />}>
                {t("running")}
              </Tabs.Tab>
            </Tabs.List>
          </Tabs>
          <Flex
            w="100%"
            m="0"
            p="0"
            sx={(s) => ({
              background:
                s.colorScheme === "light" ? s.white : s.colors.dark[7],
            })}
          >
            <SequenceList
              sequences={sequences}
              onChange={setSequences}
              show={active}
            />
          </Flex>
        </Flex>
      </Container>
    </>
  );
};

export default Sequences;
