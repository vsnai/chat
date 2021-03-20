import { connectToDatabase } from '../../../util/mongodb';

export default async (req, res) => {
  const { db } = await connectToDatabase();

  const contacts = await db.collection('users').find({}).toArray();

  if (contacts) {
    res.status(200).json({ contacts });
  } else {
    res.status(404).end();
  }
}
