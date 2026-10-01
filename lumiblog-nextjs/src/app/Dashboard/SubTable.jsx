// 'use client';

// import Link from "next/link";

// export default function SubTable({ subs, onDelete, onEdit, onSwitchToAdd }) {
//   const getStatusBadge = (status) => {
//     switch (status) {
//       case 'paid':
//         return (
//           <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded-full text-[10px] font-medium flex items-center w-fit gap-1">
//             <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Paid
//           </span>
//         );
//       case 'created':
//         return (
//           <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full text-[10px] font-medium flex items-center w-fit gap-1">
//             <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span> Created
//           </span>
//         );
//       case 'failed':
//         return (
//           <span className="bg-red-50 text-red-700 px-2 py-0.5 rounded-full text-[10px] font-medium flex items-center w-fit gap-1">
//             <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span> Failed
//           </span>
//         );
//       default:
//         return (
//           <span className="bg-gray-50 text-gray-700 px-2 py-0.5 rounded-full text-[10px] font-medium flex items-center w-fit gap-1">
//             <span className="w-1.5 h-1.5 bg-gray-500 rounded-full"></span> {status}
//           </span>
//         );
//     }
//   };

//   return (
//     <div className="animate-fade-in-up">
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-800">Subscription List</h2>
//           <p className="text-sm text-gray-500 mt-1">Manage all user subscriptions and payments.</p>
//         </div>
//         <Link
//           href={"/Dashboard/add-subscription"}
//           className="mt-4 md:mt-0 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-md hover:shadow-lg flex items-center gap-2"
//         >
//           <i className="fa-solid fa-plus"></i> Add Subscription
//         </Link>
//       </div>

//       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full text-left border-collapse">
//             <thead>
//               <tr className="bg-gray-50/80 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
//                 <th className="px-4 py-3 w-16">#</th>
//                 <th className="px-4 py-3">User ID</th>
//                 <th className="px-4 py-3">Plan Name</th>
//                 <th className="px-4 py-3">Amount</th>
//                 <th className="px-4 py-3">Status</th>
//                 <th className="px-4 py-3">Start Date</th>
//                 <th className="px-4 py-3 text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100 text-sm">
//               {subs.length === 0 ? (
//                 <tr>
//                   <td colSpan="7" className="px-6 py-8 text-center text-gray-400">
//                     No records found
//                   </td>
//                 </tr>
//               ) : (
//                 subs.map((sub) => (
//                   <tr key={sub.id} className="table-row-hover">
//                     <td className="px-4 py-3">
//                       <img
//                         src={sub.avatar || 'https://i.pravatar.cc/150?img=12'}
//                         alt="User"
//                         className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm"
//                       />
//                     </td>
//                     <td className="px-4 py-3 text-gray-600 font-medium">User #{sub.user_id}</td>
//                     <td className="px-4 py-3">
//                       <div className="flex flex-col">
//                         <span className="font-medium text-gray-800">{sub.plan_name}</span>
//                         <span className="text-xs text-gray-400">{sub.plan_key}</span>
//                       </div>
//                     </td>
//                     <td className="px-4 py-3 font-medium text-gray-800">
//                       ₹ {Number(sub.amount).toFixed(2)}
//                     </td>
//                     <td className="px-4 py-3">{getStatusBadge(sub.status)}</td>
//                     <td className="px-4 py-3 text-gray-500 text-xs">{sub.date}</td>
//                     <td className="px-4 py-3">
//                       <div className="flex items-center justify-end gap-2">
//                         <button className="action-btn w-7 h-7 rounded-lg bg-gray-50 text-gray-500 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-center">
//                           <i className="fa-regular fa-eye text-[10px]"></i>
//                         </button>
//                         <button
//                           onClick={() => onEdit(sub)}
//                           className="action-btn w-7 h-7 rounded-lg bg-gray-50 text-gray-500 hover:bg-amber-50 hover:text-amber-600 flex items-center justify-center"
//                         >
//                           <i className="fa-regular fa-pen-to-square text-[10px]"></i>
//                         </button>
//                         <button
//                           onClick={() => onDelete(sub.id)}
//                           className="action-btn w-7 h-7 rounded-lg bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-600 flex items-center justify-center"
//                         >
//                           <i className="fa-regular fa-trash-can text-[10px]"></i>
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//         <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
//           <span>Showing 1 to {subs.length} of {subs.length} entries</span>
//           <div className="flex gap-1">
//             <button className="px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50" disabled>
//               Prev
//             </button>
//             <button className="px-3 py-1 rounded-lg bg-indigo-600 text-white">1</button>
//             <button className="px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-50">Next</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




'use client';
import { useState, useEffect } from 'react';
import api from '@/axios';
import {
  Plus,
  Eye,
  SquarePen,
  Trash2,
  RefreshCw,
  Loader2,
  AlertTriangle,
  Tag,
  Calendar,
  Circle,
  Heading,
  AlignLeft,
  Save,
  Info,
  IndianRupee,
  User,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  BadgeCheck,
  FileText,
} from 'lucide-react';
import Link from 'next/link';

export default function SubTable({ subs, onDelete, onEdit, onSwitchToAdd, addToast, refreshKey }) {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, sub: null });
  const [viewModal, setViewModal] = useState({ open: false, sub: null });
  const [editModal, setEditModal] = useState({ open: false, sub: null });
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({
    plan_name: '',
    plan_key: '',
    amount: '',
    status: '',
    date: '',
  });

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

  const formatCurrency = (amount) => {
    const num = Number(amount);
    if (isNaN(num)) return '₹ 0.00';
    return `₹ ${num.toFixed(2)}`;
  };

  const makePlanKey = (name = '') =>
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 40) || 'plan-key';

  // ---------- FETCH SUBSCRIPTIONS ----------
  const fetchSubscriptions = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/api/plan/allplans');

      // Handle different response shapes
      const list =
        data?.plans ||
        data?.subscriptions ||
        data?.data ||
        (Array.isArray(data) ? data : []);

      if (!data?.success && !Array.isArray(list)) {
        throw new Error(data?.message || 'Failed to load subscriptions');
      }

      setSubscriptions(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('Error fetching subscriptions:', err);
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Failed to load subscriptions. Please try again.';
      setError(msg);
      if (addToast) addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  // ---------- STATUS BADGE ----------
  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-[11px] font-semibold">
            <span className="w-[7px] h-[7px] rounded-full bg-emerald-500" />
            Paid
          </span>
        );
      case 'created':
        return (
          <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-[11px] font-semibold">
            <span className="w-[7px] h-[7px] rounded-full bg-amber-500 animate-dot-blink" />
            Created
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 px-3 py-1 rounded-full text-[11px] font-semibold">
            <span className="w-[7px] h-[7px] rounded-full bg-red-500" />
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 bg-slate-50 text-slate-700 px-3 py-1 rounded-full text-[11px] font-semibold capitalize">
            <span className="w-[7px] h-[7px] rounded-full bg-slate-400" />
            {status || 'unknown'}
          </span>
        );
    }
  };

  // ---------- OPEN MODALS ----------
  const openViewModal = (sub) => setViewModal({ open: true, sub });
  const openEditModal = (sub) => {
    setEditForm({
      plan_name: sub.plan_name || '',
      plan_key: sub.plan_key || '',
      amount: sub.amount || '',
      status: sub.status || 'created',
      date: sub.date || '',
    });
    setEditModal({ open: true, sub });
  };
  const openDeleteModal = (sub) => setDeleteModal({ open: true, sub });

  const closeViewModal = () => setViewModal({ open: false, sub: null });
  const closeEditModal = () => {
    if (saving) return;
    setEditModal({ open: false, sub: null });
  };
  const closeDeleteModal = () => {
    if (deleting) return;
    setDeleteModal({ open: false, sub: null });
  };

  // ---------- CONFIRM DELETE ----------
  const confirmDelete = async () => {
    const sub = deleteModal.sub;
    if (!sub) return;

    setDeleting(true);
    try {
      const token = getToken();

      // If parent provides onDelete, use it (handles API)
      if (onDelete) {
        await onDelete(sub.id);
        setSubscriptions((prev) => prev.filter((s) => s.id !== sub.id));
        if (addToast) addToast('Subscription deleted successfully', 'success');
        setDeleteModal({ open: false, sub: null });
        return;
      }

      // Fallback: try direct API call
      const { data } = await api.delete(`/api/plan/deleteplan/${sub.id}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (data && !data.success) {
        throw new Error(data?.message || 'Failed to delete subscription');
      }

      if (addToast) addToast(data?.message || 'Subscription deleted successfully', 'success');
      setSubscriptions((prev) => prev.filter((s) => s.id !== sub.id));
      setDeleteModal({ open: false, sub: null });
    } catch (err) {
      console.error('Error deleting subscription:', err);
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Failed to delete subscription. Please try again.';
      if (addToast) addToast(msg, 'error');
    } finally {
      setDeleting(false);
    }
  };

  // ---------- SAVE EDIT ----------
  const confirmEdit = async () => {
    const sub = editModal.sub;
    if (!sub) return;

    setSaving(true);
    try {
      const token = getToken();
      const payload = {
        plan_name: editForm.plan_name,
        plan_key: editForm.plan_key,
        amount: Number(editForm.amount),
        status: editForm.status,
        date: editForm.date,
      };

      // If parent provides onEdit, use it (handles API)
      if (onEdit) {
        await onEdit({ id: sub.id, ...payload });
        setSubscriptions((prev) =>
          prev.map((s) => (s.id === sub.id ? { ...s, ...payload } : s))
        );
        if (addToast) addToast('Subscription updated successfully', 'success');
        setEditModal({ open: false, sub: null });
        return;
      }

      // Fallback: try direct API call
      const { data } = await api.put(`/api/plan/editplan/${sub.id}`, payload, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (data && !data.success) {
        throw new Error(data?.message || 'Failed to update subscription');
      }

      if (addToast) addToast(data?.message || 'Subscription updated successfully', 'success');

      setSubscriptions((prev) =>
        prev.map((s) => (s.id === sub.id ? { ...s, ...payload } : s))
      );
      setEditModal({ open: false, sub: null });
    } catch (err) {
      console.error('Error updating subscription:', err);
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Failed to update subscription. Please try again.';
      if (addToast) addToast(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-fade-in-up">
      {/* ---------- HEADER ---------- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-7">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <span className="bg-purple-50 text-purple-600 p-2.5 rounded-2xl">
              <CreditCard size={24} />
            </span>
            Subscription List
          </h2>
          <p className="text-sm text-slate-500 mt-1.5">
            Manage all user subscriptions, plans & payment status.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-2.5">
          <button
            onClick={fetchSubscriptions}
            disabled={loading}
            className="border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            title="Refresh"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <Link
            href="/Dashboard/add-subscription"
            className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all shadow-lg shadow-slate-900/20 hover:shadow-slate-900/30 hover:-translate-y-0.5 flex items-center gap-2"
          >
            <Plus size={16} /> Add Subscription
          </Link>
        </div>
      </div>

      {/* ---------- TABLE ---------- */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[950px] whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                <th className="px-6 py-4 w-16">#</th>
                <th className="px-4 py-4">User</th>
                <th className="px-4 py-4">Plan Name</th>
                <th className="px-4 py-4">Amount</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Start Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 size={18} className="animate-spin" />
                      <span>Loading subscriptions...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <p className="text-red-500 mb-3">{error}</p>
                    <button
                      onClick={fetchSubscriptions}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Try again
                    </button>
                  </td>
                </tr>
              ) : subscriptions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    No records found
                  </td>
                </tr>
              ) : (
                subscriptions.map((sub, index) => (
                  <tr
                    key={sub.id ?? index}
                    className="group relative bg-white transition-all duration-300 ease-out hover:bg-gradient-to-r hover:from-white hover:to-purple-50/30 hover:shadow-[0_12px_30px_-12px_rgba(0,0,0,0.15),0_0_0_1px_rgba(147,51,234,0.1)] hover:-translate-y-0.5 hover:scale-[1.001]"
                  >
                    {/* Left accent bar on hover */}
                    <td className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 via-indigo-500 to-blue-500 rounded-r opacity-0 group-hover:opacity-100 transition-opacity" />

                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-400">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={sub.avatar || `https://i.pravatar.cc/150?u=${sub.user_id || index}`}
                          alt="User"
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-sm transition-transform group-hover:scale-105 group-hover:border-purple-200"
                          onError={(e) => {
                            e.currentTarget.src = `https://i.pravatar.cc/150?u=${sub.user_id || index}`;
                          }}
                        />
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-800">
                            User #{sub.user_id ?? '—'}
                          </span>
                          <span className="text-[11px] text-slate-400 truncate max-w-[160px]">
                            {sub.email || sub.user_email || `ID: ${sub.user_id ?? 'N/A'}`}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-800">
                          {sub.plan_name || '—'}
                        </span>
                        <span className="text-[11px] text-slate-400 truncate">
                          {sub.plan_key || makePlanKey(sub.plan_name)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-1 font-bold text-slate-800">
                        {formatCurrency(sub.amount)}
                      </span>
                    </td>
                    <td className="px-4 py-4">{getStatusBadge(sub.status)}</td>
                    <td className="px-4 py-4 text-slate-500 text-xs font-medium">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar size={12} className="text-slate-400" />
                        {formatDate(sub.date || sub.created_at || sub.start_date)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openViewModal(sub)}
                          className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 hover:border-blue-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-200/50 transition-all flex items-center justify-center"
                          title="View"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => openEditModal(sub)}
                          className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-100 hover:border-amber-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-200/50 transition-all flex items-center justify-center"
                          title="Edit"
                        >
                          <SquarePen size={15} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(sub)}
                          className="w-9 h-9 rounded-xl bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 hover:border-red-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-red-200/50 transition-all flex items-center justify-center"
                          title="Delete"
                        >
                          <Trash2 size={15} />
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

      {/* ========== VIEW MODAL ========== */}
      {viewModal.open && viewModal.sub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-fade-in"
            onClick={closeViewModal}
          />
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full p-7 animate-modal-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Eye size={26} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">View Subscription</h3>
                <p className="text-sm text-slate-500">Preview details</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center gap-4">
              <img
                src={
                  viewModal.sub.avatar ||
                  `https://i.pravatar.cc/150?u=${viewModal.sub.user_id || 'default'}`
                }
                alt="User"
                className="w-16 h-16 rounded-2xl object-cover border border-slate-200"
                onError={(e) => {
                  e.currentTarget.src = `https://i.pravatar.cc/150?u=${viewModal.sub.user_id || 'default'}`;
                }}
              />
              <div className="flex-1">
                <div className="font-bold text-slate-800 text-base">
                  {viewModal.sub.plan_name || '—'}
                </div>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    <User size={10} /> User #{viewModal.sub.user_id ?? '—'}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Calendar size={10} />
                    {formatDate(
                      viewModal.sub.date ||
                        viewModal.sub.created_at ||
                        viewModal.sub.start_date
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-2.5">
                  <span className="inline-flex items-center gap-1 text-slate-700 font-bold text-xs">
                    <IndianRupee size={12} /> {Number(viewModal.sub.amount || 0).toFixed(2)}
                  </span>
                  {getStatusBadge(viewModal.sub.status)}
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
                    Plan Key
                  </p>
                  <p className="text-slate-700 font-medium truncate">
                    {viewModal.sub.plan_key || makePlanKey(viewModal.sub.plan_name)}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
                    Status
                  </p>
                  <p className="text-slate-700 font-medium capitalize">
                    {viewModal.sub.status || 'unknown'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={closeViewModal}
                className="px-5 py-2.5 rounded-2xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const s = viewModal.sub;
                  closeViewModal();
                  setTimeout(() => openEditModal(s), 200);
                }}
                className="px-5 py-2.5 rounded-2xl text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-md hover:-translate-y-0.5 flex items-center gap-2"
              >
                <SquarePen size={14} /> Edit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========== EDIT MODAL ========== */}
      {editModal.open && editModal.sub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-fade-in"
            onClick={closeEditModal}
          />
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-xl w-full p-7 animate-modal-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                <SquarePen size={26} className="text-amber-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">Edit Subscription</h3>
                <p className="text-sm text-slate-500">Update subscription information</p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Heading size={12} className="text-purple-500" /> Plan Name
                </label>
                <input
                  type="text"
                  value={editForm.plan_name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, plan_name: e.target.value })
                  }
                  placeholder="Plan name"
                  className="px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none text-sm text-slate-800 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <FileText size={12} className="text-purple-500" /> Plan Key
                  </label>
                  <input
                    type="text"
                    value={editForm.plan_key}
                    onChange={(e) =>
                      setEditForm({ ...editForm, plan_key: e.target.value })
                    }
                    placeholder="plan-key"
                    className="px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none text-sm text-slate-800 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <IndianRupee size={12} className="text-purple-500" /> Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editForm.amount}
                    onChange={(e) =>
                      setEditForm({ ...editForm, amount: e.target.value })
                    }
                    placeholder="0.00"
                    className="px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none text-sm text-slate-800 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Circle size={12} className="text-purple-500" /> Status
                  </label>
                  <select
                    value={editForm.status}
                    onChange={(e) =>
                      setEditForm({ ...editForm, status: e.target.value })
                    }
                    className="px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none text-sm text-slate-800 transition-all bg-white"
                  >
                    <option value="paid">Paid</option>
                    <option value="created">Created</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Calendar size={12} className="text-purple-500" /> Start Date
                  </label>
                  <input
                    type="date"
                    value={
                      editForm.date
                        ? new Date(editForm.date).toISOString().split('T')[0]
                        : ''
                    }
                    onChange={(e) =>
                      setEditForm({ ...editForm, date: e.target.value })
                    }
                    className="px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none text-sm text-slate-800 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={closeEditModal}
                disabled={saving}
                className="px-5 py-2.5 rounded-2xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmEdit}
                disabled={saving}
                className="px-5 py-2.5 rounded-2xl text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-md hover:-translate-y-0.5 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save size={14} /> Save changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========== DELETE MODAL ========== */}
      {deleteModal.open && deleteModal.sub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-fade-in"
            onClick={closeDeleteModal}
          />
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-7 animate-modal-in">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={26} className="text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-800">Delete Subscription</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Are you sure you want to delete this subscription? This action
                  cannot be undone.
                </p>
                <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                  <img
                    src={
                      deleteModal.sub.avatar ||
                      `https://i.pravatar.cc/150?u=${deleteModal.sub.user_id || 'default'}`
                    }
                    alt="User"
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                    onError={(e) => {
                      e.currentTarget.src = `https://i.pravatar.cc/150?u=${deleteModal.sub.user_id || 'default'}`;
                    }}
                  />
                  <div>
                    <p className="text-sm font-semibold text-slate-700 line-clamp-1">
                      {deleteModal.sub.plan_name || 'Untitled Plan'}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5 capitalize flex items-center gap-2">
                      <span>User #{deleteModal.sub.user_id ?? '—'}</span>
                      <span>•</span>
                      <span>{deleteModal.sub.status || 'unknown'}</span>
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-red-700 font-medium flex items-center gap-2">
                  <Info size={14} /> This will permanently remove the subscription.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={closeDeleteModal}
                disabled={deleting}
                className="px-5 py-2.5 rounded-2xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="px-5 py-2.5 rounded-2xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-all shadow-md hover:-translate-y-0.5 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={14} /> Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------- CUSTOM CSS ---------- */}
      <style jsx global>{`
        @keyframes dotBlink {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.7);
          }
          50% {
            opacity: 0.45;
            transform: scale(0.78);
            box-shadow: 0 0 0 5px rgba(245, 158, 11, 0);
          }
        }
        .animate-dot-blink {
          animation: dotBlink 1.4s ease-in-out infinite;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.25s ease-out;
        }

        @keyframes modalIn {
          from {
            opacity: 0;
            transform: scale(0.92) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-modal-in {
          animation: modalIn 0.3s cubic-bezier(0.2, 0.9, 0.3, 1.1);
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}