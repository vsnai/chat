import { useEffect, useState } from 'react';

import { useRouter } from 'next/router';
import useSWR from 'swr';

import Layout from '../components/layout';

const fetcher = (...args) => fetch(...args).then(res => res.json());

function useUser () {
  const { data, error, mutate } = useSWR('/api/v1/user', fetcher);

  return {
    user: data?.user,
    isLoading: ! error && ! data,
    isError: error,
    mutate
  }
}

export default function Account () {
  const router = useRouter();

  const { user, isLoading, isError, mutate } = useUser();
  const [input, setInput] = useState('');

  useEffect(() => {
    if (! isLoading) {
      if (isError) {
        router.push('/api/auth/signin');
      } else {
        setInput(user.name);
      }
    }
  }, [user, isLoading, isError]);

  async function save () {
    setInput(input.replace(/[^a-z]/gi, '').toLowerCase());

    if (input === '' || input === user.name) {
      return;
    }

    await fetch('/api/v1/account', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: input })
    });

    mutate();
  }

  return (
    <Layout>
      {user && <pre>{JSON.stringify(user, null, 2)}</pre>}

      {user &&
      <div className="flex justify-between w-1/2 my-4">
        <input
          className="w-5/6 px-4 py-2 border-0 border-b mr-4 border-gray-200 focus:border-black focus:ring-0"
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
        />

        <button
          onClick={() => save()}
          className={`flex-grow px-4 py-2 text-white border ${isLoading || input === '' || input === user.name ? 'text-gray-300 bg-gray-100 border-gray-300 point cursor-default' : 'bg-black border-black hover:bg-white hover:text-black'}`}
          disabled={isLoading || input === '' || input === user.name}
        >
          Save</button>
      </div>
      }
    </Layout>
  )
}
