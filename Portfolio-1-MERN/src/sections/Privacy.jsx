export const Privacy = () => {
  return (
    <section className="min-h-screen bg-paper px-4 py-24 text-ink sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <p className="font-mono text-sm font-bold uppercase tracking-[0.12em] text-muted">
          Legal
        </p>

        <h1
          id="privacy-page-title"
          tabIndex={-1}
          className="mt-4 font-display text-5xl font-black uppercase leading-none sm:text-6xl lg:text-7xl"
        >
          Privacy Policy
        </h1>

        <p className="mt-6 text-lg leading-8 text-muted">
          Last updated: August 23, 2026
        </p>

        <div className="mt-12 space-y-10 text-base leading-8">
          <section>
            <h2 className="font-display text-3xl font-bold uppercase">
              1. Introduction
            </h2>
            <p className="mt-4">
              This Privacy Policy explains how Rohit Singh Pokhariya and the
              Invoice Reminder application collect, use, store, and protect
              information when users interact with our website and services.
            </p>
          </section>

          <section>
            <h2 className="font-display text-3xl font-bold uppercase">
              2. Information We Collect
            </h2>
            <p className="mt-4">
              We may collect information provided by businesses using the
              application, including business contact information, customer
              names, customer phone numbers, invoice information, payment
              reminder details, and WhatsApp Business account information
              required to provide messaging functionality.
            </p>
          </section>

          <section>
            <h2 className="font-display text-3xl font-bold uppercase">
              3. WhatsApp Business Data
            </h2>
            <p className="mt-4">
              When a business connects its WhatsApp Business account, we may
              process identifiers and authorization information necessary to
              connect with the WhatsApp Business Platform and send authorized
              business messages on behalf of that business.
            </p>
          </section>

          <section>
            <h2 className="font-display text-3xl font-bold uppercase">
              4. How We Use Information
            </h2>
            <p className="mt-4">
              Information is used only to operate and improve the service,
              manage customers and invoices, send requested payment reminders,
              maintain messaging integrations, provide support, and protect the
              security and reliability of the application.
            </p>
          </section>

          <section>
            <h2 className="font-display text-3xl font-bold uppercase">
              5. Third-Party Services
            </h2>
            <p className="mt-4">
              The application may use third-party service providers, including
              Meta and the WhatsApp Business Platform, to provide messaging
              functionality. Information may be processed by these providers
              according to their own terms and privacy policies.
            </p>
          </section>

          <section>
            <h2 className="font-display text-3xl font-bold uppercase">
              6. Data Security
            </h2>
            <p className="mt-4">
              We use reasonable technical and organizational measures to
              protect information against unauthorized access, disclosure,
              alteration, or loss. Sensitive credentials and access tokens are
              not intended to be exposed publicly.
            </p>
          </section>

          <section>
            <h2 className="font-display text-3xl font-bold uppercase">
              7. Data Retention and Deletion
            </h2>
            <p className="mt-4">
              We retain information only for as long as reasonably necessary to
              provide the service, meet legal obligations, resolve disputes,
              and maintain security. Users may request deletion of their
              information by contacting us.
            </p>
          </section>

          <section>
            <h2 className="font-display text-3xl font-bold uppercase">
              8. Contact
            </h2>
            <p className="mt-4">
              For privacy questions or data deletion requests, contact:
            </p>
            <a
              href="mailto:rohit.pokhariya123@gmail.com"
              className="mt-2 inline-block font-bold underline underline-offset-4"
            >
              rohit.pokhariya123@gmail.com
            </a>
          </section>
        </div>
      </div>
    </section>
  );
};