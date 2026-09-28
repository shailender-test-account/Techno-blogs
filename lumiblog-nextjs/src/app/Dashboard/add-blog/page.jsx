'use client';

import BlogForm from "../BlogForm";



export default function AddBlogPage() {
  const handleAddBlog = (data) => {
    console.log('Blog added:', data);
  };

  const addToast = (msg, type) => {
    console.log(msg, type);
  };

  return <BlogForm onAddBlog={handleAddBlog} addToast={addToast} />;
}