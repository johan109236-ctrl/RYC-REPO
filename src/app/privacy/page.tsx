export default function PrivacyPage() {
  return (
    <main className="max-w-[800px] mx-auto px-8 py-16 max-[640px]:px-5">
      <h1 className="font-[Cormorant_Garamond,serif] text-4xl font-light text-[var(--text-primary)] mb-3">
        Privacy Policy
      </h1>

      <p className="font-[Montserrat,sans-serif] text-xs text-[var(--text-secondary)] mb-10">
        Last updated: September 18, 2026
      </p>

      <div className="font-[Montserrat,sans-serif] text-sm leading-7 text-[var(--text-secondary)] space-y-8">
        <section>
          <p>
            We respect your privacy and are committed to keeping your personal
            information safe. This Privacy Policy explains what information we
            collect when you use our website and how we use it.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-[var(--text-primary)] mb-3">
            1. Information We Collect
          </h2>

          <p className="mb-3">
            When you place an order, contact us, or use certain features of our
            website, we may collect:
          </p>

          <ul className="list-disc pl-5 space-y-1">
            <li>Name</li>
            <li>Phone number</li>
            <li>Email address</li>
            <li>
              Product and order details you provide when purchasing from us,
              such as your size, color, or other product preferences
            </li>
            <li>Delivery details necessary to process and deliver your order</li>
          </ul>

          <p className="mt-3">
            We only collect information that is reasonably necessary to provide
            our products and services.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-[var(--text-primary)] mb-3">
            2. How We Use Your Information
          </h2>

          <p className="mb-3">We may use your information to:</p>

          <ul className="list-disc pl-5 space-y-1">
            <li>Process and fulfill your orders</li>
            <li>Deliver your purchases</li>
            <li>
              Contact you regarding your order or any issues with your purchase
            </li>
            <li>Respond to your questions or requests</li>
            <li>Improve our website, products, and customer experience</li>
            <li>
              Send promotional emails or updates only if you have chosen to
              subscribe to them
            </li>
          </ul>

          <p className="mt-3">
            You will not receive marketing or promotional emails from us simply
            because you place an order. You can unsubscribe from our marketing
            communications at any time.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-[var(--text-primary)] mb-3">
            3. How We Store and Protect Your Information
          </h2>

          <p>
            We take reasonable steps to protect your personal information from
            unauthorized access, misuse, loss, or disclosure. Your information
            is only retained for as long as necessary to provide our services,
            meet legal requirements, or resolve disputes.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-[var(--text-primary)] mb-3">
            4. Sharing Your Information
          </h2>

          <p>
            We do not sell or rent your personal information.
          </p>

          <p className="mt-3">
            We may share necessary information with trusted service providers,
            such as payment processors, delivery partners, website hosting
            providers, or other services that help us operate our business.
            These parties only receive information necessary to provide their
            services.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-[var(--text-primary)] mb-3">
            5. Cookies
          </h2>

          <p>
            Our website may use cookies or similar technologies to keep the
            website functioning properly, remember preferences, and understand
            how visitors use our website.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-[var(--text-primary)] mb-3">
            6. Your Choices
          </h2>

          <p>
            You may contact us if you would like to ask about, update, or
            correct the personal information we hold about you.
          </p>

          <p className="mt-3">
            If you have subscribed to our emails, you can unsubscribe at any
            time using the unsubscribe option included in our emails.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-[var(--text-primary)] mb-3">
            7. Changes to This Policy
          </h2>

          <p>
            We may update this Privacy Policy from time to time to reflect
            changes to our website, business, or legal requirements. Any
            updates will be posted on this page with a revised "Last updated"
            date.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-[var(--text-primary)] mb-3">
            8. Contact Us
          </h2>

          <p>
            If you have any questions about this Privacy Policy or how we
            handle your information, please contact us through the contact
            details provided on our website.
          </p>
        </section>
      </div>
    </main>
  );
}
