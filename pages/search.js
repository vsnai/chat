import { useRouter } from 'next/router';

import { connectToDatabase } from '../util/mongodb';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import Layout from '../components/layout';

export default function Search({ users }) {
  dayjs.extend(relativeTime);
  const router = useRouter();

  return (
    <Layout>
      <div className="flex flex-col items-center">
        <div className="flex flex-col justify-between w-1/2 my-4">
          {users && users.map(u => <button key={u._id} onClick={() => router.push(`/${u.name}`)}>{u.name}</button>)}
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ query }) {
  const { db } = await connectToDatabase();

  const users = await db.collection('users').find({ name: {'$regex': new RegExp(`${query.q}`) } }).toArray();

  return {
    props: {
      users: JSON.parse(JSON.stringify(users))
    }
  };
}
