export default function Input({ label, error, className = '', ...props }) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-primary mb-1">{label}</label>}
      <input
        className={`w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent ${className}`}
        {...props}
      />
      {error && <p className="text-danger text-xs mt-1">{error}</p>}
    </div>
  );
}