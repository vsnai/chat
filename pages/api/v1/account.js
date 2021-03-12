import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../../../util/mongodb';

export default async (req, res) => {
  if (req.method === 'PUT') {
    const { db } = await connectToDatabase();

    const { user, username, email, bio } = req.body;

    await db.collection('users').findOneAndUpdate(
      { _id: ObjectId(user._id) },
      { $set: { username, email, bio } }
    );
  
    res.status(200).json({});
  }
};
