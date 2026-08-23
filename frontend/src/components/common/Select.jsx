export default function Select({ label, error, children, className = '', ...props }) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-primary mb-1">{label}</label>}
      <select
        className={`w-full border border-border rounded-md px-3 py-2 text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-danger text-xs mt-1">{error}</p>}
    </div>
  );
}