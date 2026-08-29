import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useRegister } from './api/auth-api';
import { isTokenValid } from './api/tokenUtils';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const registerMutation = useRegister();
    const navigate = useNavigate();

    useEffect(() => {
        if (isTokenValid()) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        if (!username || !email || !password || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        // Email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        registerMutation.mutate(
            { username, email, password },
            {
                onSuccess: (data) => {
                    if (data && data.success) {
                        navigate('/dashboard');
                    } else {
                        setError(data?.message || 'Registration failed');
                    }
                },
                onError: (err: any) => {
                    setError(err?.response?.data?.message || err?.message || 'An error occurred during registration');
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

            {/* Register card */}
            <div className="relative z-10 w-[420px] rounded-lg border border-gray-300 bg-white p-8 shadow-2xl m-[50px]">
                <h1 className="mb-6 text-center text-3xl font-bold text-green-600">
                    Plant Disease Prediction
                </h1>
                
                <h2 className="mb-6 text-center text-xl font-semibold text-gray-700">
                    Create your account
                </h2>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label
                            htmlFor="username"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Enter username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="email"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter password (min 6 chars)"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="confirmPassword"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            placeholder="Confirm password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    {error && (
                        <div className="text-center text-xs font-semibold text-red-600 bg-red-50 p-2 rounded-md border border-red-200">
                            {error}
                        </div>
                    )}

                    {registerMutation.isPending && (
                        <div className="text-center text-xs font-semibold text-green-600">
                            Registering account...
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={registerMutation.isPending}
                        className="w-full rounded-md bg-green-600 py-2.5 font-bold text-white text-sm transition hover:bg-green-700 disabled:opacity-50"
                    >
                        Register
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        className="font-semibold text-green-600 hover:text-green-700 transition hover:underline"
                    >
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
