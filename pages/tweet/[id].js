import { useState } from 'react';
import { useRouter } from 'next/router'

import { ObjectId } from 'mongodb';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { connectToDatabase } from '../../util/mongodb';
import Nav from '../../components/nav'

export default function Tweet({ user, tweet }) {
  dayjs.extend(relativeTime);
  const router = useRouter();

  async function remove (tweet) {
    const res = await fetch('/api/tweet', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tweet })
    });

    if (res.status === 204) {
      router.push('/');
    }
  }

  return (
    <>
      <Nav user={user} />

      <div className="flex flex-col items-center">
        <div className='flex justify-between items-center w-1/2 p-8 border-b hover:bg-gray-50'>
          <div className="flex flex-auto">
            <img className="w-12 h-12 rounded-full" src={user.avatar} />

            <div className="flex flex-col ml-4">
              <div className="flex items-center">
                <div className="font-bold">{user.username}</div>
                <div className="ml-2 text-xs text-gray-300">
                  {tweet.updated_at !== null
                    ? `${dayjs(tweet.updated_at).fromNow()} (edited)`
                    : dayjs(tweet.inserted_at).fromNow()
                  }
                </div>
              </div>

              <div className="my-2">{tweet.content}</div>

              <div className="flex space-x-2">
                <button className="focus:outline-none text-xs text-gray-300 hover:text-black" onClick={() => {}}>Edit</button>
                <button className="focus:outline-none text-xs text-gray-300 hover:text-black" onClick={() => remove(tweet)}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps({ query }) {
  const { db } = await connectToDatabase();
  
  const user = await db.collection('users').findOne();
  const tweet = await db.collection('tweets').findOne({ _id: ObjectId(query.id) });

  return {
    props: {
      user: JSON.parse(JSON.stringify(user)),
      tweet: JSON.parse(JSON.stringify(tweet)),
    }
  };
}
