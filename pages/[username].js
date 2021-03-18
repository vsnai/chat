import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { getSession } from 'next-auth/client';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../util/mongodb';

import Layout from '../components/layout';
import Tweet from '../components/tweet';
import Message from '../components/message';

export default function Profile({ session, _user, _tweets, _follows, _counts }) {
  const router = useRouter();

  const [user] = useState(_user);
  const [tweets, setTweets] = useState(_tweets);
  const [tweetId, setTweetId] = useState('');

  useEffect(() => {
    setTweets(tweets.filter(t => t._id !== tweetId));
  }, [tweetId]);

  async function follow (user) {
    const res = await fetch('/api/v1/follow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user })
    });

    if (res.status === 201) {
      router.reload();
    }
  }

  async function unfollow (user) {
    const res = await fetch('/api/v1/follow', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user })
    });

    if (res.status === 204) {
      router.reload();
    }
  }

  function isFollowing (user) {
    return !! _follows.find(f => f.following === user._id);
  }

  return (
    <Layout>
      <div className="container flex mt-4 space-x-4">
        <div className="flex-none flex flex-col w-64">
        </div>

        <div className="flex-auto">
          <div className="flex justify-between items-center bg-white p-8 border-b">
            <div className="flex items-center space-x-4">
              <img className="w-24 h-24 rounded-full" src={user.image} />
              <div className="flex flex-col">
                <div>{user.name}</div>
                <div>Following: {_counts.followersCount} | Followers: {_counts.followingCount}</div>
              </div>
            </div>


            <div>
              <Message user={user} />
            </div>

            {session.user.id !== user._id &&
            <div>
              <button
                onClick={isFollowing(user) ? () => unfollow(user) : () => follow(user)}
                className='flex mx-2 px-4 py-2 text-white border bg-black border-black hover:bg-white hover:text-black'
              >
                {isFollowing(user) ? 'Unfollow' : 'Follow'}
              </button>
            </div>
            }
          </div>

          <div className="flex flex-col w-full items-center mb-8">
            {tweets.length > 0 && tweets.map(tweet => <Tweet key={tweet._id} session={session.user} user={user} _tweet={tweet} sendToParent={setTweetId} />)}
          </div>
        </div>

        <div className="flex-none flex flex-col w-64">
        </div>
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

  if (! user) {
    return {
      redirect: {
        permanent: false,
        destination: `/search?q=${params.username}`
      }
    }
  }

  const follows = await db.collection('follows').find({ follower: ObjectId(session.user.id) }).toArray();
  const tweets = await db.collection('tweets').find({ userId: user._id }).sort( { _id: -1 } ).toArray();

  const followersCount = await db.collection('follows').find({ follower: ObjectId(user._id) }).count();
  const followingCount = await db.collection('follows').find({ following: ObjectId(user._id) }).count();

  return {
    props: {
      session,
      _user: JSON.parse(JSON.stringify(user)),
      _tweets: JSON.parse(JSON.stringify(tweets)),
      _follows: JSON.parse(JSON.stringify(follows)),
      _counts: { followersCount, followingCount }
    }
  }
}
