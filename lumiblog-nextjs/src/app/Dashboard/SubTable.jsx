'use client';

export default function SubTable({ subs, onDelete, onEdit, onSwitchToAdd }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return (
          <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded-full text-[10px] font-medium flex items-center w-fit gap-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Paid
          </span>
        );
      case 'created':
        return (
          <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full text-[10px] font-medium flex items-center w-fit gap-1">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span> Created
          </span>
        );
      case 'failed':
        return (
          <span className="bg-red-50 text-red-700 px-2 py-0.5 rounded-full text-[10px] font-medium flex items-center w-fit gap-1">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span> Failed
          </span>
        );
      default:
        return (
          <span className="bg-gray-50 text-gray-700 px-2 py-0.5 rounded-full text-[10px] font-medium flex items-center w-fit gap-1">
            <span className="w-1.5 h-1.5 bg-gray-500 rounded-full"></span> {status}
          </span>
        );
    }
  };

  return (
    <div className="animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Subscription List</h2>
          <p className="text-sm text-gray-500 mt-1">Manage all user subscriptions and payments.</p>
        </div>
        <button
          onClick={onSwitchToAdd}
          className="mt-4 md:mt-0 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-md hover:shadow-lg flex items-center gap-2"
        >
          <i className="fa-solid fa-plus"></i> Add Subscription
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                <th className="px-4 py-3 w-16">#</th>
                <th className="px-4 py-3">User ID</th>
                <th className="px-4 py-3">Plan Name</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Start Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {subs.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-400">
                    No records found
                  </td>
                </tr>
              ) : (
                subs.map((sub) => (
                  <tr key={sub.id} className="table-row-hover">
                    <td className="px-4 py-3">
                      <img
                        src={sub.avatar || 'https://i.pravatar.cc/150?img=12'}
                        alt="User"
                        className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm"
                      />
                    </td>
                    <td className="px-4 py-3 text-gray-600 font-medium">User #{sub.user_id}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-800">{sub.plan_name}</span>
                        <span className="text-xs text-gray-400">{sub.plan_key}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800">
                      ₹ {Number(sub.amount).toFixed(2)}
                    </td>
                    <td className="px-4 py-3">{getStatusBadge(sub.status)}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{sub.date}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button className="action-btn w-7 h-7 rounded-lg bg-gray-50 text-gray-500 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-center">
                          <i className="fa-regular fa-eye text-[10px]"></i>
                        </button>
                        <button
                          onClick={() => onEdit(sub)}
                          className="action-btn w-7 h-7 rounded-lg bg-gray-50 text-gray-500 hover:bg-amber-50 hover:text-amber-600 flex items-center justify-center"
                        >
                          <i className="fa-regular fa-pen-to-square text-[10px]"></i>
                        </button>
                        <button
                          onClick={() => onDelete(sub.id)}
                          className="action-btn w-7 h-7 rounded-lg bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-600 flex items-center justify-center"
                        >
                          <i className="fa-regular fa-trash-can text-[10px]"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <span>Showing 1 to {subs.length} of {subs.length} entries</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50" disabled>
              Prev
            </button>
            <button className="px-3 py-1 rounded-lg bg-indigo-600 text-white">1</button>
            <button className="px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}