import { AppProps } from 'next/app';

import GoogleAnalytics from '@/app/components/GoogleAnalytics';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <GoogleAnalytics />
    </>
  );
}

export default MyApp;