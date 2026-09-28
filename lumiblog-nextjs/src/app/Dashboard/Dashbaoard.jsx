'use client';
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import Toast from '@/components/Toast';
import BlogForm from '@/components/BlogForm';
import SubForm from '@/components/SubForm';
import BlogTable from '@/components/BlogTable';
import SubTable from '@/components/SubTable';
import BlogEditModal from '@/components/BlogEditModal';
import SubEditModal from '@/components/SubEditModal';
import LogoutModal from '@/components/LogoutModal';

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState('blogForm');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Mock State Data
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
    {
      id: 2,
      title: 'The Future of Web Development',
      slug: 'future-web-dev',
      category: 'education',
      tags: 'web, future',
      excerpt: 'What lies ahead for web dev.',
      content: 'Web development is evolving rapidly...',
      status: 'draft',
      date: 'Oct 10, 2023',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=60&q=80',
    },
    {
      id: 3,
      title: '10 Tips for Better UI Design',
      slug: 'ui-design-tips',
      category: 'lifestyle',
      tags: 'ui, design',
      excerpt: 'Improve your UI skills.',
      content: 'Good UI design is crucial...',
      status: 'published',
      date: 'Oct 08, 2023',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=60&q=80',
    },
  ]);

  const [subs, setSubs] = useState([
    {
      id: 1,
      user_id: 101,
      plan_key: 'premium_monthly',
      plan_name: 'Premium Access',
      amount: 999,
      status: 'paid',
      date: 'Oct 01, 2023',
      avatar: 'https://i.pravatar.cc/150?img=12',
    },
    {
      id: 2,
      user_id: 102,
      plan_key: 'basic_monthly',
      plan_name: 'Basic Plan',
      amount: 499,
      status: 'created',
      date: 'Oct 05, 2023',
      avatar: 'https://i.pravatar.cc/150?img=33',
    },
    {
      id: 3,
      user_id: 103,
      plan_key: 'pro_yearly',
      plan_name: 'Pro Yearly',
      amount: 7999,
      status: 'failed',
      date: 'Oct 03, 2023',
      avatar: 'https://i.pravatar.cc/150?img=68',
    },
  ]);

  // Modal State
  const [editingBlog, setEditingBlog] = useState(null);
  const [editingSub, setEditingSub] = useState(null);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  // Helper Toast function
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Handlers
  const handleAddBlog = (newBlog) => {
    setBlogs((prev) => [{ id: Date.now(), ...newBlog }, ...prev]);
  };

  const handleUpdateBlog = (updatedBlog) => {
    setBlogs((prev) => prev.map((b) => (b.id === updatedBlog.id ? updatedBlog : b)));
  };

  const handleDeleteBlog = (id) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      setBlogs((prev) => prev.filter((b) => b.id !== id));
      addToast('Item deleted successfully!', 'warning');
    }
  };

  const handleAddSub = (newSub) => {
    setSubs((prev) => [{ id: Date.now(), ...newSub }, ...prev]);
  };

  const handleUpdateSub = (updatedSub) => {
    setSubs((prev) => prev.map((s) => (s.id === updatedSub.id ? updatedSub : s)));
  };

  const handleDeleteSub = (id) => {
    if (confirm('Are you sure you want to delete this subscription?')) {
      setSubs((prev) => prev.filter((s) => s.id !== id));
      addToast('Item deleted successfully!', 'warning');
    }
  };

  return (
    <div className="flex w-full h-full">
      <Toast toasts={toasts} setToasts={setToasts} />

      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        mobileSidebarOpen={mobileSidebarOpen}
        setMobileSidebarOpen={setMobileSidebarOpen}
        blogsCount={blogs.length}
        subsCount={subs.length}
      />

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <Header
          mobileSidebarOpen={mobileSidebarOpen}
          setMobileSidebarOpen={setMobileSidebarOpen}
          onLogoutClick={() => setIsLogoutOpen(true)}
        />

        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50 relative">
          {activeSection === 'blogForm' && (
            <BlogForm onAddBlog={handleAddBlog} addToast={addToast} />
          )}

          {activeSection === 'subForm' && (
            <SubForm onAddSub={handleAddSub} addToast={addToast} />
          )}

          {activeSection === 'blogTable' && (
            <BlogTable
              blogs={blogs}
              onDelete={handleDeleteBlog}
              onEdit={(blog) => setEditingBlog(blog)}
              onSwitchToAdd={() => setActiveSection('blogForm')}
            />
          )}

          {activeSection === 'subTable' && (
            <SubTable
              subs={subs}
              onDelete={handleDeleteSub}
              onEdit={(sub) => setEditingSub(sub)}
              onSwitchToAdd={() => setActiveSection('subForm')}
            />
          )}
        </div>
      </main>

      {/* Edit & Logout Modals */}
      <BlogEditModal
        isOpen={!!editingBlog}
        blogData={editingBlog}
        onClose={() => setEditingBlog(null)}
        onUpdate={handleUpdateBlog}
        addToast={addToast}
      />

      <SubEditModal
        isOpen={!!editingSub}
        subData={editingSub}
        onClose={() => setEditingSub(null)}
        onUpdate={handleUpdateSub}
        addToast={addToast}
      />

      <LogoutModal
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        addToast={addToast}
      />
    </div>
  );
}