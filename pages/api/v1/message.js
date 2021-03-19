import { getSession } from 'next-auth/client';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../../../util/mongodb';

export default async (req, res) => {
  const session = await getSession({ req });
  const { db } = await connectToDatabase();

  if (req.method === 'POST') {
    const { input, user } = req.body;

    const date = new Date();

    const { ops } = await db.collection('messages').insertOne({
      from: ObjectId(session.user._id),
      to: ObjectId(user._id),
      message: input,
      createdAt: date,
      updatedAt: date
    });

    res.status(201).json({ message: ops[0] });
  }
}
