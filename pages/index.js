import { useEffect, useState } from 'react';

import { getSession } from 'next-auth/client';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../util/mongodb';

import Layout from '../components/layout';
import Tweet from '../components/tweet';

export default function Home({ session, _tweets }) {
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
      <div className="flex justify-between w-1/2 my-4">
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

      <div className="flex flex-col w-full items-center mb-8">
        {tweets.length > 0 && tweets.map(tweet => <Tweet key={tweet._id} session={session.user} user={session.user} _tweet={tweet} sendToParent={setTweetId} />)}
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

  const tweets = await db.collection('tweets').find({ userId: ObjectId(session.user.id) }).sort( { _id: -1 } ).toArray();

  return {
    props: {
      session,
      _tweets: JSON.parse(JSON.stringify(tweets)),
    }
  }
}
