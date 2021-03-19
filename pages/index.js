import { useEffect, useState } from 'react';

import { getSession } from 'next-auth/client';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../util/mongodb';

import Layout from '../components/layout';
import Tweet from '../components/tweet';
import Bitcoin from '../components/bitcoin';
import Stock from '../components/stock';
import Contacts from '../components/contacts';

export default function Home({ session, _users, _tweets }) {
  const [tweets, setTweets] = useState(_tweets);
  const [selectedTweet, setSelectedTweet] = useState({ _id: '', content: '' });
  const [isLoading, setIsLoading] = useState(false);

  const [tweetId, setTweetId] = useState('');

  useEffect(() => {
    setTweets(tweets.filter(t => t._id !== tweetId));
  }, [tweetId]);

  async function add () {
    if (selectedTweet.content === '') {
      return;
    }

    setIsLoading(true);

    const res = await fetch('/api/v1/tweet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tweet: selectedTweet })
    });

    const data = await res.json();

    if (res.status === 201) {
      setTweets([data.tweet, ...tweets]);
    }

    setIsLoading(false);
    setSelectedTweet({ _id: '', content: '' });
  }

  return (
    <Layout>
      <div className="container flex mt-4 space-x-4">
        <aside className="flex-none flex flex-col w-64">
          <div className="p-4 bg-white">
            <Bitcoin currency="USD" />
          </div>

          <div className="p-4 bg-white">
            <Stock ticker="tsla" />
          </div>

          <div className="p-4 bg-white">
            <Stock ticker="amzn" />
          </div>

          <div className="border-b"></div>
        </aside>

        <div className="flex-auto">
          <div className="flex justify-between">
            <input
              className="w-5/6 px-4 py-2 border-0 border-b mr-4 border-gray-200 focus:border-black focus:ring-0"
              type="text"
              placeholder="Say Something..."
              onChange={e => setSelectedTweet({ ...selectedTweet, content: e.target.value })}
              value={selectedTweet.content}
            />

            <button
              onClick={() => add()}
              className={`flex-grow px-4 py-2 text-white border ${isLoading || selectedTweet.content === '' ? 'text-gray-300 bg-gray-100 border-gray-300 point cursor-default' : 'bg-black border-black hover:bg-white hover:text-black'}`}
              disabled={isLoading || selectedTweet.content === ''}
            >Add</button>
          </div>

          <div className="flex flex-col items-center mt-4 mb-8">
            {tweets.length > 0 && tweets.map(tweet => <Tweet key={tweet._id} session={session.user} user={_users.find(u => u._id === tweet.userId)} _tweet={tweet} sendToParent={setTweetId} />)}
          </div>
        </div>

        <aside className="flex-none flex flex-col w-64">
          <Contacts />
        </aside>
      </div>
    </Layout>
  );
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

  const { db } = await connectToDatabase();

  const follows = (await db.collection('follows').find({ follower: ObjectId(session.user._id) })
    .project({ _id: 0, following: 1 })
    .toArray())
    .map(f => ObjectId(f.following));

  const users = await db.collection('users')
    .find({ _id: { $in: [ObjectId(session.user._id), ...follows] } })
    .toArray();

  const tweets = await db.collection('tweets')
    .find({ userId: { $in: [ObjectId(session.user._id), ...follows] } })
    .sort( { updatedAt: -1 } )
    .toArray();

  return {
    props: {
      session,
      _users: JSON.parse(JSON.stringify(users)),
      _tweets: JSON.parse(JSON.stringify(tweets)),
    }
  }
}
