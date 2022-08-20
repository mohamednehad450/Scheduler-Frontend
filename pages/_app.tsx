import { AppProps } from 'next/app';
import Head from 'next/head';
import { AppLayout } from '../components/layout';
import { ProvideSequence } from '../components/context/sequences';
import { ProvideActions } from '../components/context/actions';
import { ProvidePins } from '../components/context/pins';
import { ProvideSchedule } from '../components/context/schedule';

export default function App(props: AppProps) {
  const { Component, pageProps } = props;
  return (
    <>
      <Head>
        <title>Scheduler</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <ProvideSequence>
        <ProvideSchedule>
          <ProvideActions>
            <ProvidePins>
              <AppLayout>
                <Component {...pageProps} />
              </AppLayout>
            </ProvidePins>
          </ProvideActions>
        </ProvideSchedule>
      </ProvideSequence>
    </>
  );
}