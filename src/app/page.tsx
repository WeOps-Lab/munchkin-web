import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/knowledge');
  return null;
}