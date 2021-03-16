import { useState, useEffect } from 'react';

import { getSession, session } from 'next-auth/client';
import { connectToDatabase } from '../util/mongodb';

import Layout from '../components/layout';
import Tweet from '../components/tweet';

export default function Profile({ session, _user, _tweets }) {
  const [user] = useState(_user);
  const [tweets, setTweets] = useState(_tweets);
  const [tweetId, setTweetId] = useState('');

  useEffect(() => {
    setTweets(tweets.filter(t => t._id !== tweetId));
  }, [tweetId]);

  return (
    <Layout>
      <div className="flex flex-col items-center w-full">
        <div className="flex items-center space-x-4 w-1/2 my-4 bg-white p-8 border-b">
          <img className="w-24 h-24 rounded-full" src={user.image} />
          <div>{user.name}</div>
        </div>
      </div>

      <div className="flex flex-col w-full items-center mb-8">
        {tweets.length > 0 && tweets.map(tweet => <Tweet key={tweet._id} session={session.user} user={user} _tweet={tweet} sendToParent={setTweetId} />)}
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ req, params }) {
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

  const user = await db.collection('users').findOne({ name: params.username });
  const tweets = await db.collection('tweets').find({ userId: user._id }).sort( { _id: -1 } ).toArray();

  return {
    props: {
      session,
      _user: JSON.parse(JSON.stringify(user)),
      _tweets: JSON.parse(JSON.stringify(tweets)),
    }
  }
}
