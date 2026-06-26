import { Suspense } from 'react';
import RegisterForm from './RegisterForm';

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[80vh] flex-col items-center justify-center text-center">
        <p className="text-slate-400">Loading registration form...</p>
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
