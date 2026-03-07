export const EXPERIENCES = [
  {
    id: "safety-violation-charge",
    title: "The 3 AM Decision",
    subtitle: "Reporting a Friend — Charge Nurse Safety Accountability",
    category: "Ethical Dilemma",
    competencies: ["Patient Safety", "Integrity", "Ethical Decision-Making", "Leadership Under Pressure", "Accountability", "Emotional Regulation"],
    difficulty: "high",
    date: "2024",
    setting: "TNICU — Charge Nurse",
    tags: ["ethical-dilemma", "patient-safety", "leadership", "accountability", "conflict", "integrity"],
    interviewQuestions: [
      "Tell me about a time your integrity was tested",
      "Describe a situation where you prioritized patient safety over personal relationships",
      "Give an example of a difficult ethical decision you made as a leader",
      "How do you handle situations where doing the right thing comes at a personal cost?",
      "Tell me about a time you had to report a colleague",
      "How do you demonstrate accountability in your practice?",
      "Describe a time you experienced moral distress and how you managed it",
      "What does patient advocacy mean to you — give a real example",
    ],
    star: {
      situation: `At 3 AM during a charge shift, a trusted colleague pulled me into an empty room and disclosed a serious safety violation. She told me the outgoing nurse — someone I considered one of my closest friends on the unit — had pulled a medication from the Omnicell under one patient's name and administered it to a different patient, bypassing the scan, bypassing the order process, and bypassing every safety checkpoint the system is designed for. She acted unilaterally because she felt the provider wasn't responding quickly enough.

My colleague came to me specifically — not because I was just the charge nurse, but because she told me directly: "I'm telling you because I respect your judgment, because you would actually do something about it, and because I trust you." When I first heard that, two things happened simultaneously: I felt confirmation that I had been leading the way I intended to lead — and I felt the full weight of what I was now responsible for.`,

      task: `As charge nurse, I had to decide what to do with information that could end the career of someone I genuinely cared about. The easy path was to look the other way — it was only Zofran, the patient was not harmed, the night was already long, and no one else knew. But that was never actually an option.

My role as a charge nurse exists precisely because someone believed I could separate personal relationships from what is right. I had to honor that. Two paths existed: ignore it, or act. A leader only has one of those options.`,

      action: `First, I thanked my colleague and reassured her. I told her the only other person who needed to know was our manager, Brandy — and she understood and agreed.

Then I went to verify independently, without alerting anyone on the unit. I pulled the Omnicell print receipts — medications pulled versus medications administered — and cross-referenced them against the medical record. I did this quietly, methodically, and without assumption. Unfortunately, what my colleague had told me was confirmed.

Because I was working nights and knew that fatigue and time could distort recall, I documented everything in real time as it was happening — a detailed written account of what I was told, what I found, and what I did, in exact sequence. I wanted no version of events that could shift. No gaps that could create doubt.

I then emailed my manager immediately and requested a serious conversation. From there, I met with her, then with HR, then with the director of critical care nursing. Each time, I gave the same account — consistent, documented, and complete. Nothing changed between tellings because I had written it all down when it was fresh.`,

      result: `The situation was escalated and handled through the proper institutional channels. For me personally, this was one of the hardest things I have done as a leader — not because of the process, but because of who was involved.

What I want any interviewer to hear is this: the principle was what mattered, not the medication. Zofran carries pharmacologic properties that can affect cardiac rhythm — QT prolongation, hypotension, and interaction risk are not trivial. But more importantly, if a nurse is willing to bypass every safety mechanism for something minor, what does that mean when the stakes are higher? We are the last line of defense for our patients. Not the order system. Not the Omnicell. Us.

I did not report my colleague out of anger or self-interest. I reported her because I cared about her — and because allowing it to continue would have been the greater harm, both to future patients and to her.`
    },
    keyThemes: [
      {
        label: "Principles govern practice",
        detail: "The magnitude of the violation does not determine whether you act. The violation of the principle does. An antiemetic administered unsafely today becomes a vasopressor administered unsafely tomorrow."
      },
      {
        label: "Leadership means separating personal from professional",
        detail: "The nurse who came to me chose me because she trusted I could do exactly this. That trust is only earned if you follow through even when it costs you."
      },
      {
        label: "Trust but verify",
        detail: "You do not act on a secondhand account alone. Pull the Omnicell receipts. Cross-reference the MAR. Document in real time. Let the evidence speak."
      },
      {
        label: "Documentation as a clinical skill",
        detail: "Working nights creates cognitive drift. Real-time documentation is not administrative overhead — it is a patient safety tool and a leadership tool simultaneously."
      },
      {
        label: "Accountability as an act of care",
        detail: "Allowing this to continue would have been the larger harm. Reporting was not punishment — it was the only intervention that gave this nurse a chance to correct course before something irreversible happened."
      }
    ],
    followUpQs: [
      {
        q: "How did that affect your relationship with the nurse you reported?",
        a: "I had to accept that the relationship might not survive this, and that I could not let that possibility change my decision. What I found was that this is exactly the tension leadership asks you to carry — not to be indifferent to it, but to not let it govern you. I still care about her as a person. I acted because I cared about her and about the patients she would continue to care for."
      },
      {
        q: "What if the medication had been something more dangerous?",
        a: "The pharmacology would have escalated the urgency, but the decision framework would not have changed. Principles do not scale with risk. If anything, that question reinforces exactly why the principle had to be enforced at the Zofran level — because the habit of bypassing safety systems does not stop at antiemetics."
      },
      {
        q: "How do you handle the moral distress that came with this?",
        a: "I sat with it. I did not try to suppress it or rationalize it away. The discomfort was appropriate — it confirmed that I took the weight of the decision seriously. What I focused on was the process: did I verify before I acted? Did I document accurately? Did I report through the right channels? If the process was sound, then the outcome, however painful, was right."
      },
      {
        q: "As a future CRNA, how does this apply to your practice?",
        a: "Directly. In anesthesia, the margin for improvisation around safety systems is essentially zero. The entire edifice of patient safety in the OR — pre-op checklists, time-outs, medication verification, controlled substance accountability — exists because improvisation kills people in high-stakes environments. What this experience taught me is that I will not look away from a safety violation because the violator is someone I like. That standard applies to any colleague in any setting, including the OR."
      }
    ],
    whyItWorks: "This story is unusual in the CRNA interview landscape because most candidates present themselves as the person who identified a problem, escalated it, and saw it resolved cleanly. This story shows something harder: you faced a conflict between loyalty and principle, under conditions designed to make inaction feel easy, and you chose the right thing not because it was comfortable but because it was right. Programs selecting future CRNAs are selecting people who will be alone in a room with a patient under anesthesia where no one is watching. This story answers the question they cannot directly ask: can I trust you when no one is looking?"
  }
];
