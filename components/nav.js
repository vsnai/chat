import { useRouter } from 'next/router';

export default function Nav ({ user }) {
  const router = useRouter();

  return (
    <nav className="flex container justify-between mx-auto">
      <button className="p-4" onClick={() => router.push('/tweet')}>Home</button>

      <div>
        <button className="p-4" onClick={() => router.push(`/${user.username}`)}>Profile</button>
        <button className="p-4" onClick={() => router.push('/account')}>{user.username}</button>
      </div>
    </nav>
  );
}
