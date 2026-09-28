'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SubTable from '../SubTable';
import SubEditModal from '../SubEditModal';
// import SubTable from '../SubTable';
// import SubEditModal from '.../SubEditModal';

export default function SubscriptionsPage() {
  const router = useRouter();
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
  ]);

  const [editingSub, setEditingSub] = useState(null);

  const handleDelete = (id) => {
    setSubs((prev) => prev.filter((s) => s.id !== id));
  };

  const handleUpdate = (updatedSub) => {
    setSubs((prev) => prev.map((s) => (s.id === updatedSub.id ? updatedSub : s)));
  };

  return (
    <>
      <SubTable
        subs={subs}
        onDelete={handleDelete}
        onEdit={(sub) => setEditingSub(sub)}
        onSwitchToAdd={() => router.push('/dashboard/add-subscription')}
      />

      <SubEditModal
        isOpen={!!editingSub}
        subData={editingSub}
        onClose={() => setEditingSub(null)}
        onUpdate={handleUpdate}
        addToast={(msg) => console.log(msg)}
      />
    </>
  );
}