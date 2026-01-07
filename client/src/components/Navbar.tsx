import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Search, PenSquare, LogOut, User, Code2, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const Navbar = () => {
    const { isAuthenticated, logout, user } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const [showDropdown, setShowDropdown] = useState(false);
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

    const handleLogout = () => {
        logout();
        navigate('/');
        setShowDropdown(false);
        setIsMobileMenuOpen(false);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/?search=${encodeURIComponent(searchTerm)}`);
            setIsMobileMenuOpen(false);
        } else {
            navigate('/');
        }
    };

    return (
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center gap-2">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="bg-primary-500 text-white p-1.5 rounded-lg">
                                <Code2 size={20} />
                            </div>
                            <span className="font-bold text-xl text-slate-900">DevBlog</span>
                        </Link>
                    </div>

                    {/* Desktop Search & Nav - Hidden on Mobile */}
                    <div className="hidden md:flex flex-1 items-center justify-between ml-8">
                        <div className="flex-1 max-w-md mx-auto">
                            <form onSubmit={handleSearch} className="w-full relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-4 w-4 text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition duration-150 ease-in-out"
                                    placeholder="Search articles..."
                                />
                            </form>
                        </div>

                        <div className="flex items-center gap-4 ml-4">
                            {isAuthenticated ? (
                                <>
                                    <Link
                                        to="/write"
                                        className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                    >
                                        <PenSquare size={16} />
                                        Write a Post
                                    </Link>

                                    <div className="relative ml-2">
                                        <button
                                            onClick={() => setShowDropdown(!showDropdown)}
                                            className="flex items-center gap-2 focus:outline-none"
                                        >
                                            <div className="h-9 w-9 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden border border-slate-200">
                                                {user?.profile_picture ? (
                                                    <img src={user.profile_picture} alt="Profile" className="h-full w-full object-cover" />
                                                ) : (
                                                    <User size={20} className="text-slate-500" />
                                                )}
                                            </div>
                                            <ChevronDown size={16} className={`text-slate-500 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                                        </button>

                                        {showDropdown && (
                                            <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-xl shadow-xl py-2 bg-white animate-in fade-in zoom-in duration-200 border border-slate-200 z-50">
                                                <Link
                                                    to={`/profile/me`}
                                                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary-600 transition-colors"
                                                    onClick={() => setShowDropdown(false)}
                                                >
                                                    <User size={18} />
                                                    My Profile
                                                </Link>
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                                >
                                                    <LogOut size={18} />
                                                    Logout
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="text-slate-600 hover:text-slate-900 font-medium text-sm px-3 py-2"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Mobile Hamburger Button */}
                    <div className="flex md:hidden items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-slate-500 hover:text-slate-700 p-2"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isMobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-slate-200 animate-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-4 space-y-4">
                        {/* Mobile Search */}
                        <form onSubmit={handleSearch} className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-slate-400" />
                            </div>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-1 focus:ring-primary-500"
                                placeholder="Search articles..."
                            />
                        </form>

                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/write"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center gap-2 w-full px-4 py-2 text-base font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600"
                                >
                                    <PenSquare size={18} />
                                    Write a Post
                                </Link>
                                <div className="border-t border-slate-100 pt-4 mt-2">
                                    <div className="flex items-center gap-3 px-2 mb-3">
                                        <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                                            {user?.profile_picture ? (
                                                <img src={user.profile_picture} alt="Profile" className="h-full w-full object-cover" />
                                            ) : (
                                                <User size={16} className="text-slate-500" />
                                            )}
                                        </div>
                                        <span className="font-medium text-slate-700">{user?.name}</span>
                                    </div>
                                    <Link
                                        to="/profile/me"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg"
                                    >
                                        <User size={18} />
                                        My Profile
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg w-full text-left"
                                    >
                                        <LogOut size={18} />
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <Link
                                    to="/login"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="w-full text-center px-4 py-2 border border-slate-200 text-sm font-medium rounded-lg text-slate-700 hover:bg-slate-50"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="w-full text-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-500 hover:bg-primary-600"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
