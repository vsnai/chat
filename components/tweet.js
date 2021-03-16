import { useState } from 'react';
import { useRouter } from 'next/router';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

export default function Tweet ({ session, user, _tweet, sendToParent }) {
  const router = useRouter();
  dayjs.extend(relativeTime);

  const [tweet, setTweet] = useState(_tweet);
  const [isEditMode, setIsEditMode] = useState(false);

  async function saveTweet (e) {
    if (e.key === 'Enter') {
      setIsEditMode(false);
      setTweet({ ...tweet, updatedAt: new Date() });

      await fetch('/api/v1/tweet', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tweet })
      });
    }
  }

  async function remove () {
    const res = await fetch('/api/v1/tweet', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tweet })
    });

    if (res.status === 204) {
      sendToParent(() => tweet._id);
    }
  }

  async function like () {
    const res = await fetch('/api/v1/like', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tweet })
    });

    if (res.status === 200) {
      tweet.likedBy.push(getUserId());

      setTweet({ ...tweet });
    }
  }

  async function dislike () {
    const res = await fetch('/api/v1/like', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tweet })
    });

    if (res.status === 204) {
      setTweet({ ...tweet, likedBy: tweet.likedBy.filter(item => item !== getUserId()) });
    }
  }

  function getUserId () {
    return session.id === user.id ? user.id : session.id;
  }

  return (
    <div className='flex justify-between items-center w-1/2 px-8 py-4 border-b bg-white hover:bg-gray-50'>
      <div className="flex flex-auto">
        <img className="w-12 h-12 rounded-full" src={user.image} />

        <div className="flex flex-col flex-grow ml-4">
          <div className="flex items-center">
            <button onClick={() => router.push(`/${user.name}`)} className="font-bold">{user.name}</button>
            <div className="ml-2 text-xs text-gray-300">
              {dayjs(tweet.updatedAt).isSame(dayjs(tweet.createdAt))
                ? dayjs(tweet.createdAt).fromNow()
                : `${dayjs(tweet.updatedAt).fromNow()} (edited)`
              }
            </div>
          </div>

          {isEditMode 
            ? <input
                className="w-64 px-4 py-2 bg-gray-100 border-0 border-b border-gray-200 focus:border-black focus:ring-0"
                value={tweet.content}
                onChange={e => setTweet({ ...tweet, content: e.target.value })}
                onKeyDown={saveTweet}
              />
            : <div className="my-2">{tweet.content}</div>
          }

          <div className="flex items-center space-x-4">
            {!tweet.likedBy.includes(getUserId()) &&
              <button className="flex items-center focus:outline-none text-xs text-gray-300 hover:text-red-300" onClick={() => like()}>
                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>

                <div className="ml-1">{tweet.likedBy.length}</div>
              </button>
            }

            {tweet.likedBy.includes(getUserId()) &&
              <button className="flex items-center focus:outline-none text-xs text-red-500 hover:text-red-300" onClick={() => dislike()}>
                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>

                <div className="ml-1">{tweet.likedBy.length}</div>
              </button>
            }

            <button className="focus:outline-none text-xs text-gray-300 hover:text-black" onClick={() => setIsEditMode(true)}>Edit</button>
            <button className="focus:outline-none text-xs text-gray-300 hover:text-black" onClick={() => remove() }>Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
}
