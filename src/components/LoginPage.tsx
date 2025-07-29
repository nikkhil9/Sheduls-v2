import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Stethoscope, ArrowRight, Info } from 'lucide-react';

type LoginFormInputs = {
  email: string;
  password: string;
};

// The onLogin prop now accepts the role as a second argument
type LoginPageProps = {
  onLogin: (credentials: { email: string }, role: 'patient' | 'doctor') => void;
};

export const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  const { register, handleSubmit, formState: { errors }, reset } = useForm<LoginFormInputs>();

  const onSubmit = (data: LoginFormInputs) => {
    // Pass both the form data and the selected role to the handler
    onLogin({ email: data.email }, role);
  };
  
  const handleRoleChange = (newRole: 'patient' | 'doctor') => {
      setRole(newRole);
      reset(); // Clear form fields on role change
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg">
        <div className="text-center">
          <Stethoscope className="mx-auto h-12 w-12 text-indigo-600" />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">Welcome to Shedula</h1>
          <p className="mt-2 text-sm text-slate-600">Sign in to continue.</p>
        </div>

        <div className="flex justify-center bg-slate-100 rounded-full p-1">
            <button onClick={() => handleRoleChange('patient')} className={`w-1/2 py-2 px-4 rounded-full text-sm font-semibold transition-colors ${role === 'patient' ? 'bg-indigo-600 text-white shadow' : 'text-slate-600'}`}>
                I&apos;m a Patient
            </button>
            <button onClick={() => handleRoleChange('doctor')} className={`w-1/2 py-2 px-4 rounded-full text-sm font-semibold transition-colors ${role === 'doctor' ? 'bg-indigo-600 text-white shadow' : 'text-slate-600'}`}>
                I&apos;m a Doctor
            </button>
        </div>

        {/* Note box for doctor credentials */}
        {role === 'doctor' && (
            <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 rounded-r-lg">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <Info className="h-5 w-5 text-indigo-500" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-indigo-700">
                            Use mock credentials to sign in. <br />
                            <span className="font-medium">Email:</span> aisha@clinic.com <br />
                            <span className="font-medium">Password:</span> (any password &gt; 6 chars)
                        </p>
                    </div>
                </div>
            </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email address</label>
            <input 
              id="email" 
              type="email" 
              placeholder={role === 'patient' ? 'john@example.com' : 'aisha@clinic.com'} 
              {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" }})} 
              className={`w-full px-3 py-2 border text-slate-900 ${errors.email ? 'border-red-500' : 'border-slate-300'} rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
            <input 
              id="password" 
              type="password" 
              placeholder="••••••••" 
              {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' }})} 
              className={`w-full px-3 py-2 border text-slate-900 ${errors.password ? 'border-red-500' : 'border-slate-300'} rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
            />
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
          </div>
          <div>
            <button type="submit" className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Sign In <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
