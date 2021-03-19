import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';

export default function ClientSide () {
  const router = useRouter();

  const [session, loading] = useSession();

  useEffect(() => {
    if (! loading && ! session) {
      router.push('/api/auth/signin');
    }
  }, [loading, session]);

  if (session) {
    return <>Signed in as {session.user.email}</>;
  }

  return <>Loading ...</>;
}
