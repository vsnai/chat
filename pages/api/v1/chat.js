import { getSession } from 'next-auth/client';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../../../util/mongodb';

export default async (req, res) => {
  if (req.method === 'POST') {
    const { db } = await connectToDatabase();
    const session = await getSession({ req });

    const { user } = req.body;

    const messages = await db.collection('messages').find({
      $or: [
        { from: ObjectId(user._id), to: ObjectId(session.user._id) },
        { from: ObjectId(session.user._id), to: ObjectId(user._id) }
      ]
    })
    .sort({ _id: -1 })
    .toArray();

    if (messages.length > 0) {
      res.status(200).json({ messages });
    } else {
      res.status(404);
      res.end();
    }
  }
}
