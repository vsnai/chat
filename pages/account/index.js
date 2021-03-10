import { useState } from 'react';
import { useRouter } from 'next/router';

import { connectToDatabase } from '../../util/mongodb';

import Nav from '../../components/nav';

export default function Account({ user }) {
  const router = useRouter();

  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);

  async function save () {
    const res = await fetch('/api/v1/account', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user, username, email })
    });

    if (res.status === 200) {
      router.reload();
    }
  }

  return (
    <>
      <Nav user={user} />

      <div className="flex flex-col items-center">
        <div className="flex justify-between w-1/2 my-4">
          <input
            className="flex-auto px-4 py-2 border mr-4"
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <input
            className="flex-auto px-4 py-2 border mr-4"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          <button
            className="flex-none px-4 py-2 bg-black text-white hover:bg-white hover:text-black border border-black"
            onClick={() => save()}
          >
            Save</button>
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps() {
  const { db } = await connectToDatabase();

  const user = await db.collection('users').findOne();

  return {
    props: {
      user: JSON.parse(JSON.stringify(user))
    }
  };
}