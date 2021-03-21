import { useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { useSession } from 'next-auth/client';

import Layout from '../components/layout';
import Tweet from '../components/tweet';

import { RespondentContext } from '../contexts/RespondentContext';

export default function Profile () {
  const router = useRouter();

  const { name } = router.query;

  const [session, loading] = useSession();

  const { data, error, mutate } = useSWR(
    ! loading && `/api/v1/tweets/${name}`,
    (...args) => fetch(...args).then(res => res.json())
  );

  const { setRespondent } = useContext(RespondentContext);

  useEffect(() => {
    if (error) {
      router.push('/api/auth/signin');
    }
  }, [error]);

  // async function follow (user) {
  //   const res = await fetch('/api/v1/follows', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ user })
  //   });

  //   if (res.status === 201) {
  //     router.reload();
  //   }
  // }

  // async function unfollow (user) {
  //   const res = await fetch('/api/v1/follows', {
  //     method: 'DELETE',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ user })
  //   });

  //   if (res.status === 204) {
  //     router.reload();
  //   }
  // }

  function isFollowing () {
    // return !! _follows.find(f => f.following === data.user._id);
    return true;
  }

  return (
    <Layout>
      {data &&
        <div className="container flex mt-4 space-x-4">
          <div className="flex-none flex flex-col w-64">
          </div>

          <div className="flex-auto">
            <div className="flex justify-between items-center bg-white p-8 border-b">
              <div className="flex items-center space-x-4">
                <img className="w-24 h-24 rounded-full" src={data.user.image} />
                <div className="flex flex-col">
                  <div>{data.user.name}</div>
                  {/* <div>Following: {_counts.followersCount} | Followers: {_counts.followingCount}</div> */}
                </div>
              </div>

              <div className="flex">
                <div>
                  <button
                    onClick={() => setRespondent(data.user)}
                    className='flex mx-2 px-4 py-2 text-white border bg-black border-black hover:bg-white hover:text-black'
                  >
                    Send Message
                  </button>
                </div>

                {session.user._id !== data.user._id &&
                <div>
                  <button
                    onClick={isFollowing() ? () => unfollow() : () => follow()}
                    className='flex mx-2 px-4 py-2 text-white border bg-black border-black hover:bg-white hover:text-black'
                  >
                    {isFollowing() ? 'Unfollow' : 'Follow'}
                  </button>
                </div>
                }
              </div>
            </div>

            <div className="flex flex-col w-full items-center mb-8">
              {data.tweets.map(tweet => <Tweet key={tweet._id} session={session} tweet={tweet} mutate={mutate} />)}
            </div>
          </div>

          <div className="flex-none flex flex-col w-64">
          </div>
        </div>
      }
    </Layout>
  );
}

// export async function getServerSideProps({ req, params }) {
//   const session = await getSession({ req });

//   if (! session) {
//     return {
//       redirect: {
//         permanent: false,
//         destination: '/api/auth/signin'
//       }
//     }
//   }

//   const { db } = await connectToDatabase();

//   const user = await db.collection('users').findOne({ name: params.name });

//   if (! user) {
//     return {
//       redirect: {
//         permanent: false,
//         destination: `/search?q=${params.name}`
//       }
//     }
//   }

//   const follows = await db.collection('follows').find({ follower: ObjectId(session.user._id) }).toArray();
//   const tweets = await db.collection('tweets').find({ userId: user._id }).sort( { _id: -1 } ).toArray();

//   const followersCount = await db.collection('follows').find({ follower: ObjectId(user._id) }).count();
//   const followingCount = await db.collection('follows').find({ following: ObjectId(user._id) }).count();

//   return {
//     props: {
//       session,
//       _user: JSON.parse(JSON.stringify(user)),
//       _tweets: JSON.parse(JSON.stringify(tweets)),
//       _follows: JSON.parse(JSON.stringify(follows)),
//       _counts: { followersCount, followingCount }
//     }
//   }
// }
