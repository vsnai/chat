import { getSession } from 'next-auth/client';

import { connectToDatabase } from '../../../util/mongodb';

export default async (req, res) => {
  if (req.method === 'GET') {
    const session = await getSession({ req });

    if (session) {
      res.status(200).json({ user: session.user });
    } else {
      res.status(404).end();
    }
  } else if (req.method === 'POST') {
    const { db } = await connectToDatabase();

    const { name } = req.body;

    const user = await db.collection('users').findOne({ name });

    if (user === null) {
      res.status(404).end();
    } else {
      const tweets = await db.collection('tweets').find({ userId: user._id }).sort( { _id: -1 } ).toArray();

      res.status(200).json({ user, tweets });
    }
  }
}
