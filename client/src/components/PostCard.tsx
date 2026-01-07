import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react'; // If arrow icon is needed, or just use text

interface PostCardProps {
    post: {
        id: number;
        title: string;
        excerpt: string;
        author: {
            name: string;
            avatar: string;
        };
        tags?: string[];
        date: string;
    };
}

const PostCard = ({ post }: PostCardProps) => {
    return (
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
                <img
                    src={post.author.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author.name)}&background=random`}
                    alt={post.author.name}
                    className="w-10 h-10 rounded-full"
                />
                <div>
                    <h3 className="text-sm font-semibold text-slate-900">{post.author.name}</h3>
                    <p className="text-xs text-slate-500">
                        {post.date}
                    </p>
                </div>
            </div>

            <Link to={`/post/${post.id}`} className="block group">
                <h2 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {post.title}
                </h2>
                <p className="text-slate-600 mb-4 line-clamp-3">
                    {post.excerpt}
                </p>
            </Link>

            <div className="flex flex-wrap items-center gap-2 mb-4">
                {post.tags?.map((tag, index) => (
                    <span key={index} className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600">
                        {tag}
                    </span>
                ))}
            </div>

            <Link
                to={`/post/${post.id}`}
                className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700"
            >
                Read more <ArrowRight size={16} className="ml-1" />
            </Link>
        </div>
    );
};

export default PostCard;
