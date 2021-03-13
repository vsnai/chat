import { connectToDatabase } from '../../../util/mongodb';

export default async (req, res) => {
  if (req.method === 'POST') {
    const { db } = await connectToDatabase();

    const { name } = req.body;

    const user = await db.collection('users').findOne({ name });
    const tweets = await db.collection('tweets').find({ user_id: user._id }).sort( { _id: -1 } ).toArray();

    res.status(200).json({ user, tweets });
  }
}
