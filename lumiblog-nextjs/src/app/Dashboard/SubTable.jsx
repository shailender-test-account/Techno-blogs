




// 'use client';
// import { useState, useEffect } from 'react';
// import api from '@/axios';
// import {
//   Plus,
//   Eye,
//   SquarePen,
//   Trash2,
//   RefreshCw,
//   Loader2,
//   AlertTriangle,
//   Tag,
//   Calendar,
//   Circle,
//   Heading,
//   AlignLeft,
//   Save,
//   Info,
//   IndianRupee,
//   User,
//   CreditCard,
//   CheckCircle,
//   XCircle,
//   Clock,
//   BadgeCheck,
//   FileText,
// } from 'lucide-react';
// import Link from 'next/link';

// export default function SubTable({ subs, onDelete, onEdit, onSwitchToAdd, addToast, refreshKey }) {
//   const [subscriptions, setSubscriptions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [deleteModal, setDeleteModal] = useState({ open: false, sub: null });
//   const [viewModal, setViewModal] = useState({ open: false, sub: null });
//   const [editModal, setEditModal] = useState({ open: false, sub: null });
//   const [deleting, setDeleting] = useState(false);
//   const [saving, setSaving] = useState(false);

//   // Edit form state
//   const [editForm, setEditForm] = useState({
//     plan_name: '',
//     plan_key: '',
//     amount: '',
//     status: '',
//     date: '',
//   });

//   const getToken = () =>
//     typeof window !== 'undefined'
//       ? localStorage.getItem('token') || localStorage.getItem('authToken')
//       : null;

//   const formatDate = (dateStr) => {
//     if (!dateStr) return '—';
//     try {
//       return new Date(dateStr).toLocaleDateString('en-US', {
//         month: 'short',
//         day: 'numeric',
//         year: 'numeric',
//       });
//     } catch {
//       return '—';
//     }
//   };

//   const formatCurrency = (amount) => {
//     const num = Number(amount);
//     if (isNaN(num)) return '₹ 0.00';
//     return `₹ ${num.toFixed(2)}`;
//   };

//   const makePlanKey = (name = '') =>
//     name
//       .toLowerCase()
//       .trim()
//       .replace(/[^a-z0-9\s-]/g, '')
//       .replace(/\s+/g, '-')
//       .slice(0, 40) || 'plan-key';

//   // ---------- FETCH SUBSCRIPTIONS ----------
//   const fetchSubscriptions = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const { data } = await api.get('/api/plan/allplans');

//       // Handle different response shapes
//       const list =
//         data?.plans ||
//         data?.subscriptions ||
//         data?.data ||
//         (Array.isArray(data) ? data : []);

//       if (!data?.success && !Array.isArray(list)) {
//         throw new Error(data?.message || 'Failed to load subscriptions');
//       }

//       setSubscriptions(Array.isArray(list) ? list : []);
//     } catch (err) {
//       console.error('Error fetching subscriptions:', err);
//       const msg =
//         err.response?.data?.message ||
//         err.message ||
//         'Failed to load subscriptions. Please try again.';
//       setError(msg);
//       if (addToast) addToast(msg, 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSubscriptions();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [refreshKey]);

//   // ---------- STATUS BADGE ----------
//   const getStatusBadge = (status) => {
//     switch (status) {
//       case 'paid':
//         return (
//           <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-[11px] font-semibold">
//             <span className="w-[7px] h-[7px] rounded-full bg-emerald-500" />
//             Paid
//           </span>
//         );
//       case 'created':
//         return (
//           <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-[11px] font-semibold">
//             <span className="w-[7px] h-[7px] rounded-full bg-amber-500 animate-dot-blink" />
//             Created
//           </span>
//         );
//       case 'failed':
//         return (
//           <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 px-3 py-1 rounded-full text-[11px] font-semibold">
//             <span className="w-[7px] h-[7px] rounded-full bg-red-500" />
//             Failed
//           </span>
//         );
//       default:
//         return (
//           <span className="inline-flex items-center gap-1.5 bg-slate-50 text-slate-700 px-3 py-1 rounded-full text-[11px] font-semibold capitalize">
//             <span className="w-[7px] h-[7px] rounded-full bg-slate-400" />
//             {status || 'unknown'}
//           </span>
//         );
//     }
//   };

//   // ---------- OPEN MODALS ----------
//   const openViewModal = (sub) => setViewModal({ open: true, sub });
//   const openEditModal = (sub) => {
//     setEditForm({
//       plan_name: sub.plan_name || '',
//       plan_key: sub.plan_key || '',
//       amount: sub.amount || '',
//       status: sub.status || 'created',
//       date: sub.date || '',
//     });
//     setEditModal({ open: true, sub });
//   };
//   const openDeleteModal = (sub) => setDeleteModal({ open: true, sub });

//   const closeViewModal = () => setViewModal({ open: false, sub: null });
//   const closeEditModal = () => {
//     if (saving) return;
//     setEditModal({ open: false, sub: null });
//   };
//   const closeDeleteModal = () => {
//     if (deleting) return;
//     setDeleteModal({ open: false, sub: null });
//   };

//   // ---------- CONFIRM DELETE ----------
//   const confirmDelete = async () => {
//     const sub = deleteModal.sub;
//     if (!sub) return;

//     setDeleting(true);
//     try {
//       const token = getToken();

//       // If parent provides onDelete, use it (handles API)
//       if (onDelete) {
//         await onDelete(sub.id);
//         setSubscriptions((prev) => prev.filter((s) => s.id !== sub.id));
//         if (addToast) addToast('Subscription deleted successfully', 'success');
//         setDeleteModal({ open: false, sub: null });
//         return;
//       }

//       // Fallback: try direct API call
//       const { data } = await api.delete(`/api/plan/deleteplan/${sub.id}`, {
//         headers: {
//           ...(token ? { Authorization: `Bearer ${token}` } : {}),
//         },
//       });

//       if (data && !data.success) {
//         throw new Error(data?.message || 'Failed to delete subscription');
//       }

//       if (addToast) addToast(data?.message || 'Subscription deleted successfully', 'success');
//       setSubscriptions((prev) => prev.filter((s) => s.id !== sub.id));
//       setDeleteModal({ open: false, sub: null });
//     } catch (err) {
//       console.error('Error deleting subscription:', err);
//       const msg =
//         err.response?.data?.message ||
//         err.message ||
//         'Failed to delete subscription. Please try again.';
//       if (addToast) addToast(msg, 'error');
//     } finally {
//       setDeleting(false);
//     }
//   };

//   // ---------- SAVE EDIT ----------
//   const confirmEdit = async () => {
//     const sub = editModal.sub;
//     if (!sub) return;

//     setSaving(true);
//     try {
//       const token = getToken();
//       const payload = {
//         plan_name: editForm.plan_name,
//         plan_key: editForm.plan_key,
//         amount: Number(editForm.amount),
//         status: editForm.status,
//         date: editForm.date,
//       };

//       // If parent provides onEdit, use it (handles API)
//       if (onEdit) {
//         await onEdit({ id: sub.id, ...payload });
//         setSubscriptions((prev) =>
//           prev.map((s) => (s.id === sub.id ? { ...s, ...payload } : s))
//         );
//         if (addToast) addToast('Subscription updated successfully', 'success');
//         setEditModal({ open: false, sub: null });
//         return;
//       }

//       // Fallback: try direct API call
//       const { data } = await api.put(`/api/plan/editplan/${sub.id}`, payload, {
//         headers: {
//           ...(token ? { Authorization: `Bearer ${token}` } : {}),
//         },
//       });

//       if (data && !data.success) {
//         throw new Error(data?.message || 'Failed to update subscription');
//       }

//       if (addToast) addToast(data?.message || 'Subscription updated successfully', 'success');

//       setSubscriptions((prev) =>
//         prev.map((s) => (s.id === sub.id ? { ...s, ...payload } : s))
//       );
//       setEditModal({ open: false, sub: null });
//     } catch (err) {
//       console.error('Error updating subscription:', err);
//       const msg =
//         err.response?.data?.message ||
//         err.message ||
//         'Failed to update subscription. Please try again.';
//       if (addToast) addToast(msg, 'error');
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="animate-fade-in-up">
//       {/* ---------- HEADER ---------- */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-7">
//         <div>
//           <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
//             <span className="bg-purple-50 text-purple-600 p-2.5 rounded-2xl">
//               <CreditCard size={24} />
//             </span>
//             Subscription List
//           </h2>
//           <p className="text-sm text-slate-500 mt-1.5">
//             Manage all user subscriptions, plans & payment status.
//           </p>
//         </div>
//         <div className="mt-4 md:mt-0 flex items-center gap-2.5">
//           <button
//             onClick={fetchSubscriptions}
//             disabled={loading}
//             className="border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
//             title="Refresh"
//           >
//             <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
//             Refresh
//           </button>
//           <Link
//             href="/Dashboard/add-subscription"
//             className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all shadow-lg shadow-slate-900/20 hover:shadow-slate-900/30 hover:-translate-y-0.5 flex items-center gap-2"
//           >
//             <Plus size={16} /> Add Subscription
//           </Link>
//         </div>
//       </div>

//       {/* ---------- TABLE ---------- */}
//       <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
//         <div className="overflow-x-auto">
//           <table className="w-full text-left border-collapse min-w-[950px] whitespace-nowrap">
//             <thead>
//               <tr className="bg-slate-50 border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-500 font-bold">
//                 <th className="px-6 py-4 w-16">#</th>
//                 <th className="px-4 py-4">User</th>
//                 <th className="px-4 py-4">Plan Name</th>
//                 <th className="px-4 py-4">Amount</th>
//                 <th className="px-4 py-4">Status</th>
//                 <th className="px-4 py-4">Start Date</th>
//                 <th className="px-6 py-4 text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100 text-sm">
//               {loading ? (
//                 <tr>
//                   <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
//                     <div className="flex items-center justify-center gap-2">
//                       <Loader2 size={18} className="animate-spin" />
//                       <span>Loading subscriptions...</span>
//                     </div>
//                   </td>
//                 </tr>
//               ) : error ? (
//                 <tr>
//                   <td colSpan={7} className="px-6 py-12 text-center">
//                     <p className="text-red-500 mb-3">{error}</p>
//                     <button
//                       onClick={fetchSubscriptions}
//                       className="text-sm text-blue-600 hover:text-blue-800 font-medium"
//                     >
//                       Try again
//                     </button>
//                   </td>
//                 </tr>
//               ) : subscriptions.length === 0 ? (
//                 <tr>
//                   <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
//                     No records found
//                   </td>
//                 </tr>
//               ) : (
//                 subscriptions.map((sub, index) => (
//                   <tr
//                     key={sub.id ?? index}
//                     className="group relative bg-white transition-all duration-300 ease-out hover:bg-gradient-to-r hover:from-white hover:to-purple-50/30 hover:shadow-[0_12px_30px_-12px_rgba(0,0,0,0.15),0_0_0_1px_rgba(147,51,234,0.1)] hover:-translate-y-0.5 hover:scale-[1.001]"
//                   >
//                     {/* Left accent bar on hover */}
//                     <td className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 via-indigo-500 to-blue-500 rounded-r opacity-0 group-hover:opacity-100 transition-opacity" />

//                     <td className="px-6 py-4">
//                       <span className="font-semibold text-slate-400">
//                         {String(index + 1).padStart(2, '0')}
//                       </span>
//                     </td>
//                     <td className="px-4 py-4">
//                       <div className="flex items-center gap-3.5">
//                         <img
//                           src={sub.avatar || `https://i.pravatar.cc/150?u=${sub.user_id || index}`}
//                           alt="User"
//                           className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-sm transition-transform group-hover:scale-105 group-hover:border-purple-200"
//                           onError={(e) => {
//                             e.currentTarget.src = `https://i.pravatar.cc/150?u=${sub.user_id || index}`;
//                           }}
//                         />
//                         <div className="flex flex-col">
//                           <span className="font-semibold text-slate-800">
//                             User #{sub.user_id ?? '—'}
//                           </span>
//                           <span className="text-[11px] text-slate-400 truncate max-w-[160px]">
//                             {sub.email || sub.user_email || `ID: ${sub.user_id ?? 'N/A'}`}
//                           </span>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-4 py-4">
//                       <div className="flex flex-col">
//                         <span className="font-semibold text-slate-800">
//                           {sub.plan_name || '—'}
//                         </span>
//                         <span className="text-[11px] text-slate-400 truncate">
//                           {sub.plan_key || makePlanKey(sub.plan_name)}
//                         </span>
//                       </div>
//                     </td>
//                     <td className="px-4 py-4">
//                       <span className="inline-flex items-center gap-1 font-bold text-slate-800">
//                         {formatCurrency(sub.amount)}
//                       </span>
//                     </td>
//                     <td className="px-4 py-4">{getStatusBadge(sub.status)}</td>
//                     <td className="px-4 py-4 text-slate-500 text-xs font-medium">
//                       <span className="inline-flex items-center gap-1.5">
//                         <Calendar size={12} className="text-slate-400" />
//                         {formatDate(sub.date || sub.created_at || sub.start_date)}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="flex items-center justify-end gap-2">
//                         <button
//                           onClick={() => openViewModal(sub)}
//                           className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 hover:border-blue-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-200/50 transition-all flex items-center justify-center"
//                           title="View"
//                         >
//                           <Eye size={15} />
//                         </button>
//                         <button
//                           onClick={() => openEditModal(sub)}
//                           className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-100 hover:border-amber-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-200/50 transition-all flex items-center justify-center"
//                           title="Edit"
//                         >
//                           <SquarePen size={15} />
//                         </button>
//                         <button
//                           onClick={() => openDeleteModal(sub)}
//                           className="w-9 h-9 rounded-xl bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 hover:border-red-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-red-200/50 transition-all flex items-center justify-center"
//                           title="Delete"
//                         >
//                           <Trash2 size={15} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* ========== VIEW MODAL ========== */}
//       {viewModal.open && viewModal.sub && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//           <div
//             className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-fade-in"
//             onClick={closeViewModal}
//           />
//           <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full p-7 animate-modal-in max-h-[90vh] overflow-y-auto">
//             <div className="flex items-center gap-4 mb-5">
//               <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center flex-shrink-0">
//                 <Eye size={26} className="text-blue-600" />
//               </div>
//               <div>
//                 <h3 className="text-xl font-bold text-slate-800">View Subscription</h3>
//                 <p className="text-sm text-slate-500">Preview details</p>
//               </div>
//             </div>

//             <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center gap-4">
//               <img
//                 src={
//                   viewModal.sub.avatar ||
//                   `https://i.pravatar.cc/150?u=${viewModal.sub.user_id || 'default'}`
//                 }
//                 alt="User"
//                 className="w-16 h-16 rounded-2xl object-cover border border-slate-200"
//                 onError={(e) => {
//                   e.currentTarget.src = `https://i.pravatar.cc/150?u=${viewModal.sub.user_id || 'default'}`;
//                 }}
//               />
//               <div className="flex-1">
//                 <div className="font-bold text-slate-800 text-base">
//                   {viewModal.sub.plan_name || '—'}
//                 </div>
//                 <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
//                   <span className="inline-flex items-center gap-1">
//                     <User size={10} /> User #{viewModal.sub.user_id ?? '—'}
//                   </span>
//                   <span className="inline-flex items-center gap-1">
//                     <Calendar size={10} />
//                     {formatDate(
//                       viewModal.sub.date ||
//                         viewModal.sub.created_at ||
//                         viewModal.sub.start_date
//                     )}
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-4 mt-2.5">
//                   <span className="inline-flex items-center gap-1 text-slate-700 font-bold text-xs">
//                     <IndianRupee size={12} /> {Number(viewModal.sub.amount || 0).toFixed(2)}
//                   </span>
//                   {getStatusBadge(viewModal.sub.status)}
//                 </div>
//               </div>
//             </div>

//             <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
//               <div className="grid grid-cols-2 gap-4 text-sm">
//                 <div>
//                   <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
//                     Plan Key
//                   </p>
//                   <p className="text-slate-700 font-medium truncate">
//                     {viewModal.sub.plan_key || makePlanKey(viewModal.sub.plan_name)}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
//                     Status
//                   </p>
//                   <p className="text-slate-700 font-medium capitalize">
//                     {viewModal.sub.status || 'unknown'}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="flex items-center justify-end gap-3 mt-6">
//               <button
//                 onClick={closeViewModal}
//                 className="px-5 py-2.5 rounded-2xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all"
//               >
//                 Close
//               </button>
//               <button
//                 onClick={() => {
//                   const s = viewModal.sub;
//                   closeViewModal();
//                   setTimeout(() => openEditModal(s), 200);
//                 }}
//                 className="px-5 py-2.5 rounded-2xl text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-md hover:-translate-y-0.5 flex items-center gap-2"
//               >
//                 <SquarePen size={14} /> Edit
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ========== EDIT MODAL ========== */}
//       {editModal.open && editModal.sub && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//           <div
//             className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-fade-in"
//             onClick={closeEditModal}
//           />
//           <div className="relative bg-white rounded-3xl shadow-2xl max-w-xl w-full p-7 animate-modal-in max-h-[90vh] overflow-y-auto">
//             <div className="flex items-center gap-4 mb-5">
//               <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center flex-shrink-0">
//                 <SquarePen size={26} className="text-amber-600" />
//               </div>
//               <div>
//                 <h3 className="text-xl font-bold text-slate-800">Edit Subscription</h3>
//                 <p className="text-sm text-slate-500">Update subscription information</p>
//               </div>
//             </div>

//             <div className="flex flex-col gap-4">
//               <div className="flex flex-col gap-1.5">
//                 <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
//                   <Heading size={12} className="text-purple-500" /> Plan Name
//                 </label>
//                 <input
//                   type="text"
//                   value={editForm.plan_name}
//                   onChange={(e) =>
//                     setEditForm({ ...editForm, plan_name: e.target.value })
//                   }
//                   placeholder="Plan name"
//                   className="px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none text-sm text-slate-800 transition-all"
//                 />
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="flex flex-col gap-1.5">
//                   <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
//                     <FileText size={12} className="text-purple-500" /> Plan Key
//                   </label>
//                   <input
//                     type="text"
//                     value={editForm.plan_key}
//                     onChange={(e) =>
//                       setEditForm({ ...editForm, plan_key: e.target.value })
//                     }
//                     placeholder="plan-key"
//                     className="px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none text-sm text-slate-800 transition-all"
//                   />
//                 </div>
//                 <div className="flex flex-col gap-1.5">
//                   <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
//                     <IndianRupee size={12} className="text-purple-500" /> Amount
//                   </label>
//                   <input
//                     type="number"
//                     step="0.01"
//                     value={editForm.amount}
//                     onChange={(e) =>
//                       setEditForm({ ...editForm, amount: e.target.value })
//                     }
//                     placeholder="0.00"
//                     className="px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none text-sm text-slate-800 transition-all"
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="flex flex-col gap-1.5">
//                   <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
//                     <Circle size={12} className="text-purple-500" /> Status
//                   </label>
//                   <select
//                     value={editForm.status}
//                     onChange={(e) =>
//                       setEditForm({ ...editForm, status: e.target.value })
//                     }
//                     className="px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none text-sm text-slate-800 transition-all bg-white"
//                   >
//                     <option value="paid">Paid</option>
//                     <option value="created">Created</option>
//                     <option value="failed">Failed</option>
//                   </select>
//                 </div>
//                 <div className="flex flex-col gap-1.5">
//                   <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
//                     <Calendar size={12} className="text-purple-500" /> Start Date
//                   </label>
//                   <input
//                     type="date"
//                     value={
//                       editForm.date
//                         ? new Date(editForm.date).toISOString().split('T')[0]
//                         : ''
//                     }
//                     onChange={(e) =>
//                       setEditForm({ ...editForm, date: e.target.value })
//                     }
//                     className="px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none text-sm text-slate-800 transition-all"
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="flex items-center justify-end gap-3 mt-6">
//               <button
//                 onClick={closeEditModal}
//                 disabled={saving}
//                 className="px-5 py-2.5 rounded-2xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all disabled:opacity-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={confirmEdit}
//                 disabled={saving}
//                 className="px-5 py-2.5 rounded-2xl text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-md hover:-translate-y-0.5 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {saving ? (
//                   <>
//                     <Loader2 size={14} className="animate-spin" /> Saving...
//                   </>
//                 ) : (
//                   <>
//                     <Save size={14} /> Save changes
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ========== DELETE MODAL ========== */}
//       {deleteModal.open && deleteModal.sub && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//           <div
//             className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-fade-in"
//             onClick={closeDeleteModal}
//           />
//           <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-7 animate-modal-in">
//             <div className="flex items-start gap-4">
//               <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center flex-shrink-0">
//                 <AlertTriangle size={26} className="text-red-600" />
//               </div>
//               <div className="flex-1">
//                 <h3 className="text-xl font-bold text-slate-800">Delete Subscription</h3>
//                 <p className="text-sm text-slate-500 mt-1">
//                   Are you sure you want to delete this subscription? This action
//                   cannot be undone.
//                 </p>
//                 <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
//                   <img
//                     src={
//                       deleteModal.sub.avatar ||
//                       `https://i.pravatar.cc/150?u=${deleteModal.sub.user_id || 'default'}`
//                     }
//                     alt="User"
//                     className="w-12 h-12 rounded-xl object-cover border border-slate-200"
//                     onError={(e) => {
//                       e.currentTarget.src = `https://i.pravatar.cc/150?u=${deleteModal.sub.user_id || 'default'}`;
//                     }}
//                   />
//                   <div>
//                     <p className="text-sm font-semibold text-slate-700 line-clamp-1">
//                       {deleteModal.sub.plan_name || 'Untitled Plan'}
//                     </p>
//                     <p className="text-xs text-slate-400 mt-0.5 capitalize flex items-center gap-2">
//                       <span>User #{deleteModal.sub.user_id ?? '—'}</span>
//                       <span>•</span>
//                       <span>{deleteModal.sub.status || 'unknown'}</span>
//                     </p>
//                   </div>
//                 </div>
//                 <p className="mt-4 text-sm text-red-700 font-medium flex items-center gap-2">
//                   <Info size={14} /> This will permanently remove the subscription.
//                 </p>
//               </div>
//             </div>

//             <div className="flex items-center justify-end gap-3 mt-6">
//               <button
//                 onClick={closeDeleteModal}
//                 disabled={deleting}
//                 className="px-5 py-2.5 rounded-2xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={confirmDelete}
//                 disabled={deleting}
//                 className="px-5 py-2.5 rounded-2xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-all shadow-md hover:-translate-y-0.5 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {deleting ? (
//                   <>
//                     <Loader2 size={14} className="animate-spin" /> Deleting...
//                   </>
//                 ) : (
//                   <>
//                     <Trash2 size={14} /> Delete
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ---------- CUSTOM CSS ---------- */}
//       <style jsx global>{`
//         @keyframes dotBlink {
//           0%, 100% {
//             opacity: 1;
//             transform: scale(1);
//             box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.7);
//           }
//           50% {
//             opacity: 0.45;
//             transform: scale(0.78);
//             box-shadow: 0 0 0 5px rgba(245, 158, 11, 0);
//           }
//         }
//         .animate-dot-blink {
//           animation: dotBlink 1.4s ease-in-out infinite;
//         }

//         @keyframes fadeIn {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }
//         .animate-fade-in {
//           animation: fadeIn 0.25s ease-out;
//         }

//         @keyframes modalIn {
//           from {
//             opacity: 0;
//             transform: scale(0.92) translateY(20px);
//           }
//           to {
//             opacity: 1;
//             transform: scale(1) translateY(0);
//           }
//         }
//         .animate-modal-in {
//           animation: modalIn 0.3s cubic-bezier(0.2, 0.9, 0.3, 1.1);
//         }

//         @keyframes fadeInUp {
//           from {
//             opacity: 0;
//             transform: translateY(15px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         .animate-fade-in-up {
//           animation: fadeInUp 0.4s ease-out;
//         }
//       `}</style>
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
  Calendar,
  Circle,
  Heading,
  Save,
  Info,
  IndianRupee,
  CreditCard,
  FileText,
  Clock,
  Star,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';

export default function SubTable({ onDelete, onEdit, addToast, refreshKey }) {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, sub: null });
  const [viewModal, setViewModal] = useState({ open: false, sub: null });
  const [editModal, setEditModal] = useState({ open: false, sub: null });
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);

  // Edit form state — matches API data model
  const [editForm, setEditForm] = useState({
    plan_name: '',
    plan_key: '',
    title: '',
    price: '',
    original_price: '',
    period: '',
    duration_days: '',
    currency: 'INR',
    tag_label: '',
    tag_color: '#4CAF50',
    popular: false,
    is_active: true,
    features: [],
    featuresText: '',
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

  const formatCurrency = (amount, currency = 'INR') => {
    const num = Number(amount);
    if (isNaN(num)) return '₹ 0.00';
    const symbol = currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency;
    return `${symbol} ${num.toFixed(2)}`;
  };

  const makePlanKey = (name = '') =>
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 40) || 'plan-key';

  // ---------- FETCH PLANS ----------
  const fetchSubscriptions = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/api/plan/allplans');

      // API returns: { success, count, data: [...] }
      const list =
        data?.data ||
        data?.plans ||
        data?.subscriptions ||
        (Array.isArray(data) ? data : []);

      if (data?.success === false) {
        throw new Error(data?.message || 'Failed to load plans');
      }

      setSubscriptions(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('Error fetching plans:', err);
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Failed to load plans. Please try again.';
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
  const getStatusBadge = (isActive) => {
    if (isActive === true) {
      return (
        <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-[11px] font-semibold">
          <span className="w-[7px] h-[7px] rounded-full bg-emerald-500" />
          Active
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 px-3 py-1 rounded-full text-[11px] font-semibold">
        <span className="w-[7px] h-[7px] rounded-full bg-red-500" />
        Inactive
      </span>
    );
  };

  // ---------- OPEN MODALS ----------
  const openViewModal = (sub) => setViewModal({ open: true, sub });

  const openEditModal = (sub) => {
    setEditForm({
      plan_name: sub.plan_name || '',
      plan_key: sub.plan_key || '',
      title: sub.title || '',
      price: sub.price || '',
      original_price: sub.original_price || '',
      period: sub.period || 'month',
      duration_days: sub.duration_days || '',
      currency: sub.currency || 'INR',
      tag_label: sub.tag_label || '',
      tag_color: sub.tag_color || '#4CAF50',
      popular: sub.popular || false,
      is_active: sub.is_active ?? true,
      features: Array.isArray(sub.features) ? sub.features : [],
      featuresText: Array.isArray(sub.features) ? sub.features.join(', ') : '',
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

      // If parent provides onDelete, delegate
      if (onDelete) {
        await onDelete(sub.id);
        setSubscriptions((prev) => prev.filter((s) => s.id !== sub.id));
        if (addToast) addToast('Plan deleted successfully', 'success');
        setDeleteModal({ open: false, sub: null });
        return;
      }

      // Direct API call: /api/plan/deleteplan/:id
      const { data } = await api.delete(`/api/plan/deleteplan/${sub.id}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (data && data.success === false) {
        throw new Error(data?.message || 'Failed to delete plan');
      }

      if (addToast) addToast(data?.message || 'Plan deleted successfully', 'success');
      setSubscriptions((prev) => prev.filter((s) => s.id !== sub.id));
      setDeleteModal({ open: false, sub: null });
    } catch (err) {
      console.error('Error deleting plan:', err);
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Failed to delete plan. Please try again.';
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

      // Parse features from comma-separated text
      const featuresArray = editForm.featuresText
        .split(',')
        .map((f) => f.trim())
        .filter(Boolean);

      const payload = {
        plan_name: editForm.plan_name,
        plan_key: editForm.plan_key,
        title: editForm.title,
        price: Number(editForm.price) || 0,
        original_price: Number(editForm.original_price) || 0,
        period: editForm.period,
        duration_days: Number(editForm.duration_days) || 0,
        currency: editForm.currency,
        tag_label: editForm.tag_label || null,
        tag_color: editForm.tag_color,
        popular: Boolean(editForm.popular),
        is_active: Boolean(editForm.is_active),
        features: featuresArray,
      };

      // If parent provides onEdit, delegate
      if (onEdit) {
        await onEdit({ id: sub.id, ...payload });
        setSubscriptions((prev) =>
          prev.map((s) => (s.id === sub.id ? { ...s, ...payload } : s))
        );
        if (addToast) addToast('Plan updated successfully', 'success');
        setEditModal({ open: false, sub: null });
        return;
      }

      // Direct API call: /api/plan/updateplan/:id
      const { data } = await api.put(`/api/plan/updateplan/${sub.id}`, payload, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (data && data.success === false) {
        throw new Error(data?.message || 'Failed to update plan');
      }

      if (addToast) addToast(data?.message || 'Plan updated successfully', 'success');

      setSubscriptions((prev) =>
        prev.map((s) => (s.id === sub.id ? { ...s, ...payload } : s))
      );
      setEditModal({ open: false, sub: null });
    } catch (err) {
      console.error('Error updating plan:', err);
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Failed to update plan. Please try again.';
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
            Subscription Plans
          </h2>
          <p className="text-sm text-slate-500 mt-1.5">
            Manage all subscription plans, pricing & features.
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
            <Plus size={16} /> Add Plan
          </Link>
        </div>
      </div>

      {/* ---------- TABLE ---------- */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px] whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                <th className="px-6 py-4 w-16">#</th>
                <th className="px-4 py-4">Plan</th>
                <th className="px-4 py-4">Title</th>
                <th className="px-4 py-4">Price</th>
                <th className="px-4 py-4">Period</th>
                <th className="px-4 py-4">Duration</th>
                <th className="px-4 py-4">Features</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 size={18} className="animate-spin" />
                      <span>Loading plans...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center">
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
                  <td colSpan={9} className="px-6 py-12 text-center text-slate-400">
                    No plans found
                  </td>
                </tr>
              ) : (
                subscriptions.map((sub, index) => (
                  <tr
                    key={sub.id ?? index}
                    className="group relative bg-white transition-all duration-300 ease-out hover:bg-gradient-to-r hover:from-white hover:to-purple-50/30 hover:shadow-[0_12px_30px_-12px_rgba(0,0,0,0.15),0_0_0_1px_rgba(147,51,234,0.1)] hover:-translate-y-0.5"
                  >
                    <td className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 via-indigo-500 to-blue-500 rounded-r opacity-0 group-hover:opacity-100 transition-opacity" />

                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-400">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </td>

                    {/* Plan Name + Key */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm">
                          {(sub.plan_name || 'P').charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-800">
                              {sub.plan_name || '—'}
                            </span>
                            {sub.popular && (
                              <span className="inline-flex items-center gap-0.5 bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-md text-[10px] font-bold">
                                <Star size={9} /> POPULAR
                              </span>
                            )}
                            {sub.tag_label && (
                              <span
                                className="px-1.5 py-0.5 rounded-md text-[10px] font-bold text-white"
                                style={{ backgroundColor: sub.tag_color || '#4CAF50' }}
                              >
                                {sub.tag_label}
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400 truncate max-w-[160px]">
                            {sub.plan_key || makePlanKey(sub.plan_name)}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Title */}
                    <td className="px-4 py-4">
                      <span className="text-slate-600 text-xs truncate max-w-[180px] inline-block">
                        {sub.title || '—'}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <span className="inline-flex items-center gap-1 font-bold text-slate-800">
                          {formatCurrency(sub.price, sub.currency)}
                        </span>
                        {sub.original_price && Number(sub.original_price) > 0 && (
                          <span className="text-[11px] text-slate-400 line-through">
                            {formatCurrency(sub.original_price, sub.currency)}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Period */}
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-1 text-slate-600 text-xs font-medium capitalize">
                        <Clock size={11} className="text-slate-400" />
                        {sub.period || '—'}
                      </span>
                    </td>

                    {/* Duration */}
                    <td className="px-4 py-4">
                      <span className="text-slate-600 text-xs font-medium">
                        {sub.duration_days ? `${sub.duration_days} days` : '—'}
                      </span>
                    </td>

                    {/* Features */}
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {Array.isArray(sub.features) && sub.features.length > 0 ? (
                          <>
                            {sub.features.slice(0, 2).map((f, i) => (
                              <span
                                key={i}
                                className="inline-block bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-[10px] font-medium truncate max-w-[90px]"
                                title={f}
                              >
                                {f}
                              </span>
                            ))}
                            {sub.features.length > 2 && (
                              <span className="inline-block bg-purple-50 text-purple-600 px-2 py-0.5 rounded-md text-[10px] font-bold">
                                +{sub.features.length - 2}
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-slate-300 text-xs">—</span>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4">{getStatusBadge(sub.is_active)}</td>

                    {/* Actions */}
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
                <h3 className="text-xl font-bold text-slate-800">View Plan</h3>
                <p className="text-sm text-slate-500">Preview plan details</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                {(viewModal.sub.plan_name || 'P').charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-slate-800 text-base">
                    {viewModal.sub.plan_name || '—'}
                  </span>
                  {viewModal.sub.popular && (
                    <span className="inline-flex items-center gap-0.5 bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-md text-[10px] font-bold">
                      <Star size={9} /> POPULAR
                    </span>
                  )}
                  {viewModal.sub.tag_label && (
                    <span
                      className="px-1.5 py-0.5 rounded-md text-[10px] font-bold text-white"
                      style={{ backgroundColor: viewModal.sub.tag_color || '#4CAF50' }}
                    >
                      {viewModal.sub.tag_label}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {viewModal.sub.title || '—'}
                </p>
                <div className="flex items-center gap-4 mt-2.5">
                  <span className="inline-flex items-center gap-1 text-slate-700 font-bold text-sm">
                    <IndianRupee size={12} />
                    {Number(viewModal.sub.price || 0).toFixed(2)}
                  </span>
                  <span className="text-xs text-slate-500">/ {viewModal.sub.period}</span>
                  {getStatusBadge(viewModal.sub.is_active)}
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
                    Duration
                  </p>
                  <p className="text-slate-700 font-medium">
                    {viewModal.sub.duration_days || 0} days
                  </p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
                    Original Price
                  </p>
                  <p className="text-slate-700 font-medium line-through">
                    {formatCurrency(viewModal.sub.original_price, viewModal.sub.currency)}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
                    Currency
                  </p>
                  <p className="text-slate-700 font-medium">
                    {viewModal.sub.currency || 'INR'}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
                    Created
                  </p>
                  <p className="text-slate-700 font-medium">
                    {formatDate(viewModal.sub.created_at)}
                  </p>
                </div>
              </div>
            </div>

            {Array.isArray(viewModal.sub.features) && viewModal.sub.features.length > 0 && (
              <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-2">
                  Features ({viewModal.sub.features.length})
                </p>
                <ul className="space-y-1.5">
                  {viewModal.sub.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                      <CheckCircle size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

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
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-7 animate-modal-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                <SquarePen size={26} className="text-amber-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">Edit Plan</h3>
                <p className="text-sm text-slate-500">Update plan information</p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {/* Plan Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Heading size={12} className="text-purple-500" /> Plan Name
                </label>
                <input
                  type="text"
                  value={editForm.plan_name}
                  onChange={(e) => setEditForm({ ...editForm, plan_name: e.target.value })}
                  placeholder="Plan name"
                  className="px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none text-sm text-slate-800 transition-all"
                />
              </div>

              {/* Title */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <FileText size={12} className="text-purple-500" /> Title
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  placeholder="Short description title"
                  className="px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none text-sm text-slate-800 transition-all"
                />
              </div>

              {/* Plan Key + Currency */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <FileText size={12} className="text-purple-500" /> Plan Key
                  </label>
                  <input
                    type="text"
                    value={editForm.plan_key}
                    onChange={(e) => setEditForm({ ...editForm, plan_key: e.target.value })}
                    placeholder="plan-key"
                    className="px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none text-sm text-slate-800 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Circle size={12} className="text-purple-500" /> Currency
                  </label>
                  <select
                    value={editForm.currency}
                    onChange={(e) => setEditForm({ ...editForm, currency: e.target.value })}
                    className="px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none text-sm text-slate-800 transition-all bg-white"
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>
              </div>

              {/* Price + Original Price */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <IndianRupee size={12} className="text-purple-500" /> Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editForm.price}
                    onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                    placeholder="0.00"
                    className="px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none text-sm text-slate-800 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <IndianRupee size={12} className="text-purple-500" /> Original Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editForm.original_price}
                    onChange={(e) => setEditForm({ ...editForm, original_price: e.target.value })}
                    placeholder="0.00"
                    className="px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none text-sm text-slate-800 transition-all"
                  />
                </div>
              </div>

              {/* Period + Duration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Clock size={12} className="text-purple-500" /> Period
                  </label>
                  <select
                    value={editForm.period}
                    onChange={(e) => setEditForm({ ...editForm, period: e.target.value })}
                    className="px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none text-sm text-slate-800 transition-all bg-white"
                  >
                    <option value="day">Day</option>
                    <option value="week">Week</option>
                    <option value="month">Month</option>
                    <option value="year">Year</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Calendar size={12} className="text-purple-500" /> Duration (days)
                  </label>
                  <input
                    type="number"
                    value={editForm.duration_days}
                    onChange={(e) => setEditForm({ ...editForm, duration_days: e.target.value })}
                    placeholder="30"
                    className="px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none text-sm text-slate-800 transition-all"
                  />
                </div>
              </div>

              {/* Tag Label + Tag Color */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-700">Tag Label</label>
                  <input
                    type="text"
                    value={editForm.tag_label}
                    onChange={(e) => setEditForm({ ...editForm, tag_label: e.target.value })}
                    placeholder="e.g. Popular"
                    className="px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none text-sm text-slate-800 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-700">Tag Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={editForm.tag_color}
                      onChange={(e) => setEditForm({ ...editForm, tag_color: e.target.value })}
                      className="w-12 h-12 rounded-xl border-2 border-slate-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={editForm.tag_color}
                      onChange={(e) => setEditForm({ ...editForm, tag_color: e.target.value })}
                      className="flex-1 px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none text-sm text-slate-800 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Features (comma separated)
                </label>
                <textarea
                  rows={3}
                  value={editForm.featuresText}
                  onChange={(e) => setEditForm({ ...editForm, featuresText: e.target.value })}
                  placeholder="Unlimited access, Best offers, Priority support"
                  className="px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none text-sm text-slate-800 transition-all resize-none"
                />
              </div>

              {/* Popular + Active toggles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border-2 border-slate-200 cursor-pointer hover:border-purple-300 transition-all">
                  <input
                    type="checkbox"
                    checked={editForm.popular}
                    onChange={(e) => setEditForm({ ...editForm, popular: e.target.checked })}
                    className="w-4 h-4 accent-purple-600"
                  />
                  <span className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                    <Star size={14} className="text-amber-500" /> Mark as Popular
                  </span>
                </label>
                <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border-2 border-slate-200 cursor-pointer hover:border-purple-300 transition-all">
                  <input
                    type="checkbox"
                    checked={editForm.is_active}
                    onChange={(e) => setEditForm({ ...editForm, is_active: e.target.checked })}
                    className="w-4 h-4 accent-emerald-600"
                  />
                  <span className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                    {editForm.is_active ? (
                      <CheckCircle size={14} className="text-emerald-500" />
                    ) : (
                      <XCircle size={14} className="text-red-500" />
                    )}
                    Active
                  </span>
                </label>
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
                <h3 className="text-xl font-bold text-slate-800">Delete Plan</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Are you sure you want to delete this plan? This action cannot be undone.
                </p>
                <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {(deleteModal.sub.plan_name || 'P').charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-700 truncate">
                      {deleteModal.sub.plan_name || 'Untitled Plan'}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5 capitalize flex items-center gap-2">
                      <span>{formatCurrency(deleteModal.sub.price, deleteModal.sub.currency)}</span>
                      <span>•</span>
                      <span>{deleteModal.sub.period}</span>
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-red-700 font-medium flex items-center gap-2">
                  <Info size={14} /> This will permanently remove the plan.
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




