import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-primary text-white mt-16">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <div className="font-bold text-lg">
            GAYATRI <span className="text-accent">GRANITES</span>
          </div>
          <p className="text-xs text-white/60 mt-2">
            Your trusted partner for premium granite and stone solutions.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-3">Quick Links</h4>
          <ul className="space-y-2 text-xs text-white/70">
            <li>Home</li>
            <li>Products</li>
            <li>About Us</li>
            <li>Contact Us</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-3">Customer Service</h4>
          <ul className="space-y-2 text-xs text-white/70">
            <li><Link to="/shipping-policy" >Shipping Policy</Link></li>
            <li>Returns</li>
            <li><Link to="/terms" >Terms & Conditions</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-3">Contact</h4>
          <ul className="space-y-2 text-xs text-white/70">
            <li>+91 98765 43210</li>
            <li>info@gayatrigranites.com</li>
            <li>Hyderabad, Telangana</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 text-center text-xs text-white/50 py-4">
        © 2026 Gayatri Granites. All Rights Reserved.
      </div>
    </footer>
  );
}