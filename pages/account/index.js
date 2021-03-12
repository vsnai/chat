import { useState } from 'react';
import { useRouter } from 'next/router';

import { connectToDatabase } from '../../util/mongodb';

import Nav from '../../components/nav';
import Search from '../../components/search';

export default function Account({ user }) {
  const router = useRouter();

  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [bio, setBio] = useState(user.bio);

  async function save () {
    const res = await fetch('/api/v1/account', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user, username, email, bio })
    });

    if (res.status === 200) {
      router.reload();
    }
  }

  return (
    <>
      <div className="flex container justify-between mx-auto my-2">
        <Nav user={user} />
        <Search query={router.query.q} />
      </div>

      <div className="flex flex-col items-center">
        <div className="flex justify-between w-1/2 my-4 space-x-4">
          <input
            className="flex-auto px-4 py-2 border"
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <input
            className="flex-auto px-4 py-2 border"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            className="flex-auto px-4 py-2 border"
            type="text"
            value={bio}
            onChange={e => setBio(e.target.value)}
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
