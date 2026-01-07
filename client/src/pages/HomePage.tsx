import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PostCard from '../components/PostCard';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import axios from 'axios';

interface Post {
    id: number;
    title: string;
    excerpt: string;
    content: string;
    author_name: string;
    author_avatar: string;
    tags: string[] | string; // Handle possible string from DB
    created_at: string;
}

const HomePage = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchParams] = useSearchParams();

    const searchQuery = searchParams.get('search') || '';

    // Reset page when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    useEffect(() => {
        const fetchPosts = async () => {
            setIsLoading(true);
            try {
                const res = await axios.get(`http://localhost:5001/posts?page=${currentPage}&limit=5&search=${encodeURIComponent(searchQuery)}`);
                setPosts(res.data.posts);
                setTotalPages(res.data.totalPages);
                setError('');
            } catch (err) {
                console.error('Error fetching posts:', err);
                setError('Failed to load posts. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, [currentPage, searchQuery]);

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">Developer Stories</h1>
                    <p className="mt-3 text-lg text-slate-500">Insights, tutorials, and experiences from the dev community</p>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin text-primary-500" size={40} />
                    </div>
                ) : error ? (
                    <div className="text-center py-20 bg-red-50 rounded-xl">
                        <p className="text-red-500">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 text-primary-600 hover:underline"
                        >
                            Try Again
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="space-y-6">
                            {posts.map(post => (
                                <PostCard
                                    key={post.id}
                                    post={{
                                        ...post,
                                        author: {
                                            name: post.author_name,
                                            avatar: post.author_avatar
                                        },
                                        date: new Date(post.created_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        }),
                                        // Ensure tags is strictly string[] for PostCard
                                        tags: typeof post.tags === 'string' ? JSON.parse(post.tags) : post.tags
                                    }}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-12 flex items-center justify-center gap-2">
                                <button
                                    className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:bg-white hover:text-slate-900 disabled:opacity-50"
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                >
                                    <ChevronLeft size={20} />
                                </button>

                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        className={`w-10 h-10 rounded-lg font-medium transition-colors ${currentPage === page
                                            ? 'bg-primary-500 text-white'
                                            : 'text-slate-600 hover:bg-white'
                                            }`}
                                        onClick={() => setCurrentPage(page)}
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button
                                    className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:bg-white hover:text-slate-900 disabled:opacity-50"
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
};

export default HomePage;
