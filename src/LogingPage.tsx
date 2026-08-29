import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLogin } from './api/auth-api';
import { isTokenValid } from './api/tokenUtils';

const LogingPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const loginMutation = useLogin();
    const navigate = useNavigate();

    useEffect(() => {
        if (isTokenValid()) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        if (!username || !password) {
            setError('Please fill in all fields');
            return;
        }

        loginMutation.mutate(
            { username, password },
            {
                onSuccess: (data) => {
                    if (data && data.success) {
                        navigate('/dashboard');
                    } else {
                        setError(data?.message || 'Login failed');
                    }
                },
                onError: (err: any) => {
                    setError(err?.response?.data?.message || err?.message || 'An error occurred during login');
                }
            }
        );
    };
  return (
<div className="relative flex min-h-screen items-center justify-center overflow-hidden">

  {/* Background image */}
  <div
    className="absolute inset-0 bg-cover bg-center"
    style={{
      backgroundImage:
        "url('https://media.istockphoto.com/photos/green-rice-fild-with-evening-sky-picture-id497627966?k=20&m=497627966&s=612x612&w=0&h=iT71vO9aSi7zLGSlpUREzMkkArJMVRERBiwsollJLdo=')",
    }}
  />

  {/* Background overlay */}
  <div className="absolute inset-0 bg-black/40" />

  {/* Login card */}
  <div className="relative z-10 w-[420px] rounded-lg border border-gray-300 bg-white p-8 shadow-2xl   m-[50px] ">

    <h1 className="mb-8 text-center text-3xl font-bold text-green-600">
      Plant Disease Prediction
    </h1>

    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="mb-5">
        <label
          htmlFor="username"
          className="mb-2 block font-medium text-gray-700"
        >
          Username
        </label>

        <input
          type="text"
          id="username"
          name="username"
          placeholder="Enter username"
          className="w-full rounded-md border border-gray-300 px-4 py-2
                     focus:outline-none focus:ring-2 focus:ring-green-500"
                     onChange={(e) => setUsername(e.target.value)}

        />
      </div>

      <div className="mb-6">
        <label
          htmlFor="password"
          className="mb-2 block font-medium text-gray-700"
        >
          Password
        </label>

        <input
          type="password"
          id="password"
          name="password"
          placeholder="Enter password"
          className="w-full rounded-md border border-gray-300 px-4 py-2
                     focus:outline-none focus:ring-2 focus:ring-green-500"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {error && (
        <div className="mb-4 text-center text-sm font-semibold text-red-600 bg-red-50 p-2 rounded-md border border-red-200">
          {error}
        </div>
      )}

      {loginMutation.isPending && (
        <div className="mb-4 text-center text-sm font-semibold text-green-600">
          Logging in...
        </div>
      )}

      <button
        type="submit"
        disabled={loginMutation.isPending}
        className="w-full rounded-md bg-green-600 py-2 font-bold text-white
                   transition hover:bg-green-700 disabled:opacity-50"
      >
        Login
      </button>

    </form>

    <div className="mt-6 text-center text-sm text-gray-600">
      Don't have an account?{' '}
      <Link
        to="/register"
        className="font-semibold text-green-600 hover:text-green-700 transition hover:underline"
      >
        Register
      </Link>
    </div>
  </div>
</div>
  );
};

export default LogingPage        