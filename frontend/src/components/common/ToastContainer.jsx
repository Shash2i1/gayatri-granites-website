import { useToastStore } from '../../store/toastStore';

const TYPE_STYLES = {
  success: 'bg-success text-white',
  error: 'bg-danger text-white',
  info: 'bg-primary text-white',
};

export default function ToastContainer() {
  const { toasts } = useToastStore();

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 sm:left-auto sm:right-4 sm:translate-x-0 z-[70] flex flex-col gap-2 w-[90%] sm:w-80">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`px-4 py-3 rounded-lg shadow-lg text-sm font-medium ${TYPE_STYLES[t.type]}`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}