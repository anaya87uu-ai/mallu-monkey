import { motion } from "framer-motion";
import { Shield } from "lucide-react";

const sections = [
  { id: "1", title: "Information We Collect", body: (
    <>
      <p className="mb-2">We may collect the following types of information:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li><strong className="text-foreground">Account data:</strong> Email address, display name, and gender (if you sign up).</li>
        <li><strong className="text-foreground">Usage data:</strong> Pages visited, features used, and session duration.</li>
        <li><strong className="text-foreground">Device data:</strong> Browser type, operating system, and IP address.</li>
      </ul>
    </>
  )},
  { id: "2", title: "What We Do NOT Collect", body: (
    <ul className="list-disc pl-5 space-y-1">
      <li>We do <strong className="text-foreground">not</strong> record, store, or monitor your video or audio calls.</li>
      <li>We do <strong className="text-foreground">not</strong> sell your personal data to third parties.</li>
      <li>We do <strong className="text-foreground">not</strong> share your identity with the strangers you connect with.</li>
    </ul>
  )},
  { id: "3", title: "How We Use Your Information", body: (
    <ul className="list-disc pl-5 space-y-1">
      <li>To provide and improve the Service.</li>
      <li>To authenticate your account and manage your session.</li>
      <li>To enforce our <a href="/terms" className="text-primary hover:underline">Terms & Conditions</a> and prevent abuse.</li>
      <li>To communicate important updates about the Service.</li>
    </ul>
  )},
  { id: "4", title: "Data Storage & Security", body: <p>Your data is stored securely using industry-standard encryption. We take reasonable measures to protect your information from unauthorized access, alteration, or destruction.</p> },
  { id: "5", title: "Cookies", body: <p>We use essential cookies to maintain your session and preferences. We do not use third-party tracking cookies for advertising purposes.</p> },
  { id: "6", title: "Third-Party Services", body: <p>We use third-party services (such as authentication and real-time communication providers) to operate the platform. These services have their own privacy policies and may collect limited data as described in their terms.</p> },
  { id: "7", title: "Your Rights", body: (
    <>
      <p className="mb-2">You have the right to:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Access the personal data we hold about you.</li>
        <li>Request correction or deletion of your data.</li>
        <li>Withdraw consent at any time by deleting your account.</li>
      </ul>
    </>
  )},
  { id: "8", title: "Children's Privacy", body: <p>Mallu Monkey is not intended for users under <strong className="text-foreground">18 years of age</strong>. We do not knowingly collect data from minors. If we learn that a minor has provided personal information, we will delete it promptly.</p> },
  { id: "9", title: "Changes to This Policy", body: <p>We may update this Privacy Policy from time to time. We will notify users of significant changes through the Service or via email.</p> },
  { id: "10", title: "Contact", body: <p>For privacy-related questions, please visit our <a href="/contact" className="text-primary hover:underline">Contact page</a>.</p> },
];

const Privacy = () => (
  <div className="relative min-h-[calc(100vh-4rem)] px-4 py-16">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container max-w-4xl mx-auto"
    >
      <div className="text-center mb-10">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-5 glow-primary">
          <Shield className="w-7 h-7 text-primary-foreground" />
        </div>
        <h1 className="display-lg text-foreground mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground text-sm">Last updated: February 23, 2026</p>
      </div>

      <div className="grid lg:grid-cols-[200px_1fr] gap-8">
        {/* Sub-nav */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 glass-panel p-4">
            <p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground mb-3">Sections</p>
            <nav className="flex flex-col gap-1">
              {sections.map((s) => (
                <a key={s.id} href={`#sec-${s.id}`} className="text-xs text-muted-foreground hover:text-primary py-1.5 px-2 rounded-md hover:bg-mint/40 transition-colors">
                  {s.id}. {s.title}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        <div className="glass-panel p-8 md:p-10 space-y-8 text-sm leading-relaxed text-muted-foreground">
          {sections.map((s) => (
            <section key={s.id} id={`sec-${s.id}`} className="scroll-mt-24">
              <h2 className="font-display text-lg font-semibold text-foreground mb-3">{s.id}. {s.title}</h2>
              {s.body}
            </section>
          ))}
        </div>
      </div>
    </motion.div>
  </div>
);

export default Privacy;
