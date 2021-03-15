import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { useSession } from 'next-auth/client';

import Layout from '../../components/layout';

export default function Account() {
  const router = useRouter();

  const [session, loading] = useSession();
  const [name, setName] = useState('');

  useEffect(() => {
    if (session) {
      setName(session.user.name);
    }
  }, [session]);

  async function save () {
    const res = await fetch('/api/v1/account', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });

    if (res.status === 200) {
      router.reload();
    }
  }

  return (
    <Layout>
      <div className="flex justify-between w-1/2 my-8">
        <div className="flex justify-between w-full space-x-4">
          <input
            className="flex-auto px-4 py-2 border"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
          />

          <button
            className="flex-none px-4 py-2 bg-black text-white hover:bg-white hover:text-black border border-black"
            onClick={() => save()}
          >
            Save</button>
        </div>
      </div>
    </Layout>
  )
}
