import { motion } from "framer-motion";

const Terms = () => (
  <div className="relative min-h-[calc(100vh-4rem)] px-4 py-16">
    <div className="absolute w-80 h-80 rounded-full blur-3xl opacity-10 bg-primary -top-40 -right-40 animate-float" />

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container max-w-3xl mx-auto"
    >
      <h1 className="font-display text-4xl font-bold mb-2">Terms & Conditions</h1>
      <p className="text-muted-foreground mb-10 text-sm">Last updated: February 23, 2026</p>

      <div className="glass-card p-8 md:p-10 space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="font-display text-lg font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
          <p>By accessing or using Mallu Monkey ("the Service"), you agree to be bound by these Terms & Conditions. If you do not agree, do not use the Service.</p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-foreground mb-3">2. Eligibility</h2>
          <p>You must be at least <strong className="text-foreground">18 years old</strong> to use Mallu Monkey. By using the Service, you confirm that you meet this age requirement. We reserve the right to terminate accounts of users who are found to be underage.</p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-foreground mb-3">3. Prohibited Content & Behavior</h2>
          <p className="mb-3">You agree <strong className="text-foreground">NOT</strong> to:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong className="text-destructive">Display nudity or sexual content</strong> — Showing naked body parts, engaging in sexual acts, or any form of sexual content is <strong className="text-destructive">strictly prohibited</strong> and will result in an immediate permanent ban.</li>
            <li>Harass, bully, threaten, or intimidate other users.</li>
            <li>Share illegal, violent, or harmful content of any kind.</li>
            <li>Impersonate another person or entity.</li>
            <li>Use the Service to distribute spam, malware, or phishing attempts.</li>
            <li>Record, screenshot, or redistribute another user's video or audio without their explicit consent.</li>
            <li>Engage in any activity that violates local, national, or international law.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-foreground mb-3">4. Content Moderation & Enforcement</h2>
          <p>Mallu Monkey reserves the right to monitor, review, and remove content or users that violate these terms. Violations may result in:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Immediate disconnection from the current chat.</li>
            <li>Temporary or permanent suspension of your account/access.</li>
            <li>Reporting to law enforcement authorities where applicable.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-foreground mb-3">5. User Responsibility</h2>
          <p>You are solely responsible for your conduct and any content you share during video chats. Mallu Monkey is not liable for any interactions between users.</p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-foreground mb-3">6. Privacy</h2>
          <p>Your use of the Service is also governed by our <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>. Please review it to understand how we handle your data.</p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-foreground mb-3">7. Disclaimer of Warranties</h2>
          <p>The Service is provided "as is" without warranties of any kind. We do not guarantee uninterrupted, secure, or error-free operation of the Service.</p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-foreground mb-3">8. Limitation of Liability</h2>
          <p>Mallu Monkey shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of the Service.</p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-foreground mb-3">9. Changes to Terms</h2>
          <p>We reserve the right to update these Terms at any time. Continued use of the Service after changes constitutes acceptance of the updated Terms.</p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-foreground mb-3">10. Contact</h2>
          <p>If you have questions about these Terms, please visit our <a href="/contact" className="text-primary hover:underline">Contact page</a>.</p>
        </section>
      </div>
    </motion.div>
  </div>
);

export default Terms;
