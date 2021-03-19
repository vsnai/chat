import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';

import { useInterval } from '../util/interval';
import { RespondentContext } from '../contexts/RespondentContext';

export default function Chat () {
  const router = useRouter();

  const { respondent, setRespondent } = useContext(RespondentContext);

  const [chat, setChat] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    if (respondent) {
      getChat();
    }
  }, [respondent]);

  useInterval(() => {
    if (respondent !== null) {
      getChat();
    }
  }, 5000);

  async function getChat () {
    const res = await fetch('/api/v1/chat/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: respondent })
    });

    if (res.status === 200) {
      const { messages } = await res.json();
  
      setChat(messages);
    } else {
      setChat([]);
    }
  }

  async function sendMessage (e) {
    if (e.key === 'Enter') {
      const res = await fetch('/api/v1/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input, user: respondent })
      });
  
      const { message } = await res.json();

      setChat(chat => [message, ...chat]);

      setInput('');
    }
  }

  function reset () {
    setInput('');
    setRespondent(null);
    setChat([]);
  }

  function showMinimizedChat () {
    return <>Select a contact...</>
  }

  function showChat () {
    return <div className="w-full">
      {respondent &&
        <div className="flex justify-between items-center border-b p-4 mb-2">
          <button className="flex items-center focus:outline-none" onClick={() => router.push(`/${respondent.name}`)}>
            <img className="w-10 h-10 rounded-full" src={respondent.image} />
            <div className="ml-4 font-bold">{respondent.name}</div>
          </button>

          <button className="px-2 py-1 focus:outline-none" onClick={() => reset()}>x</button>
        </div>
      }

      <div className="overflow-y-auto flex flex-col-reverse space-y-reverse h-64 space-y-2 px-4 py-2">
        {chat.map(m => {
          return respondent._id === m.from
            ? <div key={m._id} className="p-2 text-black bg-gray-100 self-start">{m.message}</div>
            : <div key={m._id} className="p-2 text-white bg-black self-end">{m.message}</div>
        })}
      </div>

      <div className="px-4 pb-4 pt-2">
        <input
          className="w-full px-4 py-2 bg-gray-100 border-0 border-b border-gray-200 focus:border-black focus:ring-0"
          type="text"
          placeholder={respondent ? respondent.name : 'nekaa'}
          onKeyDown={sendMessage}
          value={input}
          onChange={e => setInput(e.target.value)}
        />
      </div>
    </div>
  }

  return (
    <div className="absolute flex flex-col items-center bottom-0 right-0 w-72 mr-20 bg-white shadow">
      {respondent ? showChat() : showMinimizedChat() }
    </div>
  );
}
