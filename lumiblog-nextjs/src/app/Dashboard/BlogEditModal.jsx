'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import api from '@/axios';

export default function BlogEditModal({ isOpen, onClose, blogData, onUpdate, addToast }) {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    tags: '',
    excerpt: '',
    content: '',
    status: 'draft',
  });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (blogData) {
      setFormData({
        title: blogData.title || '',
        category: blogData.category || 'technology',
        tags: blogData.tags || '',
        excerpt: blogData.excerpt || '',
        content: blogData.content || '',
        status: blogData.status || 'draft',
      });
    }
  }, [blogData]);

  if (!isOpen || !blogData) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      addToast('Please fill in required fields', 'error');
      return;
    }

    setIsUpdating(true);
    try {
      const token = localStorage.getItem('token'); // adjust if you store token elsewhere

      const response = await api.put(
        `/api/blog/editblog/${blogData.id || blogData._id}`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      if (response.data.success) {
        addToast('Blog updated successfully!', 'success');
        onUpdate(response.data.blog);
        onClose();
      } else {
        addToast(response.data.message || 'Failed to update blog', 'error');
      }
    } catch (error) {
      console.error('Update blog error:', error);
      const message =
        error.response?.data?.message || 'Something went wrong. Please try again.';
      addToast(message, 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 p-6 md:p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <i className="fa-regular fa-pen-to-square text-indigo-600"></i> Edit Blog Post
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className="form-label">Blog Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="form-input"
              required
            />
          </div>
          <div>
            <label className="form-label">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="form-input appearance-none"
              required
            >
              <option value="technology">Technology</option>
              <option value="education">Education</option>
              <option value="lifestyle">Lifestyle</option>
              <option value="business">Business</option>
            </select>
          </div>
          <div>
            <label className="form-label">Tags</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="form-input"
            />
          </div>
          <div className="md:col-span-2">
            <label className="form-label">Excerpt</label>
            <textarea
              rows="2"
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="form-input resize-none"
            ></textarea>
          </div>
          <div className="md:col-span-2">
            <label className="form-label">Content</label>
            <textarea
              rows="4"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="form-input resize-none"
              required
            ></textarea>
          </div>
          <div>
            <label className="form-label">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="form-input appearance-none"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div className="md:col-span-2 mt-4 flex gap-4">
            <button
              type="submit"
              disabled={isUpdating}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isUpdating ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-check"></i>}
              {isUpdating ? 'Updating...' : 'Update Blog'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}