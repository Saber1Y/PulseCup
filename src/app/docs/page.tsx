"use client";

import Link from "next/link";
import { IoArrowBack, IoDocumentTextOutline, IoFootball, IoReloadOutline, IoFlash, IoTrophyOutline, IoImageOutline, IoPersonOutline, IoHelpCircleOutline } from "react-icons/io5";

const sections = [
  { id: "getting-started", title: "Getting Started" },
  { id: "live-room", title: "Live Room" },
  { id: "replay-mode", title: "Replay Mode" },
  { id: "challenges", title: "Challenges & Streaks" },
  { id: "recap-cards", title: "Recap Cards" },
  { id: "guest-mode", title: "Guest Mode" },
  { id: "faq", title: "FAQ" },
];

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-8">
      {/* Header */}
      <div className="mb-10">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-xs text-text-secondary transition-colors hover:text-text-primary"
        >
          <IoArrowBack className="text-sm" />
          Back to home
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-coral/10 text-coral">
            <IoDocumentTextOutline className="text-lg" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">PulseCup Docs</h1>
            <p className="text-sm text-text-secondary">How to use PulseCup</p>
          </div>
        </div>
      </div>

      {/* On-page nav */}
      <nav className="mb-10 flex flex-wrap gap-2">
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-secondary transition-all hover:border-coral/30 hover:text-text-primary"
          >
            {s.title}
          </a>
        ))}
      </nav>

      {/* ---- Getting Started ---- */}
      <section id="getting-started" className="mb-14">
        <SectionHeading icon={<IoFootball className="text-base" />} color="coral" title="Getting Started" />
        <div className="space-y-4 text-sm leading-relaxed text-text-secondary">
          <p>
            PulseCup is a mobile-first World Cup companion app.
            It turns live match data into instant fan reactions, streak challenges, and shareable recap cards.
          </p>
          <div className="glass-elevated px-5 py-4">
            <h3 className="mb-2 text-sm font-semibold text-text-primary">Quick start</h3>
            <ol className="list-inside list-decimal space-y-1.5 text-sm text-text-secondary">
              <li>Open the app and browse matches on the <strong className="text-text-primary">Matches</strong> tab.</li>
              <li>Pick a live, upcoming, or finished match.</li>
              <li>React to moments as they happen.</li>
              <li>Answer challenges to build your streak.</li>
              <li>After the match, check your recap card on your <strong className="text-text-primary">Profile</strong>.</li>
            </ol>
          </div>
          <p>
            No sign-up is required.
            PulseCup uses a guest profile stored locally on your device.
          </p>
        </div>
      </section>

      {/* ---- Live Room ---- */}
      <section id="live-room" className="mb-14">
        <SectionHeading icon={<IoFlash className="text-base" />} color="violet" title="Live Room" />
        <div className="space-y-4 text-sm leading-relaxed text-text-secondary">
          <p>
            The Live Room is where you experience a match in real time.
            When a goal, card, corner, or other event occurs, PulseCup surfaces a reaction prompt or challenge.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <FeatureCard
              title="Reaction prompts"
              body="Tap an emoji to react to goals, saves, cards, and momentum shifts. Your reaction is recorded with the match timeline."
              color="coral"
            />
            <FeatureCard
              title="Fan Pulse"
              body="See how other fans are reacting in real time. The pulse bar shows the split across reaction types."
              color="violet"
            />
            <FeatureCard
              title="Challenge cards"
              body="Answer quick yes/no questions about what happens next. Correct answers grow your streak."
              color="gold"
            />
            <FeatureCard
              title="Streak bar"
              body="Track your current streak and fan mood. Higher streaks unlock escalating mood tiers."
              color="mint"
            />
          </div>
          <p>
            Live rooms poll match data every 10 seconds.
            Events are classified and matched to the correct moment in the match timeline.
          </p>
        </div>
      </section>

      {/* ---- Replay Mode ---- */}
      <section id="replay-mode" className="mb-14">
        <SectionHeading icon={<IoReloadOutline className="text-base" />} color="gold" title="Replay Mode" />
        <div className="space-y-4 text-sm leading-relaxed text-text-secondary">
          <p>
            When no live match is available, Replay Mode lets you experience a full match flow using historical event data.
            It works exactly like a live room, but events are played back sequentially.
          </p>
          <div className="glass-elevated px-5 py-4">
            <h3 className="mb-2 text-sm font-semibold text-text-primary">Replay controls</h3>
            <ul className="list-inside list-disc space-y-1.5 text-sm text-text-secondary">
              <li><strong className="text-text-primary">Play / Pause</strong> - Start or pause the replay at any time.</li>
              <li><strong className="text-text-primary">Speed</strong> - Adjust playback speed from 2x to 16x.</li>
              <li><strong className="text-text-primary">Restart</strong> - Jump back to the beginning of the match.</li>
              <li><strong className="text-text-primary">Auto-pause</strong> - The replay pauses automatically when a challenge appears so you can answer.</li>
            </ul>
          </div>
          <p>
            Try the demo replay at <code className="rounded bg-surface px-1.5 py-0.5 text-xs text-coral">/app/replay/1</code> to see how it works.
          </p>
        </div>
      </section>

      {/* ---- Challenges & Streaks ---- */}
      <section id="challenges" className="mb-14">
        <SectionHeading icon={<IoTrophyOutline className="text-base" />} color="mint" title="Challenges & Streaks" />
        <div className="space-y-4 text-sm leading-relaxed text-text-secondary">
          <p>
            Challenges are quick prediction questions triggered by match events.
            Answer correctly to build your streak and climb the mood ladder.
          </p>
          <div className="glass-elevated px-5 py-4">
            <h3 className="mb-3 text-sm font-semibold text-text-primary">Challenge types</h3>
            <div className="space-y-3">
              <ChallengeType
                name="Next Goal"
                description="Predict whether the next event will be a goal."
                example="Will the next event be a goal?"
              />
              <ChallengeType
                name="Total Goals Reach 3"
                description="Predict whether the total goals in the match will reach 3."
                example="Will there be 3 or more goals by the 60th minute?"
              />
              <ChallengeType
                name="Next Major Event"
                description="Predict the next significant event (goal, card, or corner)."
                example="What happens next - a goal, a card, or a corner?"
              />
            </div>
          </div>
          <div className="glass-elevated px-5 py-4">
            <h3 className="mb-3 text-sm font-semibold text-text-primary">Streak mood tiers</h3>
            <div className="space-y-2">
              {[
                { streak: "0-1", mood: "Casual Fan", color: "text-text-secondary" },
                { streak: "2-3", mood: "Getting Warm", color: "text-gold" },
                { streak: "4-5", mood: "Sharp Eye", color: "text-gold" },
                { streak: "6-7", mood: "Chaos Merchant", color: "text-coral" },
                { streak: "8+", mood: "Legend", color: "text-coral" },
              ].map((tier) => (
                <div key={tier.mood} className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">Streak {tier.streak}</span>
                  <span className={`font-semibold ${tier.color}`}>{tier.mood}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---- Recap Cards ---- */}
      <section id="recap-cards" className="mb-14">
        <SectionHeading icon={<IoImageOutline className="text-base" />} color="violet" title="Recap Cards" />
        <div className="space-y-4 text-sm leading-relaxed text-text-secondary">
          <p>
            After a match ends, PulseCup generates a recap card summarizing your performance.
            It includes your final streak, best call, total reactions, and overall fan mood.
          </p>
          <div className="glass-elevated px-5 py-4">
            <h3 className="mb-2 text-sm font-semibold text-text-primary">What is on a recap card</h3>
            <ul className="list-inside list-disc space-y-1.5 text-sm text-text-secondary">
              <li>Final score and match info</li>
              <li>Best streak reached</li>
              <li>Total correct challenge answers</li>
              <li>Number of reactions</li>
              <li>Overall fan mood tier</li>
              <li>Unique shareable link</li>
            </ul>
          </div>
          <p>
            View your recap cards on your <strong className="text-text-primary">Profile</strong> page.
            Share a card by copying its link from the share button.
          </p>
        </div>
      </section>

      {/* ---- Guest Mode ---- */}
      <section id="guest-mode" className="mb-14">
        <SectionHeading icon={<IoPersonOutline className="text-base" />} color="coral" title="Guest Mode" />
        <div className="space-y-4 text-sm leading-relaxed text-text-secondary">
          <p>
            PulseCup does not require an account.
            A guest profile is created automatically and stored in your browser&apos;s local storage.
          </p>
          <div className="glass-elevated px-5 py-4">
            <h3 className="mb-2 text-sm font-semibold text-text-primary">What guest mode means</h3>
            <ul className="list-inside list-disc space-y-1.5 text-sm text-text-secondary">
              <li>No sign-up or login required</li>
              <li>Your reactions, streaks, and recaps are tied to your device</li>
              <li>Clearing browser data will reset your guest profile</li>
              <li>Solana wallet connection is optional and not required</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ---- FAQ ---- */}
      <section id="faq" className="mb-14">
        <SectionHeading icon={<IoHelpCircleOutline className="text-base" />} color="gold" title="FAQ" />
        <div className="space-y-3">
          {[
            {
              q: "Is PulseCup a betting app?",
              a: "No. PulseCup is a social fan experience. There are no wagers, escrow pools, odds trading, or payouts.",
            },
            {
              q: "How does PulseCup get match data?",
              a: "PulseCup uses the TxLINE sports data API to receive live match events, scores, and timelines.",
            },
            {
              q: "Can I use PulseCup during any World Cup match?",
              a: "Yes. PulseCup works with any match available through TxLINE. Live rooms activate when match data is streaming.",
            },
            {
              q: "What happens if I clear my browser data?",
              a: "Your guest profile, reactions, streaks, and recaps are stored locally. Clearing browser data will reset your profile.",
            },
            {
              q: "Is there a Solana wallet requirement?",
              a: "No. Wallet connection is optional. PulseCup works fully in guest mode without any blockchain interaction.",
            },
            {
              q: "How do I share a recap card?",
              a: "After a match, go to your Profile, tap a recap card, and use the share button to copy a unique link.",
            },
          ].map((item) => (
            <details key={item.q} className="glass-elevated group px-5 py-4">
              <summary className="cursor-pointer text-sm font-semibold text-text-primary transition-colors hover:text-coral">
                {item.q}
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Bottom nav back */}
      <div className="border-t border-border pt-8 text-center">
        <Link
          href="/"
          className="text-sm text-text-secondary transition-colors hover:text-text-primary"
        >
          Back to PulseCup
        </Link>
      </div>
    </div>
  );
}

function SectionHeading({ icon, color, title }: { icon: React.ReactNode; color: string; title: string }) {
  const colorMap: Record<string, string> = {
    coral: "bg-coral/10 text-coral",
    violet: "bg-violet/10 text-violet",
    gold: "bg-gold/10 text-gold",
    mint: "bg-mint/10 text-mint",
  };
  return (
    <div className="mb-4 flex items-center gap-3">
      <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${colorMap[color]}`}>
        {icon}
      </div>
      <h2 className="text-lg font-bold">{title}</h2>
    </div>
  );
}

function FeatureCard({ title, body, color }: { title: string; body: string; color: string }) {
  const borderMap: Record<string, string> = {
    coral: "hover:border-coral/30",
    violet: "hover:border-violet/30",
    gold: "hover:border-gold/30",
    mint: "hover:border-mint/30",
  };
  return (
    <div className={`glass-elevated px-4 py-4 transition-all ${borderMap[color]}`}>
      <h3 className="mb-1 text-sm font-semibold text-text-primary">{title}</h3>
      <p className="text-xs leading-relaxed text-text-secondary">{body}</p>
    </div>
  );
}

function ChallengeType({ name, description, example }: { name: string; description: string; example: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface/50 px-4 py-3">
      <h4 className="text-sm font-semibold text-text-primary">{name}</h4>
      <p className="mt-0.5 text-xs text-text-secondary">{description}</p>
      <p className="mt-1 rounded bg-elevated px-2 py-1 text-xs text-text-secondary/70 italic">&quot;{example}&quot;</p>
    </div>
  );
}
