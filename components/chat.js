import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Chat () {
  const router = useRouter();

  const [isChatMode, setIsChatMode] = useState(false);

  const [search, setSearch] = useState('');
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  const [user, setUser] = useState({});
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (user.hasOwnProperty('name')) {
        getChat(user);
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [user]);

  async function searchForUser (e) {
    if (e.key === 'Enter') {
      setIsSearchLoading(true);

      const res = await fetch('/api/v1/chat/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: search })
      });

      if (res.status === 200) {
        const { user } = await res.json();

        setUser(user);

        getChat(user);

        setIsChatMode(true);
      }

      setSearch('');
      setIsSearchLoading(false);
    }
  }

  async function getChat (user) {
    const res = await fetch('/api/v1/chat/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user })
    });

    const { messages } = await res.json();

    setChat(messages);
  }

  async function sendMessage (e) {
    if (e.key === 'Enter') {
      const res = await fetch('/api/v1/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input, user })
      });
  
      const { message } = await res.json();

      setChat(chat => [message, ...chat]);

      setInput('');
    }
  }

  function reset () {
    setInput('');
    setUser({});
    setChat([]);
    setIsChatMode(false);
  }

  function searchMode () {
    return (
      <div className="p-4">
        {isSearchLoading
          ? <div>Loading ...</div>
          : <input
            className="w-full px-4 py-2 bg-gray-100 border-0 border-b border-gray-200 focus:border-black focus:ring-0"
            type="text"
            placeholder="Chat With..."
            onKeyDown={searchForUser}
            value={search}
            onChange={e => setSearch(e.target.value)}
            disabled={isSearchLoading}
          />
        }
      </div>
    );
  }

  function chatMode () {
    return (
      <>
        {user &&
          <div className="flex justify-between items-center border-b p-4 mb-2">
            <button className="flex items-center focus:outline-none" onClick={() => router.push(`/${user.name}`)}>
              <img className="w-10 h-10 rounded-full" src={user.image} />
              <div className="ml-4 font-bold">{user.name}</div>
            </button>

            <button className="px-2 py-1 focus:outline-none" onClick={() => reset()}>x</button>
          </div>
        }

        <div className="overflow-y-auto flex flex-col-reverse space-y-reverse h-64 space-y-2 px-4 py-2">
          {chat.map(m => {
            return user._id === m.from
              ? <div key={m._id} className="p-2 text-black bg-gray-100 self-start">{m.message}</div>
              : <div key={m._id} className="p-2 text-white bg-black self-end">{m.message}</div>
          })}
        </div>

        <div className="px-4 pb-4 pt-2">
          <input
            className="w-full px-4 py-2 bg-gray-100 border-0 border-b border-gray-200 focus:border-black focus:ring-0"
            type="text"
            placeholder="Message..."
            onKeyDown={sendMessage}
            value={input}
            onChange={e => setInput(e.target.value)}
          />
        </div>
      </>
    );
  }

  return (
    <div className="absolute flex flex-col items-center bottom-0 right-0 w-72 mr-20 bg-white shadow">
      <div className="w-full">
        {isChatMode ? chatMode() : searchMode()}
      </div>
    </div>
  );
}
