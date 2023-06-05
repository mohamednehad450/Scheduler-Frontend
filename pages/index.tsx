import { Container, SimpleGrid } from "@mantine/core";
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useCRUD } from "../components/context";
import { useSocket } from "../components/context";
import { DeviceTime, PinsStatus, Sequences } from "../components/dashboard";
import { Sequence } from "../components/common";
import { useTranslation } from "react-i18next";

const Home: NextPage = () => {
  const [sequences, setSequences] = useState<Sequence[]>([]);
  const sContext = useSocket();

  const crud = useCRUD();

  const { t } = useTranslation();

  useEffect(() => {
    crud?.sequenceCRUD?.list().then((d) => setSequences(d.data));
  }, [sContext?.socket, crud]);

  return (
    <>
      <Head>
        <title>{t("dashboard_title")}</title>
      </Head>
      <Container size={"lg"} m="sm" p="sm">
        <SimpleGrid
          cols={3}
          spacing="lg"
          breakpoints={[
            { maxWidth: "xl", cols: 3 },
            { maxWidth: "lg", cols: 2 },
            { maxWidth: "sm", cols: 1 },
          ]}
        >
          <DeviceTime />
          <PinsStatus sequences={sequences} />
          <Sequences sequences={sequences} />
        </SimpleGrid>
      </Container>
    </>
  );
};

export default Home;
