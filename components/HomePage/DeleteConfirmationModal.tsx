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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="rounded-lg bg-white p-4 sm:p-6 shadow-lg max-w-sm w-full">
        <h3 className="mb-2 text-base sm:text-lg font-semibold text-slate-900">Delete word?</h3>
        <p className="mb-4 sm:mb-6 text-xs sm:text-sm text-slate-600 break-words">
          Are you sure you want to delete "{wordName}"? This action cannot be undone.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-end">
          <button
            onClick={onCancel}
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 transition hover:bg-slate-50 order-2 sm:order-1"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-md bg-rose-500 px-4 py-2 text-xs sm:text-sm font-semibold text-white transition hover:bg-rose-600 order-1 sm:order-2"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
