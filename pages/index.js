import { useState } from 'react';
import { useRouter } from 'next/router'

import { connectToDatabase } from '../util/mongodb';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import Nav from '../components/nav';

export default function Home({ user, tweets }) {
  dayjs.extend(relativeTime);
  const router = useRouter();

  const [tweetBody, setTweetBody] = useState('');

  async function add () {
    const res = await fetch('/api/tweet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user._id,
        tweetBody
      })
    });

    if (res.status === 201) {
      router.reload();
    }
  }

  async function remove (tweet) {
    const res = await fetch('/api/tweet', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tweet
      })
    });

    if (res.status === 204) {
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
            placeholder="My post"
            onChange={e => setTweetBody(e.target.value)}
          />

          <button
            onClick={() => add()}
            className="flex-none px-4 py-2 bg-black text-white hover:bg-white hover:text-black border border-black"
          >Add</button>
        </div>

        {tweets.length > 0 && tweets.map(tweet => {
          return <div
            key={tweet._id}
            className='flex justify-between items-center w-1/2 p-8 border-b hover:bg-gray-50'
          >
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

                <div className="my-2">{tweet.body}</div>

                <div className="flex space-x-2">
                  <button className="focus:outline-none text-xs text-gray-300 hover:text-black" onClick={() => router.push(`/tweets/${tweet._id}`)}>Show</button>
                  <button className="focus:outline-none text-xs text-gray-300 hover:text-black" onClick={() => router.push(`/tweets/${tweet._id}/edit`)}>Edit</button>
                  <button className="focus:outline-none text-xs text-gray-300 hover:text-black" onClick={() => remove(tweet)}>Delete</button>
                </div>
              </div>
            </div>
          </div>
        })}
      </div>
    </>
  );
}

export async function getServerSideProps() {
  const { db } = await connectToDatabase();

  const user = await db.collection('users').findOne({ username: "Phoebe" });
  const tweets = await db.collection('tweets').find({ user_id: user._id }).sort( { _id: -1 } ).toArray();

  return {
    props: {
      user: JSON.parse(JSON.stringify(user)),
      tweets: JSON.parse(JSON.stringify(tweets)),
    }
  };
}
