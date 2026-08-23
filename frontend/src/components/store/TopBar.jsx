export default function TopBar() {
  return (
    <div className="hidden md:flex bg-primary text-white text-xs px-6 py-2 items-center justify-between">
      <span>Premium Quality Granite & Stone Solutions</span>
      <div className="flex items-center gap-6">
        <span>Free Shipping on orders above ₹50,000</span>
        <span>Call Us: +91 96119 65747</span>
      </div>
    </div>
  );
}