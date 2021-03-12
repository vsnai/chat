import { useState } from 'react';
import { useRouter } from 'next/router';

import { connectToDatabase } from '../util/mongodb';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import Nav from '../components/nav';

export default function Tweet({ user, tweets }) {
  dayjs.extend(relativeTime);
  const router = useRouter();

  return (
    <>
      <Nav user={user} />

      <div className="flex flex-col items-center">
        <div className="flex justify-between items-center w-1/2 my-4">
          <div className="flex items-center space-x-4">
            <img className="w-24 h-24 rounded-full" src={user.avatar} />
            <div>{user.bio}</div>
          </div>
          <div>0 Following | 0 Followers</div>
        </div>

        {tweets.length > 0 && tweets.map(tweet => {
          return <div
            key={tweet._id}
            className='flex justify-between items-center w-1/2 p-8 border-b hover:bg-gray-50'
          >
            <div className="flex flex-auto">
              <img className="w-12 h-12 rounded-full" src={user.avatar} />

              <div className="flex flex-col flex-grow ml-4">
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
                  <button className="focus:outline-none text-xs text-gray-300 hover:text-black" onClick={() => router.push(`/tweet/${tweet._id}`)}>Show</button>
                </div>
              </div>
            </div>
          </div>
        })}
      </div>
    </>
  );
}

export async function getServerSideProps({ query }) {
  const { db } = await connectToDatabase();

  const user = await db.collection('users').findOne({ username: query.username });
  const tweets = await db.collection('tweets').find({ user_id: user._id }).sort( { _id: -1 } ).toArray();

  return {
    props: {
      user: JSON.parse(JSON.stringify(user)),
      tweets: JSON.parse(JSON.stringify(tweets)),
    }
  };
}
