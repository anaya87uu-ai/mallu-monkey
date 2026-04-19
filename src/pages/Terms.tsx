import { motion } from "framer-motion";
import { ScrollText } from "lucide-react";

const sections = [
  { id: "1", title: "Acceptance of Terms", body: <p>By accessing or using Mallu Monkey ("the Service"), you agree to be bound by these Terms & Conditions. If you do not agree, do not use the Service.</p> },
  { id: "2", title: "Eligibility", body: <p>You must be at least <strong className="text-foreground">18 years old</strong> to use Mallu Monkey. By using the Service, you confirm that you meet this age requirement. We reserve the right to terminate accounts of users who are found to be underage.</p> },
  { id: "3", title: "Prohibited Content & Behavior", body: (
    <>
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
    </>
  )},
  { id: "4", title: "Content Moderation & Enforcement", body: (
    <>
      <p>Mallu Monkey reserves the right to monitor, review, and remove content or users that violate these terms. Violations may result in:</p>
      <ul className="list-disc pl-5 space-y-1 mt-2">
        <li>Immediate disconnection from the current chat.</li>
        <li>Temporary or permanent suspension of your account/access.</li>
        <li>Reporting to law enforcement authorities where applicable.</li>
      </ul>
    </>
  )},
  { id: "5", title: "User Responsibility", body: <p>You are solely responsible for your conduct and any content you share during video chats. Mallu Monkey is not liable for any interactions between users.</p> },
  { id: "6", title: "Privacy", body: <p>Your use of the Service is also governed by our <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>. Please review it to understand how we handle your data.</p> },
  { id: "7", title: "Disclaimer of Warranties", body: <p>The Service is provided "as is" without warranties of any kind. We do not guarantee uninterrupted, secure, or error-free operation of the Service.</p> },
  { id: "8", title: "Limitation of Liability", body: <p>Mallu Monkey shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of the Service.</p> },
  { id: "9", title: "Changes to Terms", body: <p>We reserve the right to update these Terms at any time. Continued use of the Service after changes constitutes acceptance of the updated Terms.</p> },
  { id: "10", title: "Contact", body: <p>If you have questions about these Terms, please visit our <a href="/contact" className="text-primary hover:underline">Contact page</a>.</p> },
];

const Terms = () => (
  <div className="relative min-h-[calc(100vh-4rem)] px-4 py-16">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container max-w-4xl mx-auto"
    >
      <div className="text-center mb-10">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-5 glow-primary">
          <ScrollText className="w-7 h-7 text-primary-foreground" />
        </div>
        <h1 className="display-lg text-foreground mb-2">Terms & Conditions</h1>
        <p className="text-muted-foreground text-sm">Last updated: February 23, 2026</p>
      </div>

      <div className="grid lg:grid-cols-[200px_1fr] gap-8">
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

export default Terms;
