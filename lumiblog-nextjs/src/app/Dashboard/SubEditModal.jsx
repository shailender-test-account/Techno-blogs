'use client';
import { useState, useEffect } from 'react';

export default function SubEditModal({ isOpen, onClose, subData, onUpdate, addToast }) {
  const [formData, setFormData] = useState({
    user_id: '',
    plan_key: '',
    plan_name: '',
    amount: '',
    status: 'created',
    start_date: '',
  });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (subData) {
      setFormData({
        user_id: subData.user_id || '',
        plan_key: subData.plan_key || 'basic_monthly',
        plan_name: subData.plan_name || '',
        amount: subData.amount || '',
        status: subData.status || 'created',
        start_date: subData.start_date || '',
      });
    }
  }, [subData]);

  if (!isOpen || !subData) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.user_id || !formData.plan_name || !formData.amount) {
      addToast('Please fill in required fields', 'error');
      return;
    }

    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      onUpdate({ ...subData, ...formData });
      addToast('Subscription updated successfully!', 'success');
      onClose();
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 p-6 md:p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <i className="fa-regular fa-pen-to-square text-purple-600"></i> Edit Subscription
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="form-label">User ID</label>
            <input
              type="number"
              value={formData.user_id}
              onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
              className="form-input"
              required
            />
          </div>
          <div>
            <label className="form-label">Plan Key</label>
            <select
              value={formData.plan_key}
              onChange={(e) => setFormData({ ...formData, plan_key: e.target.value })}
              className="form-input appearance-none"
              required
            >
              <option value="basic_monthly">basic_monthly</option>
              <option value="premium_monthly">premium_monthly</option>
              <option value="pro_yearly">pro_yearly</option>
            </select>
          </div>
          <div>
            <label className="form-label">Plan Name</label>
            <input
              type="text"
              value={formData.plan_name}
              onChange={(e) => setFormData({ ...formData, plan_name: e.target.value })}
              className="form-input"
              required
            />
          </div>
          <div>
            <label className="form-label">Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-400 text-sm">₹</span>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="form-input pl-7"
                required
              />
            </div>
          </div>
          <div>
            <label className="form-label">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="form-input appearance-none"
            >
              <option value="created">Created</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="form-label">Start Date</label>
            <input
              type="datetime-local"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              className="form-input"
            />
          </div>
          <div className="md:col-span-2 mt-4 flex gap-4">
            <button
              type="submit"
              disabled={isUpdating}
              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-3 px-6 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              {isUpdating ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-check"></i>}
              {isUpdating ? 'Updating...' : 'Update Subscription'}
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