import { getSession } from 'next-auth/client';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../../../../util/mongodb';

export default async (req, res) => {
  if (req.method === 'GET') {
    const { db } = await connectToDatabase();
    const session = await getSession({ req });
    const { userId } = req.query

    const messages = await db.collection('messages').find({
      $or: [
        { from: ObjectId(userId), to: ObjectId(session.user._id) },
        { from: ObjectId(session.user._id), to: ObjectId(userId) }
      ]
    })
      .sort({ _id: -1 })
      .toArray();

    res.status(200).json({ messages });
  }
}
