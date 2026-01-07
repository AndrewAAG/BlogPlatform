import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, Code2 } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const { email, password } = formData;

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const res = await axios.post('http://localhost:5001/auth/login', {
                email,
                password
            });

            login(res.data.token);
            navigate('/');
        } catch (err: any) {
            if (err.response && err.response.data) {
                setError(err.response.data.message || 'Login failed');
            } else {
                setError('Something went wrong. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
            <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md text-center">
                <div className="mb-8">
                    <div className="flex items-center justify-center gap-3 mb-6 font-bold text-2xl text-slate-900">
                        <div className="bg-primary-500 text-white p-2 rounded-lg flex items-center justify-center">
                            <Code2 size={24} />
                        </div>
                        <span>DevBlog</span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome back</h1>
                    <p className="text-slate-500 text-[15px]">Sign in to your account to continue</p>
                </div>

                <form className="flex flex-col gap-5 text-left" onSubmit={onSubmit}>
                    {error && <div className="text-sm text-red-500 bg-red-50 p-3 rounded-lg text-center">{error}</div>}

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-900">Email</label>
                        <div className="relative flex items-center">
                            <Mail className="absolute left-3 text-slate-400 w-5 h-5" />
                            <input
                                type="email"
                                name="email"
                                value={email}
                                onChange={onChange}
                                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg text-[15px] text-slate-900 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all bg-[#fdfdfd]"
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-900">Password</label>
                        <div className="relative flex items-center">
                            <Lock className="absolute left-3 text-slate-400 w-5 h-5" />
                            <input
                                type="password"
                                name="password"
                                value={password}
                                onChange={onChange}
                                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg text-[15px] text-slate-900 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all bg-[#fdfdfd]"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="bg-primary-500 text-white font-semibold py-3.5 px-4 rounded-lg text-base w-full flex items-center justify-center gap-2 hover:bg-primary-600 transition-colors disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Signing In...' : (
                            <>
                                <LogIn size={20} />
                                Sign In
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6 text-[15px] text-slate-500">
                    Don't have an account? <Link to="/register" className="text-primary-500 font-semibold hover:underline">Create one</Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
