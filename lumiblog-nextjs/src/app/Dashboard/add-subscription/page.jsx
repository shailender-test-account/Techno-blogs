'use client';

import SubForm from "../SubForm";



export default function AddSubscriptionPage() {
  const handleAddSub = (data) => {
    console.log('Subscription added:', data);
  };

  const addToast = (msg, type) => {
    console.log(msg, type);
  };

  return <SubForm onAddSub={handleAddSub} addToast={addToast} />;
}