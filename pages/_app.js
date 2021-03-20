import { useState } from 'react';
import Head from 'next/head';

import 'tailwindcss/tailwind.css';
import { Provider } from 'next-auth/client';
import { RespondentContext } from '../contexts/RespondentContext';

function App({ Component, pageProps }) {
  const [respondent, setRespondent] = useState(null);

  return (
    <Provider session={pageProps.session}>
      <Head>
        <title>Social</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700&display=swap" rel="stylesheet"></link>
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans&display=swap" rel="stylesheet"></link>
      </Head>

      <RespondentContext.Provider value={{ respondent, setRespondent }}>
        <Component {...pageProps} />
      </RespondentContext.Provider>
    </Provider>
  );
}

export default App
