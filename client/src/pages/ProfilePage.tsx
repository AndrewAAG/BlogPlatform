import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Camera, Edit2, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import PostCard from '../components/PostCard';
import EditProfileModal from '../components/EditProfileModal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { API_URL } from '../config';

const ProfilePage = () => {
    const { id } = useParams();
    const { user: currentUser, checkAuth } = useAuth();
    const navigate = useNavigate();
    const { showToast } = useToast();

    // If accessing /profile/me and we have currentUser, redirect to their valid ID url for consistency 
    // or just use it. Here we handle "me" or numeric ID.
    const profileId = id === 'me' ? currentUser?.id : id;

    const [profile, setProfile] = useState<any>(null);
    const [posts, setPosts] = useState<any[]>([]);
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [postsLoading, setPostsLoading] = useState(true);

    const isOwnProfile = currentUser && profile && currentUser.id === profile.id;

    const fetchProfile = async () => {
        if (!profileId) return;
        setIsLoadingProfile(true);
        try {
            const res = await axios.get(`${API_URL}/users/${profileId}`);
            setProfile(res.data);
        } catch (err) {
            console.error('Error fetching profile:', err);
        } finally {
            setIsLoadingProfile(false);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            showToast('Please upload an image file', 'warning');
            return;
        }

        const formData = new FormData();
        formData.append('image', file);

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`${API_URL}/users/${profileId}/photo`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'x-auth-token': token
                }
            });
            setProfile((prev: any) => ({ ...prev, profile_picture: res.data.profile_picture }));
            showToast('Profile photo updated successfully', 'success');

            // Refresh global auth state to update Navbar
            if (isOwnProfile) {
                checkAuth(); // Call async but we don't need to await it for UI responsiveness here
            }

        } catch (err) {
            console.error('Error uploading photo:', err);
            showToast('Failed to upload photo', 'error');
        }
    };

    const triggerFileInput = () => {
        const fileInput = document.getElementById('photo-upload-input') as HTMLInputElement;
        fileInput?.click();
    };

    const fetchPosts = async () => {
        if (!profileId) return;
        setPostsLoading(true);
        try {
            const res = await axios.get(`${API_URL}/posts?author_id=${profileId}&page=${currentPage}&limit=5`);
            setPosts(res.data.posts);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            console.error('Error fetching posts:', err);
        } finally {
            setPostsLoading(false);
        }
    };

    useEffect(() => {
        if (id === 'me' && !currentUser) {
            navigate('/login');
            return;
        }
        fetchProfile();
    }, [profileId, currentUser]);

    useEffect(() => {
        if (profile) {
            fetchPosts();
        }
    }, [profile, currentPage]);

    const handleUpdate = async () => {
        await fetchProfile();
        if (isOwnProfile) {
            checkAuth();
        }
    };

    if (isLoadingProfile) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-slate-50">
                <Navbar />
                <div className="max-w-7xl mx-auto py-20 text-center">
                    <h2 className="text-2xl font-bold text-slate-800">User not found</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Profile Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-10">
                    <div className="p-8 sm:p-10 flex flex-col md:flex-row items-center md:items-start gap-8">
                        {/* Avatar Section */}
                        <div className="relative group shrink-0">
                            <div className="w-32 h-32 rounded-full ring-4 ring-white shadow-lg overflow-hidden bg-slate-100">
                                <img
                                    src={profile.profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=random`}
                                    alt={profile.name}
                                    className="w-full h-full object-cover"
                                />
                                {isOwnProfile && (
                                    <button
                                        onClick={triggerFileInput}
                                        className="absolute bottom-1 right-1 p-2 bg-white rounded-full shadow-md text-slate-600 hover:text-primary-600 transition-colors border border-slate-100"
                                        title="Change Photo"
                                    >
                                        <Camera size={16} />
                                    </button>
                                )}
                            </div>
                            <input
                                type="file"
                                id="photo-upload-input"
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>

                        {/* Info Section */}
                        <div className="flex-1 text-center md:text-left space-y-4">
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900 mb-1">{profile.name}</h1>
                                <a href={`mailto:${profile.email}`} className="text-slate-500 hover:text-primary-600 transition-colors inline-flex items-center gap-1.5 text-sm font-medium">
                                    {profile.email}
                                </a>
                            </div>

                            <p className="text-slate-600 leading-relaxed max-w-2xl mx-auto md:mx-0">
                                {profile.bio || "No bio yet."}
                            </p>

                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
                                {isOwnProfile && (
                                    <>
                                        <button
                                            onClick={triggerFileInput}
                                            className="px-4 py-2 bg-slate-50 text-slate-700 font-medium text-sm rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors flex items-center gap-2"
                                        >
                                            <Camera size={16} />
                                            Upload Photo
                                        </button>
                                        <button
                                            onClick={() => setIsEditModalOpen(true)}
                                            className="px-4 py-2 bg-primary-600 text-white font-medium text-sm rounded-lg hover:bg-primary-700 transition-colors shadow-sm shadow-primary-200 flex items-center gap-2"
                                        >
                                            <Edit2 size={16} />
                                            Edit Profile
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Posts Section */}
                <div>
                    <h2 className="text-xl font-bold text-slate-900 mb-6">
                        {isOwnProfile ? "My Posts" : `${profile.name}'s Posts`}
                    </h2>

                    {postsLoading ? (
                        <div className="text-center py-20">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                        </div>
                    ) : posts.length > 0 ? (
                        <div className="space-y-6">
                            {posts.map((post: any) => (
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
                                        tags: typeof post.tags === 'string' ? JSON.parse(post.tags) : post.tags
                                    }}
                                />
                            ))}

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
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-200">
                            <p className="text-slate-500 italic">No posts yet.</p>
                        </div>
                    )}
                </div>
            </main>

            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                currentUser={profile}
                onUpdate={handleUpdate}
            />
        </div>
    );
};

export default ProfilePage;
