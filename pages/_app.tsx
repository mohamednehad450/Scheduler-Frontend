import { AppProps } from "next/app";
import Head from "next/head";
import { AppLayout } from "../components/layout";
import { AppContext } from "../components/context";
import { appWithTranslation } from "next-i18next";
import "cronstrue/locales/ar";

function App(props: AppProps) {
  const { Component, pageProps } = props;
  return (
    <>
      <Head>
        <title>Scheduler</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <AppContext>
        <AppLayout>
          <Component {...pageProps} />
        </AppLayout>
      </AppContext>
    </>
  );
}

export default appWithTranslation(App);
