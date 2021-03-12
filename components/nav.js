import { useRouter } from 'next/router';

export default function Nav ({ user }) {
  const router = useRouter();

  return (
    <nav className="flex flex-grow justify-between items-center">
      <button className="px-4 py-2" onClick={() => router.push('/tweet')}>Home</button>

      <div>
        <button className="px-4 py-2" onClick={() => router.push(`/${user.username}`)}>Profile</button>
        <button className="px-4 py-2" onClick={() => router.push('/account')}>{user.username}</button>
      </div>
    </nav>
  );
}
