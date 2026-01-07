import { useState, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare, CornerDownRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

interface Comment {
    id: number;
    content: string;
    author_name: string;
    author_avatar: string;
    created_at: string;
    parent_id: number | null;
    user_id: number;
    replies?: Comment[];
}

interface CommentSectionProps {
    postId: string;
}

const CommentSection = ({ postId }: CommentSectionProps) => {
    const { user, isAuthenticated } = useAuth();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [replyingTo, setReplyingTo] = useState<number | null>(null);
    const [replyContent, setReplyContent] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const fetchComments = async () => {
        try {
            const res = await axios.get(`http://localhost:5001/posts/${postId}/comments`);
            setComments(res.data);
        } catch (err) {
            console.error('Error fetching comments:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const handlePostComment = async () => {
        if (!newComment.trim()) return;

        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `http://localhost:5001/posts/${postId}/comments`,
                { content: newComment },
                { headers: { 'x-auth-token': token } }
            );
            setNewComment('');
            fetchComments();
        } catch (err) {
            console.error('Error posting comment:', err);
            alert('Failed to post comment. Please login again.');
        }
    };

    const handlePostReply = async (parentId: number) => {
        if (!replyContent.trim()) return;

        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `http://localhost:5001/posts/${postId}/comments`,
                { content: replyContent, parent_id: parentId },
                { headers: { 'x-auth-token': token } }
            );
            setReplyContent('');
            setReplyingTo(null);
            fetchComments();
        } catch (err) {
            console.error('Error posting reply:', err);
            alert('Failed to post reply');
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    // Recursive function to render comments
    const renderComments = (commentsList: Comment[], isReply = false) => {
        return commentsList.map(comment => (
            <div key={comment.id} className={`mt-6 ${isReply ? 'ml-8 pl-4 border-l-2 border-slate-100' : ''}`}>
                <div className="flex gap-3">
                    <img
                        src={comment.author_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.author_name)}&background=random`}
                        alt={comment.author_name}
                        className="w-10 h-10 rounded-full bg-slate-100 object-cover"
                    />
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-slate-900 text-sm">{comment.author_name}</span>
                            <span className="text-xs text-slate-500">{formatDate(comment.created_at)}</span>
                        </div>
                        <p className="text-slate-700 text-sm leading-relaxed mb-2">{comment.content}</p>

                        {isAuthenticated && (
                            <button
                                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                                className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-primary-600 transition-colors"
                            >
                                <CornerDownRight size={14} />
                                Reply
                            </button>
                        )}

                        {replyingTo === comment.id && (
                            <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-200">
                                <textarea
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    placeholder="Write a reply..."
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 resize-none h-24 mb-2"
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handlePostReply(comment.id)}
                                        className="px-4 py-1.5 bg-primary-500 text-white text-xs font-medium rounded-lg hover:bg-primary-600 transition-colors"
                                    >
                                        Post Reply
                                    </button>
                                    <button
                                        onClick={() => setReplyingTo(null)}
                                        className="px-4 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Recursively render child comments */}
                        {comment.replies && comment.replies.length > 0 && renderComments(comment.replies, true)}
                    </div>
                </div>
            </div>
        ));
    };

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-slate-100 mt-10">
            <div className="flex items-center gap-2 mb-8">
                <MessageSquare className="text-slate-900" size={20} />
                <h2 className="text-xl font-bold text-slate-900">Comments ({comments.length})</h2>
            </div>

            {/* Main Input */}
            {isAuthenticated ? (
                <div className="mb-10">
                    <div className="border border-primary-100 rounded-xl p-1 bg-white shadow-sm ring-1 ring-primary-50 focus-within:ring-2 focus-within:ring-primary-500 transition-all">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Share your thoughts..."
                            className="w-full p-4 text-slate-700 placeholder-slate-400 focus:outline-none bg-transparent resize-none h-32 rounded-lg"
                        />
                        <div className="flex justify-start px-4 pb-3">
                            <button
                                onClick={handlePostComment}
                                className="px-5 py-2 bg-primary-500 text-white font-medium text-sm rounded-lg hover:bg-primary-600 transition-colors shadow-sm hover:shadow-md active:scale-95 transform duration-100"
                            >
                                Post Comment
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="mb-10 p-6 bg-slate-50 rounded-xl text-center border border-slate-100">
                    <p className="text-slate-600 mb-2">Please login to join the discussion.</p>
                    <Link to="/login" className="text-primary-600 font-bold hover:underline">Login here</Link>
                </div>
            )}

            {/* Comment List */}
            {isLoading ? (
                <div className="text-center py-10 text-slate-400">Loading comments...</div>
            ) : comments.length > 0 ? (
                <div className="space-y-2">
                    {renderComments(comments)}
                </div>
            ) : (
                <div className="text-center py-10 text-slate-400 italic">
                    No comments yet. Be the first to share your thoughts!
                </div>
            )}
        </div>
    );
};

export default CommentSection;
