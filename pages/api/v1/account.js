import { getSession } from 'next-auth/client';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../../../util/mongodb';

export default async (req, res) => {
  const session = await getSession({ req });

  if (req.method === 'PUT') {
    const { db } = await connectToDatabase();

    const { name } = req.body;

    await db.collection('users').findOneAndUpdate(
      { _id: ObjectId(session.user.id) },
      { $set: { name: name.replace(/[^a-z]/gi, '').toLowerCase() } }
    );
  
    res.status(200).json({});
  }
};
