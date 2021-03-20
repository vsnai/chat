import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Menu } from '@headlessui/react';

export default function Tweet ({ session, user, _tweet, sendToParent }) {
  const router = useRouter();
  dayjs.extend(relativeTime);

  const [tweet, setTweet] = useState(_tweet);
  const [isEditMode, setIsEditMode] = useState(false);

  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditMode) {
      setTimeout(() => inputRef.current.focus(), 200);
    }
  }, [isEditMode]);

  async function saveTweet (e) {
    if (e.key === 'Enter') {
      setIsEditMode(false);
      setTweet({ ...tweet, updatedAt: new Date() });

      await fetch('/api/v1/tweet', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tweet })
      });
    } else if (e.key === 'Escape') {
      setIsEditMode(false);
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
    return session._id === user.id ? user.id : session._id;
  }

  return (
    <div className='flex justify-between items-start w-full p-4 border-b bg-white hover:bg-gray-50'>
      <div className="flex flex-auto items-center">
        <button className="focus:outline-none" onClick={() => router.push(`/${user.name}`)}>
          <img className="w-16 h-16 rounded-full mx-4" src={user && user.image} />
        </button>

        <div className="flex flex-col flex-grow ml-4">
          <div className="flex items-center">
            <button className="font-bold" onClick={() => router.push(`/${user.name}`)}>{user.name}</button>
            <div className="ml-2 text-xs text-gray-300">
              {dayjs(tweet.updatedAt).isSame(dayjs(tweet.createdAt))
                ? dayjs(tweet.createdAt).fromNow()
                : `${dayjs(tweet.updatedAt).fromNow()} (edited)`
              }
            </div>
          </div>

          {isEditMode 
            ? <input
                className="p-1 my-1 bg-white border-0 border-b border-gray-200 focus:border-black focus:outline-none focus:ring-0"
                value={tweet.content}
                onChange={e => setTweet({ ...tweet, content: e.target.value })}
                onKeyDown={saveTweet}
                ref={inputRef}
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
          </div>
        </div>
      </div>

      <div className="relative">
        <Menu>
          <Menu.Button className="hover:bg-white p-2 focus:outline-none">
            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
          </Menu.Button>
          <Menu.Items className="z-10 absolute flex flex-col right-0 w-56 mt-1 origin-top-right font-light text-sm text-gray-600 bg-white border shadow-lg outline-none">
            <Menu.Item>
              {() => (
                <button className={`flex text-left p-4 hover:text-black hover:bg-gray-50`} onClick={() => console.log(tweet)}>Share</button>
              )}
            </Menu.Item>
            {session._id === tweet.userId && <Menu.Item>
              {() => (
                <button className={`flex text-left p-4 hover:text-black hover:bg-gray-50`} onClick={() => setIsEditMode(true)}>Edit</button>
              )}
            </Menu.Item>}
            {session._id === tweet.userId && <Menu.Item>
              {() => (
                <button className={`flex text-left p-4 hover:text-black hover:bg-gray-50`} onClick={() => remove() }>Delete</button>
              )}
            </Menu.Item>}
          </Menu.Items>
        </Menu>
      </div>
    </div>
  );
}
