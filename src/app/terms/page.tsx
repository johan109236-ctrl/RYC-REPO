export default function TermsPage() {
  return (
    <main className="max-w-[800px] mx-auto px-8 py-16 max-[640px]:px-5">
      <h1 className="font-[Cormorant_Garamond,serif] text-4xl font-light text-[var(--text-primary)] mb-3">
        Terms & Conditions
      </h1>

      <p className="font-[Montserrat,sans-serif] text-xs text-[var(--text-secondary)] mb-10">
        Last updated: September 18, 2026
      </p>

      <div className="font-[Montserrat,sans-serif] text-sm leading-7 text-[var(--text-secondary)] space-y-8">
        <section>
          <p>
            Welcome to our website. By accessing or using our website, you agree
            to these Terms & Conditions. Please read them carefully before
            placing an order.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-[var(--text-primary)] mb-3">
            1. Using Our Website
          </h2>

          <p>
            You may use our website for lawful purposes and for purchasing our
            products. You agree not to misuse the website, interfere with its
            operation, or attempt to gain unauthorized access to any part of
            it.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-[var(--text-primary)] mb-3">
            2. Products & Availability
          </h2>

          <p>
            We make every effort to ensure that product descriptions, images,
            colors, sizes, and prices displayed on our website are accurate.
            However, colors may appear slightly different depending on your
            device or screen.
          </p>

          <p className="mt-3">
            Product availability may change without notice. We reserve the
            right to limit quantities or discontinue products at any time.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-[var(--text-primary)] mb-3">
            3. Orders
          </h2>

          <p>
            When you place an order, you are providing an offer to purchase the
            selected products. An order is considered accepted once we confirm
            it.
          </p>

          <p className="mt-3">
            We reserve the right to cancel or refuse an order in cases such as
            incorrect pricing, product unavailability, suspected fraudulent
            activity, or other circumstances that prevent us from fulfilling
            the order.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-[var(--text-primary)] mb-3">
            4. Pricing & Payment
          </h2>

          <p>
            All prices displayed on our website are shown at the time of
            purchase. Prices may change without prior notice.
          </p>

          <p className="mt-3">
            Payment must be completed using the payment methods available on
            our website. We are not responsible for delays or issues caused by
            third-party payment providers.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-[var(--text-primary)] mb-3">
            5. Shipping & Delivery
          </h2>

          <p>
            We will make reasonable efforts to ship and deliver your order
            within the estimated delivery time shown at checkout. Delivery
            times may vary depending on your location, courier services,
            weather, or other circumstances outside our control.
          </p>

          <p className="mt-3">
            Once an order has been handed over to the delivery provider, delays
            caused by the courier may be outside our control.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-[var(--text-primary)] mb-3">
            6. Returns & Exchanges
          </h2>

          <p>
            Returns and exchanges are subject to our Return & Exchange Policy.
            Please review that policy before making a purchase.
          </p>

          <p className="mt-3">
            Products must meet the conditions specified in our Return & Exchange
            Policy in order to be eligible for a return or exchange.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-[var(--text-primary)] mb-3">
            7. Intellectual Property
          </h2>

          <p>
            All content on this website, including images, photographs, logos,
            graphics, text, designs, and other materials, belongs to us or is
            used with permission. You may not copy, reproduce, distribute, or
            use our content without our permission.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-[var(--text-primary)] mb-3">
            8. Limitation of Liability
          </h2>

          <p>
            We will not be responsible for losses or damages resulting from
            circumstances beyond our reasonable control, including website
            interruptions, delivery delays, technical issues, or third-party
            service failures.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-[var(--text-primary)] mb-3">
            9. Changes to These Terms
          </h2>

          <p>
            We may update these Terms & Conditions from time to time. Any
            changes will be posted on this page with a revised "Last updated"
            date. Your continued use of the website after changes are posted
            means you accept the updated terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-[var(--text-primary)] mb-3">
            10. Contact Us
          </h2>

          <p>
            If you have any questions about these Terms & Conditions, please
            contact us through the contact details provided on our website.
          </p>
        </section>
      </div>
    </main>
  );
}
