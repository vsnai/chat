import { getSession } from 'next-auth/client';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../../../../util/mongodb';

export default async (req, res) => {
  if (req.method === 'GET') {
    const { db } = await connectToDatabase();
    const session = await getSession({ req });
    const { respondentId } = req.query

    const messages = await db.collection('messages').find({
      $or: [
        { from: ObjectId(respondentId), to: ObjectId(session.user._id) },
        { from: ObjectId(session.user._id), to: ObjectId(respondentId) }
      ]
    })
      .sort({ _id: -1 })
      .toArray();

    res.status(200).json({ messages });
  }
}
