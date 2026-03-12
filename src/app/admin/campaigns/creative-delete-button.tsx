'use client';

import { trpc } from '@/lib/trpc';

interface CreativeDeleteButtonProps {
  creativeId: string;
}

export function CreativeDeleteButton({
  creativeId,
}: CreativeDeleteButtonProps) {
  const utils = trpc.useUtils();
  const deleteCreativeMutation = trpc.creatives.delete.useMutation({
    onSuccess: () => {
      // Invalidate and refetch campaigns to update creative counts
      utils.campaigns.getAll.invalidate();
    },
  });

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this creative?')) {
      try {
        await deleteCreativeMutation.mutateAsync({ id: creativeId });
      } catch (error) {
        console.error('Error deleting creative:', error);
      }
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={deleteCreativeMutation.isPending}
      className='text-red-600 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed'
    >
      {deleteCreativeMutation.isPending ? 'Deleting...' : 'Delete'}
    </button>
  );
}
