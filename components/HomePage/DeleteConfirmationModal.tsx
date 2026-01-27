interface DeleteConfirmationModalProps {
  isOpen: boolean;
  wordName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmationModal({
  isOpen,
  wordName,
  onConfirm,
  onCancel,
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <h3 className="mb-2 text-lg font-semibold text-slate-900">Delete word?</h3>
        <p className="mb-6 text-sm text-slate-600">
          Are you sure you want to delete "{wordName}"? This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-md bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
