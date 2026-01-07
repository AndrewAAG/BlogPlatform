import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Save, Eye, PenTool, Edit2, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { useAuth } from '../context/AuthContext';

const CreateEditPostPage = () => {
    const { id } = useParams(); // If ID exists, we are in Edit mode
    const navigate = useNavigate();
    const { user } = useAuth();
    const isEditMode = !!id;

    const [title, setTitle] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [content, setContent] = useState('');
    const [categories, setCategories] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    const [isLoading, setIsLoading] = useState(isEditMode);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user && !isLoading) {
            // Basic auth check redundant if route is protected, but good for safety
            navigate('/login');
        }
    }, [user, navigate, isLoading]);

    useEffect(() => {
        if (isEditMode) {
            const fetchPost = async () => {
                try {
                    const res = await axios.get(`http://localhost:5001/posts/${id}`);
                    const post = res.data;
                    setTitle(post.title);
                    setExcerpt(post.excerpt || '');
                    setContent(post.content);

                    // Handle tags parsing
                    let tagsArray: string[] = [];
                    if (Array.isArray(post.tags)) {
                        tagsArray = post.tags;
                    } else if (typeof post.tags === 'string') {
                        try {
                            const parsed = JSON.parse(post.tags);
                            if (Array.isArray(parsed)) tagsArray = parsed;
                        } catch (e) {
                            tagsArray = [post.tags];
                        }
                    }
                    setCategories(tagsArray);
                } catch (err) {
                    console.error('Failed to load post', err);
                    setError('Failed to load post data');
                } finally {
                    setIsLoading(false);
                }
            };
            fetchPost();
        }
    }, [isEditMode, id]);

    const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const newTag = tagInput.trim();
            if (newTag && !categories.includes(newTag)) {
                setCategories([...categories, newTag]);
                setTagInput('');
            }
        }
    };

    const removeTag = (tagToRemove: string) => {
        setCategories(categories.filter(tag => tag !== tagToRemove));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError('');

        if (!title.trim() || !content.trim() || !excerpt.trim()) {
            setError('Title, Excerpt, and Content are required.');
            setIsSaving(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        if (categories.length === 0) {
            setError('At least one category is required.');
            setIsSaving(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const headers = { 'x-auth-token': token };
            const payload = { title, excerpt, content, tags: categories };

            if (isEditMode) {
                await axios.put(`http://localhost:5001/posts/${id}`, payload, { headers });
                navigate(`/post/${id}`);
            } else {
                const res = await axios.post('http://localhost:5001/posts', payload, { headers });
                navigate(`/post/${res.data.id}`);
            }
        } catch (err: any) {
            console.error('Error saving post:', err);
            setError(err.response?.data?.message || 'Failed to save post');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setIsSaving(false);
        }
    };

    // Prevent default form submission on Enter for other fields
    const preventSubmitOnEnter = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') e.preventDefault();
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />

            <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">
                            {isEditMode ? 'Edit Post' : 'Write a New Post'}
                        </h1>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg border border-red-100 flex items-center gap-2">
                        <span className="font-bold">Error:</span> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    {/* Meta Data Section */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Post Title <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                onKeyDown={preventSubmitOnEnter}
                                placeholder="Enter your post title..."
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all font-bold text-lg text-slate-900 placeholder-slate-400"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Excerpt <span className="text-red-500">*</span></label>
                            <textarea
                                value={excerpt}
                                onChange={e => setExcerpt(e.target.value)}
                                placeholder="Write a brief summary of your post (1-2 sentences)..."
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm leading-relaxed h-20 resize-none"
                            />
                            <div className="text-right text-xs text-slate-400 mt-1">{excerpt.length}/200 characters</div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Categories</label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {categories.map((tag, index) => (
                                    <span key={index} className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-indigo-50 text-indigo-700">
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => removeTag(tag)}
                                            className="hover:text-indigo-900 transition-colors"
                                        >
                                            <X size={14} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <input
                                type="text"
                                value={tagInput}
                                onChange={e => setTagInput(e.target.value)}
                                onKeyDown={handleTagKeyDown}
                                placeholder="Type a category and press Enter..."
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                            />
                        </div>
                    </div>

                    {/* Split Pane Editor */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:h-[600px]">
                        {/* Editor Input */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden min-h-[400px] lg:min-h-0">
                            <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex items-center justify-between">
                                <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                    <PenTool size={16} /> Content <span className="text-red-500">*</span>
                                </span>
                                <span className="text-xs text-slate-500 flex items-center gap-1">
                                    <Edit2 size={12} className="inline" /> Markdown
                                </span>
                            </div>
                            <textarea
                                value={content}
                                onChange={e => setContent(e.target.value)}
                                placeholder="# Your Title Here   Write your post in Markdown...   ## Subheading"
                                className="flex-1 w-full p-4 focus:outline-none resize-none font-mono text-sm leading-relaxed text-slate-800"
                            />
                        </div>

                        {/* Preview */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden min-h-[400px] lg:min-h-0">
                            <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex items-center justify-between">
                                <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                    Preview
                                </span>
                                <span className="text-xs text-slate-500 flex items-center gap-1">
                                    <Eye size={14} className="inline" /> Live
                                </span>
                            </div>
                            <div className="flex-1 p-6 overflow-y-auto">
                                {content ? (
                                    <MarkdownRenderer content={content} />
                                ) : (
                                    <div className="h-full flex items-center justify-center text-slate-400 italic">
                                        Start writing to see the preview...
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 pb-12">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="px-8 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-200 flex items-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            <Save size={18} />
                            {isSaving ? 'Publishing...' : (isEditMode ? 'Update Post' : 'Publish Post')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateEditPostPage;
