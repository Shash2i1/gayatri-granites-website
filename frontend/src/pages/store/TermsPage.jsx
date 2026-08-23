import { Link } from 'react-router-dom';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-10 md:py-14">
      <div className="text-xs text-muted mb-4">
        <Link to="/" className="hover:text-primary">Home</Link> / <span className="text-primary">Terms & Conditions</span>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold">Terms & Conditions</h1>
      <p className="text-sm text-muted mt-2">Last updated: August 2026</p>

      <div className="prose-sm max-w-none mt-8 space-y-8 text-sm leading-relaxed text-primary/90">
        <section>
          <h2 className="text-lg font-bold mb-2">1. Introduction</h2>
          <p>
            These Terms & Conditions govern your use of the Gayatri Granites website and your
            purchase of any products through it. By placing an order with us, you agree to be
            bound by these terms. Please read them carefully before making a purchase.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-2">2. Products & Natural Variation</h2>
          <p>
            Gayatri Granites deals in natural stone (granite, marble) as well as manufactured
            tiles (ceramic, vitrified, porcelain). Natural stone is a product of nature — colour,
            veining, pattern, and grain will vary from slab to slab and may differ from the
            images shown on this website. Such variation is a natural characteristic of the
            material and is not considered a defect.
          </p>
          <p className="mt-2">
            Where custom sizes, cutting, or finishing are requested, minor variations in
            dimension (typically within industry-standard tolerances) may occur during
            processing.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-2">3. Pricing & Payment</h2>
          <p>
            All prices listed are in Indian Rupees (₹) and are subject to applicable GST and
            SGST, which will be clearly shown at checkout before payment. Prices for natural
            stone products may be revised without prior notice due to fluctuations in quarry
            and raw material costs; the price confirmed at the time of checkout is the price
            that applies to your order.
          </p>
          <p className="mt-2">
            Payments are processed securely through Razorpay. We do not store your card,
            UPI, or net-banking credentials on our servers.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-2">4. Order Confirmation</h2>
          <p>
            An order is confirmed only after successful payment. You will receive an order
            confirmation with an order ID once payment is verified. Orders are not held or
            reserved prior to successful payment.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-2">5. Cancellations & Returns</h2>
          <p>
            Due to the nature of our products — heavy, often custom-cut, and finished to
            order — cancellation and return policies differ from typical retail goods. Please
            refer to our{' '}
            <Link to="/shipping-policy" className="text-accent-dark underline">
              Shipping & Returns Policy
            </Link>{' '}
            for full details on cancellations, damaged-in-transit claims, and refund timelines.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-2">6. Delivery & Risk</h2>
          <p>
            Ownership and risk in the goods passes to the customer upon delivery to the address
            provided at checkout. It is the customer's responsibility to ensure someone is
            available to receive heavy/bulk shipments, and that the delivery location is
            accessible to transport vehicles.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-2">7. Installation & Use</h2>
          <p>
            Gayatri Granites supplies materials only, unless installation services are
            explicitly agreed to separately in writing. We are not responsible for issues
            arising from installation carried out by third parties, including improper sealing,
            grouting, or structural preparation.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-2">8. Limitation of Liability</h2>
          <p>
            To the extent permitted by law, Gayatri Granites' liability for any claim relating
            to a purchase is limited to the value of the product(s) in question. We are not
            liable for indirect, incidental, or consequential loss, including delays caused by
            third-party logistics providers beyond our control.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-2">9. Intellectual Property</h2>
          <p>
            All content on this website — including product images, descriptions, logos, and
            design — is the property of Gayatri Granites and may not be reproduced or used
            without prior written consent.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-2">10. Governing Law</h2>
          <p>
            These terms are governed by the laws of India. Any disputes arising from your use
            of this website or purchases made through it shall be subject to the exclusive
            jurisdiction of the courts having jurisdiction over our registered place of
            business.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-2">11. Contact Us</h2>
          <p>
            For any questions regarding these Terms & Conditions, please contact us at{' '}
            <a href="mailto:info@gayatrigranites.com" className="text-accent-dark underline">
              info@gayatrigranites.com
            </a>{' '}
            or call +91 98765 43210.
          </p>
        </section>
      </div>
    </div>
  );
}