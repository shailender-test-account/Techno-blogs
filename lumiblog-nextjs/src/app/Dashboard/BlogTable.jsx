'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Eye, SquarePen, Trash2, RefreshCw, Loader2, AlertTriangle } from 'lucide-react';
import api from '@/axios';


export default function BlogTable({ onAddClick, onEdit, onDelete, addToast, refreshKey }) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, blog: null });
  const [deleting, setDeleting] = useState(false);

  const getToken = () =>
    typeof window !== 'undefined'
      ? localStorage.getItem('token') || localStorage.getItem('authToken')
      : null;

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return '—';
    }
  };

  const makeSlug = (title = '') =>
    title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 40) || 'blog-post';

  const fetchBlogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      const { data } = await api.get("api/blog/allblogs", {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!data?.success) {
        throw new Error(data?.message || 'Failed to load blogs');
      }

      setBlogs(data.blogs || []);
    } catch (err) {
      console.error('Error fetching blogs:', err);
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Failed to load blogs. Please try again.';
      setError(msg);
      if (addToast) addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'published':
        return (
          <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded-full text-[10px] font-medium flex items-center w-fit gap-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Published
          </span>
        );
      case 'draft':
        return (
          <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full text-[10px] font-medium flex items-center w-fit gap-1">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span> Draft
          </span>
        );
      case 'archived':
        return (
          <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-[10px] font-medium flex items-center w-fit gap-1">
            <span className="w-1.5 h-1.5 bg-gray-500 rounded-full"></span> Archived
          </span>
        );
      default:
        return (
          <span className="bg-gray-50 text-gray-700 px-2 py-0.5 rounded-full text-[10px] font-medium">
            {status || 'unknown'}
          </span>
        );
    }
  };

  const openDeleteModal = (blog) => {
    setDeleteModal({ open: true, blog });
  };

  const closeDeleteModal = () => {
    if (deleting) return;
    setDeleteModal({ open: false, blog: null });
  };

  const confirmDelete = async () => {
    const blog = deleteModal.blog;
    if (!blog) return;

    setDeleting(true);
    try {
      const token = getToken();
      const { data } = await api.delete(`api/blog/delete/${blog.id}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!data?.success) {
        throw new Error(data?.message || 'Failed to delete blog');
      }

      if (addToast) addToast(data?.message || 'Blog deleted successfully', 'success');

      // Update local state
      setBlogs((prev) => prev.filter((b) => b.id !== blog.id));

      // Also call parent handler if provided
      if (onDelete) onDelete(blog.id);

      setDeleteModal({ open: false, blog: null });
    } catch (err) {
      console.error('Error deleting blog:', err);
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Failed to delete blog. Please try again.';
      if (addToast) addToast(msg, 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Blog Posts</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage all your blog articles here.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-2">
          <button
            onClick={fetchBlogs}
            disabled={loading}
            className="border border-gray-200 text-gray-600 hover:bg-gray-50 px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refresh"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button
            onClick={onAddClick}
            className="bg-primary hover:bg-primaryDark text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-md flex items-center gap-2"
          >
            <Plus size={16} /> Add New Post
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                <th className="px-4 py-3 w-16">#</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-400">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 size={18} className="animate-spin" />
                      <span>Loading blogs...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center">
                    <p className="text-red-500 mb-3">{error}</p>
                    <button
                      onClick={fetchBlogs}
                      className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      Try again
                    </button>
                  </td>
                </tr>
              ) : blogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                    No records found
                  </td>
                </tr>
              ) : (
                blogs.map((blog, index) => (
                  <tr key={blog.id} className="table-row-hover">
                    <td className="px-4 py-3">
                      <img
                        src={
                          blog.image ||
                          'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=60'
                        }
                        alt={blog.title}
                        className="w-10 h-10 rounded-lg object-cover border border-gray-200 shadow-sm"
                        onError={(e) => {
                          e.currentTarget.src =
                            'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=60';
                        }}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col max-w-md">
                        <span className="font-medium text-gray-800 line-clamp-1">
                          {blog.title}
                        </span>
                        <span className="text-xs text-gray-400 truncate">
                          {blog.slug || makeSlug(blog.title)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-[10px] font-medium capitalize">
                        {blog.category || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3">{getStatusBadge(blog.status)}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {formatDate(blog.published_at || blog.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="action-btn w-7 h-7 rounded-lg bg-gray-50 text-gray-500 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-center"
                          title="View"
                        >
                          <Eye size={12} />
                        </button>
                        <button
                          onClick={() => onEdit?.(blog)}
                          className="action-btn w-7 h-7 rounded-lg bg-gray-50 text-gray-500 hover:bg-amber-50 hover:text-amber-600 flex items-center justify-center"
                          title="Edit"
                        >
                          <SquarePen size={12} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(blog)}
                          className="action-btn w-7 h-7 rounded-lg bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-600 flex items-center justify-center"
                          title="Delete"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
            onClick={closeDeleteModal}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-fade-in-up">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={22} className="text-red-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800">
                  Delete Blog Post
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Are you sure you want to delete this blog post? This action
                  cannot be undone.
                </p>
                {deleteModal.blog && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-sm font-medium text-gray-700 line-clamp-1">
                      {deleteModal.blog.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5 capitalize">
                      {deleteModal.blog.category || 'Uncategorized'} •{' '}
                      {deleteModal.blog.status || 'unknown'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={closeDeleteModal}
                disabled={deleting}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition-all shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={14} />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}