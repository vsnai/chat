import Head from 'next/head';

import 'tailwindcss/tailwind.css';
import { Provider } from 'next-auth/client';

function App({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}>
      <Head>
        <title>Social</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700&display=swap" rel="stylesheet"></link>
      </Head>

      <Component {...pageProps} />
    </Provider>
  );
}

export default App
