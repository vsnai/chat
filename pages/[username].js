import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { getSession } from 'next-auth/client';

import Layout from '../components/layout';
import Tweet from '../components/tweet';

export default function Profile({ session }) {
  const router = useRouter();

  const [user, setUser] = useState({});
  const [tweets, setTweets] = useState([]);
  const [tweetId, setTweetId] = useState('');

  useEffect(() => {
    setTweets(tweets.filter(t => t._id !== tweetId));
  }, [tweetId]);

  useEffect(() => {
    async function fetchTweets () {
      const res = await fetch('/api/v1/tweet');
      const json = await res.json();

      setTweets(json.tweets);
    }

    fetchTweets();
  }, [])

  return (
    <Layout>
      <div className="flex flex-col items-center w-full">
        <div className="flex items-center space-x-4 w-1/2 bg-white p-8 border-b mt-8 mb-4">
          <img className="w-24 h-24 rounded-full" src={session.user.image} />
          <div>{session.user.name}</div>
        </div>
      </div>

      <div className="flex flex-col w-full items-center mb-8">
        {tweets.length > 0 && tweets.map(tweet => <Tweet key={tweet._id} session={session} currentTweet={tweet} sendToParent={setTweetId} />)}
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

  return {
    props: { session }
  }
}
