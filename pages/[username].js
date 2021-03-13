import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { getSession } from 'next-auth/client';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import Nav from '../components/nav';

export default function Profile() {
  dayjs.extend(relativeTime);
  const router = useRouter();

  const [user, setUser] = useState({});
  const [tweets, setTweets] = useState({});

  // useEffect(() => {
  //   async function fetchData () {
  //     const session = await getSession();

  //     if (! session) {
  //       router.push('/');

  //       return;
  //     }

  //     setUser(session.user);
  //   }

  //   fetchData();
  // }, [])

  useEffect(() => {
    if (router.asPath !== router.route) {
      async function getTweets () {
        const res = await fetch('/api/v1/user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: router.query.username })
        });

        const json = await res.json();

        setUser(json.user);
        setTweets(json.tweets);
      }

      getTweets();
    }
  }, [router]);

  return (
    <>
      <div className="flex container justify-between mx-auto my-2">
        <Nav user={user} query={router.query.q} />
      </div>

      <div className="flex flex-col items-center">
        <div className="flex justify-between items-center w-1/2 my-4">
          <div className="flex items-center space-x-4">
            <img className="w-24 h-24 rounded-full" src={user.image} />
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
              <img className="w-12 h-12 rounded-full" src={user.image} />

              <div className="flex flex-col flex-grow ml-4">
                <div className="flex items-center">
                  <div className="font-bold">{user.name}</div>
                  <div className="ml-2 text-xs text-gray-300">
                    {tweet.updatedAt !== null
                      ? `${dayjs(tweet.updatedAt).fromNow()} (edited)`
                      : dayjs(tweet.createdAt).fromNow()
                    }
                  </div>
                </div>

                <div className="my-2">{tweet.content}</div>

                <div className="flex space-x-2">
                  <button className="focus:outline-none text-xs text-gray-300 hover:text-black" onClick={() => console.log('under con..')}>Show</button>
                </div>
              </div>
            </div>
          </div>
        })}
      </div>
    </>
  );
}
