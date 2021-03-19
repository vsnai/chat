import { useState } from 'react';

import Nav from './nav';
import Chat from './chat';

import { RespondentContext } from '../contexts/RespondentContext';

export default function Layout({ children }) {
  const [respondent, setRespondent] = useState(null);

  return (
    <div className="flex flex-col min-h-screen">
      <Nav />

      <RespondentContext.Provider value={{respondent, setRespondent}}>
        <div className="flex-auto flex flex-col items-center bg-gray-100">
          {children}
        </div>

        <Chat />
      </RespondentContext.Provider>
    </div>
  );
}
