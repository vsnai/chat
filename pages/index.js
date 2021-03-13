import { useSession, signIn, signOut } from 'next-auth/client';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  const [session, loading] = useSession();

  if (! loading) {
    if (session) {
      router.push('/tweet');
    } else {
      signIn();
    }
  }

  return <>Loading ...</>;
}
