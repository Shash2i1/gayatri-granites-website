import { useConfirmStore } from '../../store/confirmStore';
import Button from './Button';

export default function ConfirmModal() {
  const { isOpen, title, message, confirmLabel, variant, handleConfirm, handleCancel } =
    useConfirmStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={handleCancel} />

      <div className="relative bg-surface w-full sm:w-96 sm:rounded-lg rounded-t-2xl p-6">
        <h3 className="font-bold text-base mb-2">{title}</h3>
        <p className="text-sm text-muted mb-6">{message}</p>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant={variant} className="flex-1" onClick={handleConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}