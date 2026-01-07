import { useState } from 'react';
import Navbar from '../components/Navbar';
import PostCard from '../components/PostCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Dummy Data
const DUMMY_POSTS = [
    {
        id: 1,
        title: 'Building Scalable React Applications with TypeScript',
        excerpt: 'Learn the best practices for structuring large-scale React applications using TypeScript, including proper type definitions, component patterns, and state management strategies.',
        author: {
            name: 'Sarah Chen',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        },
        category: 'Engineering',
        tags: ['React', 'TypeScript'],
        date: 'Jan 15, 2024'
    },
    {
        id: 2,
        title: 'The Art of Writing Clean Code',
        excerpt: 'Discover the principles behind writing maintainable, readable code that your future self and teammates will thank you for.',
        author: {
            name: 'Marcus Johnson',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        },
        category: 'Engineering',
        tags: ['Best Practices'],
        date: 'Jan 12, 2024'
    },
    {
        id: 3,
        title: 'Lessons Learned from My First Year as a Developer',
        excerpt: 'A personal reflection on the challenges, victories, and unexpected lessons from transitioning into a software development career.',
        author: {
            name: 'Elena Rodriguez',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        },
        category: 'Life',
        tags: ['Career'],
        date: 'Jan 10, 2024'
    }
];

const HomePage = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 2; // Dummy total pages

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">Developer Stories</h1>
                    <p className="mt-3 text-lg text-slate-500">Insights, tutorials, and experiences from the dev community</p>
                </div>

                <div className="space-y-6">
                    {DUMMY_POSTS.map(post => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>

                {/* Pagination */}
                <div className="mt-12 flex items-center justify-center gap-2">
                    <button
                        className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:bg-white hover:text-slate-900 disabled:opacity-50"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    >
                        <ChevronLeft size={20} />
                    </button>

                    {[1, 2].map(page => (
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
            </main>
        </div>
    );
};

export default HomePage;
