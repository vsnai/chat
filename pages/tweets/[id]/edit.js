import { useState } from 'react';
import { useRouter } from 'next/router'

import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../../../util/mongodb';

import Nav from '../../../components/nav'

export default function Tweet({ user, tweet }) {
  const router = useRouter();

  const [tweetBody, setTweetBody] = useState(tweet.body);

  async function edit () {
    const res = await fetch('/api/tweet', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user._id,
        tweetId: tweet._id,
        tweetBody
      })
    });

    if (res.status === 200) {
      router.push('/');
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
            value={tweetBody}
            onChange={e => setTweetBody(e.target.value)}
          />

          <button
            onClick={() => edit()}
            className="flex-none px-4 py-2 bg-black text-white hover:bg-white hover:text-black border border-black"
          >Edit</button>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps({ query }) {
  const { db } = await connectToDatabase();
  
  const user = await db.collection('users').findOne({ username: "Phoebe" });
  const tweet = await db.collection('tweets').findOne({ _id: ObjectId(query.id) });

  return {
    props: {
      user: JSON.parse(JSON.stringify(user)),
      tweet: JSON.parse(JSON.stringify(tweet)),
    }
  };
}
