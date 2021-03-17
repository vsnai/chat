import { useState } from 'react';

import { getSession } from 'next-auth/client';

import Layout from '../components/layout';

export default function Account({ _user }) {
  const [user, setUser] = useState(_user);
  const [input, setInput] = useState(_user.name);
  const [isLoading, setIsLoading] = useState(false);

  async function save () {
    setInput(input.replace(/[^a-z]/gi, '').toLowerCase());

    if (input === '' || input === user.name) {
      return;
    }

    setIsLoading(true);

    await fetch('/api/v1/account', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: input })
    });

    setUser({ ...user, name: input })
    setIsLoading(false);
  }

  return (
    <Layout>
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
    </Layout>
  )
}

export async function getServerSideProps({ req }) {
  const session = await getSession({ req });

  if (! session) {
    return {
      redirect: {
        permanent: false,
        destination: '/api/auth/signin'
      }
    }
  }

  return {
    props: {
      _user: session.user
    }
  }
}
