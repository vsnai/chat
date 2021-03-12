import { useState } from 'react';
import { useRouter } from 'next/router';

import { connectToDatabase } from '../util/mongodb';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import Nav from '../components/nav';
import Search from '../components/search';

export default function Lookup({ user, users }) {
  dayjs.extend(relativeTime);
  const router = useRouter();

  return (
    <>
      <div className="flex container justify-between mx-auto my-2">
        <Nav user={user} />
        <Search query={router.query.q} />
      </div>

      <div className="flex flex-col items-center">
        <div className="flex flex-col justify-between w-1/2 my-4">
          {users && users.map(u => <button key={u._id} onClick={() => router.push(`/${u.username}`)}>{u.username}</button>)}
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps({ query }) {
  const { db } = await connectToDatabase();

  const user = await db.collection('users').findOne();
  const users = await db.collection('users').find({ username: {'$regex': new RegExp(`${query.q}`) } }).toArray();

  return {
    props: {
      user: JSON.parse(JSON.stringify(user)),
      users: JSON.parse(JSON.stringify(users)),
    }
  };
}
