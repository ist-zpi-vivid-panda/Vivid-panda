import Link from 'next/link';

const Home = () => {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <span>THIS IS DASHBOARD!</span>

      <Link href="/auth/login">GO TO APP</Link>
    </main>
  );
};

export default Home;
