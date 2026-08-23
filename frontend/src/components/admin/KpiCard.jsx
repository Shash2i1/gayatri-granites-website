export default function KpiCard({ label, value, sublabel, accentColor = 'text-primary' }) {
  return (
    <div className="bg-surface border border-border rounded-lg p-4 md:p-5">
      <p className="text-xs text-muted font-medium">{label}</p>
      <p className={`text-2xl md:text-3xl font-bold mt-1 ${accentColor}`}>{value}</p>
      {sublabel && <p className="text-xs text-muted mt-1">{sublabel}</p>}
    </div>
  );
}