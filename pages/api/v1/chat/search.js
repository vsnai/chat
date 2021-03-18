import { getSession } from 'next-auth/client';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../../../../util/mongodb';

export default async (req, res) => {
  if (req.method === 'POST') {
    const { db } = await connectToDatabase();

    const { name } = req.body;

    const user = await db.collection('users').findOne({ name });

    if (user) {
      res.status(200).json({ user });
    } else {
      res.status(404);
      res.end();
    }
  }
}
