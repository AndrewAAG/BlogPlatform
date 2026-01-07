import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Calendar, Edit, Trash2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

interface Post {
    id: number;
    title: string;
    excerpt: string;
    content: string;
    author_name: string;
    author_avatar: string;
    tags: string[] | string;
    created_at: string;
    author_id: number;
}

const PostPage = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [post, setPost] = useState<Post | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await axios.get(`http://localhost:5001/posts/${id}`);
                setPost(res.data);
            } catch (err) {
                console.error(err);
                setError('Failed to load post');
            } finally {
                setIsLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            alert('Delete functionality coming soon!');
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="min-h-screen bg-white flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center px-4">
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Post not found</h2>
                    <p className="text-slate-600 mb-6">{error || "The post you're looking for doesn't exist."}</p>
                    <Link to="/" className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2">
                        <ArrowLeft size={20} />
                        Back to feed
                    </Link>
                </div>
            </div>
        );
    }

    // Parse tags if string
    const tags = typeof post.tags === 'string' ? JSON.parse(post.tags) : post.tags;

    // Check if logged in user is author (used for conditional rendering of actions)
    const isAuthor = user?.id === post.author_id;

    // Mock formatted date
    const formattedDate = new Date(post.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <Link to="/" className="inline-flex items-center text-slate-500 hover:text-slate-900 transition-colors mb-8">
                    <ArrowLeft size={18} className="mr-2" />
                    Back to feed
                </Link>

                <article>
                    {/* Categories/Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {tags?.map((tag: string, index: number) => (
                            <span key={index} className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600">
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
                        {post.title}
                    </h1>

                    {/* Author & Meta */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-8 mb-8">
                        <div className="flex items-center gap-3">
                            <img
                                src={post.author_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author_name)}&background=random`}
                                alt={post.author_name}
                                className="w-12 h-12 rounded-full ring-2 ring-white"
                            />
                            <div>
                                <h3 className="text-sm font-bold text-slate-900">{post.author_name}</h3>
                                <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                                    <span className="flex items-center gap-1">
                                        <Calendar size={14} />
                                        {formattedDate}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Actions (Only visible if isAuthor, temporarily showing for demo) */}
                        {/* {isAuthor && ( */}
                        <div className="flex items-center gap-2">
                            <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-primary-600 rounded-lg transition-colors border border-slate-200">
                                <Edit size={16} />
                                Edit
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors border border-slate-200"
                            >
                                <Trash2 size={16} />
                                Delete
                            </button>
                        </div>
                        {/* )} */}
                    </div>

                    {/* Content */}
                    <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-700 prose-p:leading-relaxed prose-a:text-primary-600 hover:prose-a:text-primary-700">
                        <div className="whitespace-pre-wrap">
                            {post.content}
                        </div>

                        {/* Static Code Block Example for Visual Fidelity */}
                        <div className="my-8 bg-slate-900 rounded-xl p-6 text-slate-50 overflow-x-auto shadow-lg">
                            <pre className="font-mono text-sm leading-relaxed">
                                <code>{`interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}`}</code>
                            </pre>
                        </div>
                    </div>
                </article>
            </main>
        </div>
    );
};

export default PostPage;
