import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, UserPlus, Code2 } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const { name, email, password } = formData;

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const res = await axios.post('http://localhost:5001/auth/register', {
                name,
                email,
                password
            });

            login(res.data.token);
            navigate('/'); // Redirect to home/dashboard
        } catch (err: any) {
            if (err.response && err.response.data) {
                // Handle validation errors array or single message
                if (err.response.data.errors) {
                    setError(err.response.data.errors[0].msg);
                } else {
                    setError(err.response.data.message || 'Registration failed');
                }
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
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Create an account</h1>
                    <p className="text-slate-500 text-[15px]">Join the developer community today</p>
                </div>

                <form className="flex flex-col gap-5 text-left" onSubmit={onSubmit}>
                    {error && <div className="text-sm text-red-500 bg-red-50 p-3 rounded-lg text-center">{error}</div>}

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-900">Full Name</label>
                        <div className="relative flex items-center">
                            <User className="absolute left-3 text-slate-400 w-5 h-5" />
                            <input
                                type="text"
                                name="name"
                                value={name}
                                onChange={onChange}
                                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg text-[15px] text-slate-900 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all bg-[#fdfdfd]"
                                placeholder="John Doe"
                                required
                            />
                        </div>
                    </div>

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
                                minLength={6}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="bg-primary-500 text-white font-semibold py-3.5 px-4 rounded-lg text-base w-full flex items-center justify-center gap-2 hover:bg-primary-600 transition-colors disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creating Account...' : (
                            <>
                                <UserPlus size={20} />
                                Create Account
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6 text-[15px] text-slate-500">
                    Already have an account? <Link to="/login" className="text-primary-500 font-semibold hover:underline">Sign in</Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
