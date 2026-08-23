export default function Button({
  children,
  variant = 'primary',
  className = '',
  ...props
}) {
  const variants = {
    primary: 'bg-primary text-white hover:bg-black',
    accent: 'bg-accent text-primary hover:bg-accent-dark',
    outline: 'border border-border text-primary hover:bg-background',
    danger: 'bg-danger text-white hover:bg-red-800',
  };

  return (
    <button
      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}