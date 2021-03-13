import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { getSession } from 'next-auth/client';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import Nav from '../../components/nav';

export default function Tweet() {
  dayjs.extend(relativeTime);
  const router = useRouter();

  const [user, setUser] = useState({});
  const [tweets, setTweets] = useState({});
  const [selectedTweet, setSelectedTweet] = useState({ _id: '', content: '' });
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    async function fetchData () {
      const session = await getSession();

      if (! session) {
        router.push('/');

        return;
      }

      setUser(session.user);

      const res = await fetch('/api/v1/tweet');
      const json = await res.json();

      setTweets(json.tweets);
    }

    fetchData();
  }, [])

  async function add () {
    const res = await fetch('/api/v1/tweet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tweet: selectedTweet })
    });

    if (res.status === 201) {
      router.reload();
    }
  }

  async function edit () {
    const res = await fetch('/api/v1/tweet', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tweet: selectedTweet })
    });

    if (res.status === 200) {
      router.reload();
    }
  }

  async function remove (tweet) {
    const res = await fetch('/api/v1/tweet', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tweet })
    });

    if (res.status === 204) {
      router.reload();
    }
  }

  function enterEditMode (tweet) {
    setIsEditMode(true);

    setSelectedTweet({ ...tweet });
  }

  function exitEditMode () {
    setIsEditMode(false);

    setSelectedTweet({ _id: '', content: '' });
  }

  return (
    <>
      <div className="flex container justify-between mx-auto my-2">
        <Nav user={user} query={router.query.q} />
      </div>

      <div className="flex flex-col items-center">
        <div className="flex justify-between w-1/2 my-4">
          <input
            className="flex-auto px-4 py-2 border mr-4"
            type="text"
            placeholder="My post"
            onChange={e => setSelectedTweet({ ...selectedTweet, content: e.target.value })}
            value={selectedTweet.content}
          />

          <button
            onClick={isEditMode ? () => edit() : () => add()}
            className="flex-none px-4 py-2 bg-black text-white hover:bg-white hover:text-black border border-black"
          >{isEditMode ? 'Edit' : 'Add'}</button>

          {isEditMode && <button
            onClick={() => exitEditMode()}
            className="flex-none ml-2 px-4 py-2 bg-red-500 text-white hover:bg-white hover:text-black"
          >X</button>}
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
                  <button onClick={() => router.push(`/${user.name}`)} className="font-bold">{user.name}</button>
                  <div className="ml-2 text-xs text-gray-300">
                    {tweet.updatedAt !== null
                      ? `${dayjs(tweet.updatedAt).fromNow()} (edited)`
                      : dayjs(tweet.createdAt).fromNow()
                    }
                  </div>
                </div>

                <div className="my-2">{tweet.content}</div>

                <div className="flex space-x-2">
                  <button className="focus:outline-none text-xs text-gray-300 hover:text-black" onClick={() => console.log('under construction...')}>Show</button>
                  <button className="focus:outline-none text-xs text-gray-300 hover:text-black" onClick={() => enterEditMode(tweet)}>Edit</button>
                  <button className="focus:outline-none text-xs text-gray-300 hover:text-black" onClick={() => remove(tweet) }>Delete</button>
                </div>
              </div>
            </div>
          </div>
        })}
      </div>
    </>
  );
}
