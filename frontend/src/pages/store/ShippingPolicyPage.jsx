import { Link } from 'react-router-dom';

export default function ShippingPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-10 md:py-14">
      <div className="text-xs text-muted mb-4">
        <Link to="/" className="hover:text-primary">Home</Link> / <span className="text-primary">Shipping & Returns Policy</span>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold">Shipping & Returns Policy</h1>
      <p className="text-sm text-muted mt-2">Last updated: August 2026</p>

      <div className="prose-sm max-w-none mt-8 space-y-8 text-sm leading-relaxed text-primary/90">
        <section>
          <h2 className="text-lg font-bold mb-2">1. Delivery Areas</h2>
          <p>
            We currently deliver across India. Delivery timelines and freight charges vary by
            location, product weight, and order quantity. Remote or low-accessibility areas may
            require additional coordination and could incur extra freight charges, which will
            be communicated before dispatch if applicable.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-2">2. Shipping Charges</h2>
          <p>
            Shipping charges, along with applicable GST and SGST, are calculated at checkout
            and shown before payment. Orders above ₹50,000 qualify for free shipping within
            our standard serviceable areas, unless stated otherwise on the product page.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-2">3. Processing & Dispatch Time</h2>
          <p>
            In-stock items are typically dispatched within 3–5 business days of order
            confirmation. Custom-cut, made-to-order, or bulk quarry orders may take longer —
            typically 1–3 weeks depending on size, finish, and quantity. Estimated dispatch
            timelines will be communicated after order confirmation for such items.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-2">4. Packaging</h2>
          <p>
            Granite slabs, tiles, and other stone products are heavy and fragile. We use
            industry-standard crating, edge protection, and secure palletizing for transit to
            minimize the risk of damage. Despite careful packaging, natural stone products can
            be susceptible to chipping or cracking during transport — see our damage claims
            process below.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-2">5. Delivery Method</h2>
          <p>
            Due to the weight and size of most products, deliveries are made via freight/goods
            transport rather than standard courier. Someone must be available at the delivery
            address to receive the shipment, and the site should be accessible to a transport
            vehicle (truck/tempo). Additional charges may apply if manual carrying beyond the
            vehicle's reach is required (e.g. upper floors without lift access).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-2">6. Order Tracking</h2>
          <p>
            Once your order is dispatched, transport and tracking details (carrier, vehicle
            number, and estimated delivery date) will be updated on your order page under{' '}
            <Link to="/orders" className="text-accent-dark underline">My Orders</Link>.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-2">7. Damaged or Incorrect Items</h2>
          <p>
            Please inspect your shipment at the time of delivery wherever possible. If any item
            arrives damaged, cracked, or does not match your order, contact us within{' '}
            <strong>48 hours of delivery</strong> with your order ID and photographs of the
            damaged item and packaging. Claims raised after this window may not be eligible for
            replacement or refund, as damage becomes difficult to verify as transit-related
            versus post-delivery.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-2">8. Cancellations</h2>
          <p>
            Orders for in-stock, standard products may be cancelled within 24 hours of payment,
            provided the order has not already been dispatched. Custom-cut or made-to-order
            items (specific sizes, finishes, or thicknesses cut on request) cannot be cancelled
            once processing has begun, as these are manufactured specifically for your order.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-2">9. Returns</h2>
          <p>
            Standard, unused, in-stock products in original condition may be eligible for
            return within 7 days of delivery, subject to inspection. Return shipping for heavy
            stone products must be arranged by the customer unless the return is due to a
            verified transit-damage or dispatch error on our part. Custom-cut and made-to-order
            products are not eligible for return, except in cases of confirmed transit damage
            or manufacturing defect.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-2">10. Refunds</h2>
          <p>
            Approved refunds are processed back to the original payment method via Razorpay,
            typically within 5–7 business days of approval. Refund timelines beyond this point
            depend on your bank or payment provider's processing time, which is outside our
            control.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-2">11. Contact Us</h2>
          <p>
            For shipping questions, tracking updates, or to report a delivery issue, contact us
            at{' '}
            <a href="mailto:info@gayatrigranites.com" className="text-accent-dark underline">
              info@gayatrigranites.com
            </a>{' '}
            or call +91 98765 43210 (Mon–Sat, 9:00 AM – 7:00 PM).
          </p>
        </section>
      </div>
    </div>
  );
}