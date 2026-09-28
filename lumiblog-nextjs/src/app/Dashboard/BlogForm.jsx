'use client';
import api from '@/axios.js';
import { useState, useRef } from 'react';
import { useSelector } from 'react-redux';

export default function BlogForm({ onAddBlog, addToast }) {
  const user = useSelector((state) => state.auth?.currentuser);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    tags: '',
    excerpt: '',
    content: '',
    status: 'draft',
    published_at: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Validate a single field
  const validateField = (name, value, preview = imagePreview) => {
    switch (name) {
      case 'image':
        return !preview ? 'Please upload a featured image' : null;
      case 'title':
        if (!value || !value.trim()) return 'Blog title is required';
        if (value.trim().length < 3) return 'Title must be at least 3 characters';
        return null;
      case 'category':
        return !value ? 'Please select a category' : null;
      case 'content':
        if (!value || !value.trim()) return 'Content is required';
        if (value.trim().length < 10) return 'Content must be at least 10 characters';
        return null;
      default:
        return null;
    }
  };

  // Validate all fields
  const validate = () => {
    const newErrors = {};
    const imageError = validateField('image', null, imagePreview);
    if (imageError) newErrors.image = imageError;

    ['title', 'category', 'content'].forEach((field) => {
      const err = validateField(field, formData[field]);
      if (err) newErrors[field] = err;
    });

    setErrors(newErrors);
    setTouched({
      image: true,
      title: true,
      category: true,
      content: true,
    });
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // If already touched, re-validate live
    if (touched[name]) {
      const err = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: err }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const err = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: err }));
  };

  const handleImageChange = (file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      addToast('Image size must be less than 5MB', 'error');
      setErrors((prev) => ({ ...prev, image: 'Image size must be less than 5MB' }));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setImageFile(file);
      setImagePreview(e.target.result);
      setErrors((prev) => ({ ...prev, image: null }));
      setTouched((prev) => ({ ...prev, image: true }));
      addToast('Image uploaded successfully!', 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validate()) {
      addToast('Please fix the validation errors', 'error');
      return;
    }

    setIsSubmitting(true);
    setIsSuccess(false);

    try {
      const payload = new FormData();
      payload.append('title', formData.title);
      payload.append('category', formData.category);
      payload.append('tags', formData.tags);
      payload.append('excerpt', formData.excerpt);
      payload.append('content', formData.content);
      payload.append('status', formData.status);
      if (user?.id) payload.append('user_id', user.id);
      if (formData.published_at) payload.append('published_at', formData.published_at);
      if (imageFile) payload.append('image', imageFile);

      const response = await api.post('/api/blog/addblog', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // With axios, response.data is already parsed
      const data = response.data;

      if (!data.success) {
        throw new Error(data.message || 'Failed to create blog');
      }

      const blog = data.blog;

      setIsSuccess(true);
      addToast(data.message || 'Blog saved successfully!', 'success');

      if (onAddBlog && blog) {
        onAddBlog({
          ...blog,
          date: new Date(blog.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
        });
      }

      setTimeout(() => {
        handleReset();
        setIsSuccess(false);
      }, 2000);
    } catch (err) {
      console.error('Error creating blog:', err);
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Something went wrong. Please try again.';
      addToast(message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      title: '',
      category: '',
      tags: '',
      excerpt: '',
      content: '',
      status: 'draft',
      published_at: '',
    });
    setImageFile(null);
    setImagePreview(null);
    setErrors({});
    setTouched({});
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="animate-fade-in-up">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Create New Blog Post</h2>
        <p className="text-sm text-gray-500 mt-1">
          Fill in the details below to publish a new blog article.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 card-hover">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          noValidate
        >
          {/* Featured Image */}
          <div className="md:col-span-2">
            <label className={`form-label ${errors.image ? 'label-error' : ''}`}>
              Featured Image <span className="text-red-500">*</span>
            </label>
            <div
              className={`image-upload-area ${dragOver ? 'dragover' : ''} ${
                imagePreview ? 'has-image' : ''
              } ${errors.image ? 'input-error' : ''}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                if (e.dataTransfer.files?.[0]) handleImageChange(e.dataTransfer.files[0]);
              }}
            >
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  e.target.files?.[0] && handleImageChange(e.target.files[0])
                }
              />
              {!imagePreview ? (
                <div>
                  <div className="w-16 h-16 mx-auto rounded-full bg-indigo-50 flex items-center justify-center mb-3">
                    <i className="fa-solid fa-cloud-arrow-up text-2xl text-indigo-600"></i>
                  </div>
                  <p className="text-sm font-medium text-gray-700">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 5MB</p>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImagePreview(null);
                      setImageFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                      if (touched.image) {
                        setErrors((prev) => ({
                          ...prev,
                          image: 'Please upload a featured image',
                        }));
                      }
                    }}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <i className="fa-solid fa-xmark text-xs"></i>
                  </button>
                  <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-lg backdrop-blur-sm">
                    <i className="fa-solid fa-check-circle text-green-400 mr-1"></i> Image
                    Ready
                  </div>
                </div>
              )}
            </div>
            {errors.image && (
              <p className="error-message">
                <i className="fa-solid fa-circle-exclamation"></i> {errors.image}
              </p>
            )}
          </div>

          {/* Title */}
          <div className="md:col-span-2">
            <label className={`form-label ${errors.title ? 'label-error' : ''}`}>
              Blog Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="Enter blog title"
              className={`form-input ${errors.title ? 'input-error' : ''}`}
            />
            {errors.title && (
              <p className="error-message">
                <i className="fa-solid fa-circle-exclamation"></i> {errors.title}
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className={`form-label ${errors.category ? 'label-error' : ''}`}>
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`form-input appearance-none ${
                errors.category ? 'input-error' : ''
              }`}
            >
              <option value="">Select Category</option>
              <option value="Technology">Technology</option>
              <option value="Education">Education</option>
              <option value="Lifestyle">Lifestyle</option>
              <option value="Business">Business</option>
              <option value="Wellness">Wellness</option>
              <option value="Photography">Photography</option>
              <option value="Photography">Personal Growth</option>
              <option value="Photography">Travel</option>
            


            </select>
            {errors.category && (
              <p className="error-message">
                <i className="fa-solid fa-circle-exclamation"></i> {errors.category}
              </p>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="form-label">Tags</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="e.g. tech, coding, web"
              className="form-input"
            />
          </div>

          {/* Excerpt */}
          <div className="md:col-span-2">
            <label className="form-label">Excerpt</label>
            <textarea
              name="excerpt"
              rows="2"
              value={formData.excerpt}
              onChange={handleInputChange}
              placeholder="Short description for preview..."
              className="form-input resize-none"
            ></textarea>
          </div>

          {/* Content */}
          <div className="md:col-span-2">
            <label className={`form-label ${errors.content ? 'label-error' : ''}`}>
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              name="content"
              rows="5"
              value={formData.content}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="Write your blog content here..."
              className={`form-input resize-none ${errors.content ? 'input-error' : ''}`}
            ></textarea>
            {errors.content && (
              <p className="error-message">
                <i className="fa-solid fa-circle-exclamation"></i> {errors.content}
              </p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="form-label">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="form-input appearance-none"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Publish Date */}
          <div>
            <label className="form-label">Publish Date</label>
            <input
              type="datetime-local"
              name="published_at"
              value={formData.published_at}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>

          {/* Buttons */}
          <div className="md:col-span-2 mt-2 flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 text-white font-medium py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 ${
                isSuccess ? 'bg-green-600' : 'bg-indigo-600 hover:bg-indigo-700'
              } ${isSubmitting ? 'opacity-80 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i> Processing...
                </>
              ) : isSuccess ? (
                <>
                  <i className="fa-solid fa-check"></i> Success!
                </>
              ) : (
                <>
                  <i className="fa-solid fa-paper-plane"></i> Publish Blog
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={isSubmitting}
              className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}