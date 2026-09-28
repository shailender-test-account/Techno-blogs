'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BlogTable from '../BlogTable';
import BlogEditModal from '../BlogEditModal';
// import BlogTable from '../BlogTable';
// import BlogEditModal from '../BlogEditModal';

export default function BlogsPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState([
    {
      id: 1,
      title: 'Getting Started with Tailwind CSS',
      slug: 'tailwind-css-guide',
      category: 'technology',
      tags: 'css, tailwind, web',
      excerpt: 'A beginner guide to Tailwind.',
      content: 'Tailwind is a utility-first CSS framework...',
      status: 'published',
      date: 'Oct 12, 2023',
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=60&q=80',
    },
  ]);

  const [editingBlog, setEditingBlog] = useState(null);

  const handleDelete = (id) => {
    setBlogs((prev) => prev.filter((b) => b.id !== id));
  };

  const handleUpdate = (updatedBlog) => {
    setBlogs((prev) => prev.map((b) => (b.id === updatedBlog.id ? updatedBlog : b)));
  };

  return (
    <>
      <BlogTable
        blogs={blogs}
        onDelete={handleDelete}
        onEdit={(blog) => setEditingBlog(blog)}
        onSwitchToAdd={() => router.push('/dashboard/add-blog')}
      />

      <BlogEditModal
        isOpen={!!editingBlog}
        blogData={editingBlog}
        onClose={() => setEditingBlog(null)}
        onUpdate={handleUpdate}
        addToast={(msg) => console.log(msg)}
      />
    </>
  );
}