import { AppProps } from "next/app";
import Head from "next/head";
import { AppLayout } from "../components/layout";
import { AppContext } from "../components/context";
import "cronstrue/locales/ar";

import {
  I18nProvider,
  languages,
  defaultLanguage,
  namespaces,
  defaultNamespace,
} from "next-i18next-static-site";
// Locales loader
import locales from "../lib/locales";

function App(props: AppProps) {
  const i18n = {
    languages,
    defaultLanguage,
    namespaces,
    defaultNamespace,
    locales,
  };
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
      <I18nProvider i18n={i18n}>
        <AppContext>
          <AppLayout>
            <Component {...pageProps} />
          </AppLayout>
        </AppContext>
      </I18nProvider>
    </>
  );
}

export default App;
