import { Suspense } from 'react';
import LoginForm from './LoginForm';

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[80vh] flex-col items-center justify-center text-center">
        <p className="text-slate-400">Loading login form...</p>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
