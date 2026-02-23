import { motion } from "framer-motion";

const Privacy = () => (
  <div className="relative min-h-[calc(100vh-4rem)] px-4 py-16">
    <div className="absolute w-80 h-80 rounded-full blur-3xl opacity-10 bg-secondary -top-40 -left-40 animate-float" />

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container max-w-3xl mx-auto"
    >
      <h1 className="font-display text-4xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-muted-foreground mb-10 text-sm">Last updated: February 23, 2026</p>

      <div className="glass-card p-8 md:p-10 space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="font-display text-lg font-semibold text-foreground mb-3">1. Information We Collect</h2>
          <p className="mb-2">We may collect the following types of information:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong className="text-foreground">Account data:</strong> Email address, display name, and gender (if you sign up).</li>
            <li><strong className="text-foreground">Usage data:</strong> Pages visited, features used, and session duration.</li>
            <li><strong className="text-foreground">Device data:</strong> Browser type, operating system, and IP address.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-foreground mb-3">2. What We Do NOT Collect</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>We do <strong className="text-foreground">not</strong> record, store, or monitor your video or audio calls.</li>
            <li>We do <strong className="text-foreground">not</strong> sell your personal data to third parties.</li>
            <li>We do <strong className="text-foreground">not</strong> share your identity with the strangers you connect with.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-foreground mb-3">3. How We Use Your Information</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>To provide and improve the Service.</li>
            <li>To authenticate your account and manage your session.</li>
            <li>To enforce our <a href="/terms" className="text-primary hover:underline">Terms & Conditions</a> and prevent abuse.</li>
            <li>To communicate important updates about the Service.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-foreground mb-3">4. Data Storage & Security</h2>
          <p>Your data is stored securely using industry-standard encryption. We take reasonable measures to protect your information from unauthorized access, alteration, or destruction.</p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-foreground mb-3">5. Cookies</h2>
          <p>We use essential cookies to maintain your session and preferences. We do not use third-party tracking cookies for advertising purposes.</p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-foreground mb-3">6. Third-Party Services</h2>
          <p>We use third-party services (such as authentication and real-time communication providers) to operate the platform. These services have their own privacy policies and may collect limited data as described in their terms.</p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-foreground mb-3">7. Your Rights</h2>
          <p className="mb-2">You have the right to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Access the personal data we hold about you.</li>
            <li>Request correction or deletion of your data.</li>
            <li>Withdraw consent at any time by deleting your account.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-foreground mb-3">8. Children's Privacy</h2>
          <p>Mallu Monkey is not intended for users under <strong className="text-foreground">18 years of age</strong>. We do not knowingly collect data from minors. If we learn that a minor has provided personal information, we will delete it promptly.</p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-foreground mb-3">9. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify users of significant changes through the Service or via email.</p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-foreground mb-3">10. Contact</h2>
          <p>For privacy-related questions, please visit our <a href="/contact" className="text-primary hover:underline">Contact page</a>.</p>
        </section>
      </div>
    </motion.div>
  </div>
);

export default Privacy;
