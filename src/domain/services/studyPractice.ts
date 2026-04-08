import {
  QuizAttempt,
  StudyProgress,
  StudyTrack,
  StudyUnit
} from "@/domain/models/types";

export type PracticeMode = "flashcards" | "quiz";

export interface FlashcardPracticeCard {
  id: string;
  front: string;
  back: string;
  hint?: string;
}

export interface QuizPracticeQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topicTags: string[];
}

interface PracticeBaseContent {
  studyUnitId: string;
  mode: PracticeMode;
  summary: string;
  warmupLabel: string;
  focusTags: string[];
}

export interface FlashcardPracticeContent extends PracticeBaseContent {
  mode: "flashcards";
  cards: FlashcardPracticeCard[];
}

export interface QuizPracticeContent extends PracticeBaseContent {
  mode: "quiz";
  questions: QuizPracticeQuestion[];
}

export type StudyPracticeContent = FlashcardPracticeContent | QuizPracticeContent;

export interface StudyPracticeCatalogItem {
  studyUnitId: string;
  studyTrackId: string;
  mode: PracticeMode;
  title: string;
  summary: string;
  trackTitle: string;
  estimatedMinutes: number;
  countLabel: string;
  performanceLabel: string;
  route: { name: string; params: { studyUnitId: string } };
}

const practiceContentByUnitId: Record<string, StudyPracticeContent> = {
  "unit-accounting-terms-cards": {
    studyUnitId: "unit-accounting-terms-cards",
    mode: "flashcards",
    summary:
      "Core accounting language for FBLA competition prep: transaction analysis, journal entries, financial statements, and common objective-test traps.",
    warmupLabel: "Use this set before a scored accounting review block",
    focusTags: ["accounting", "journal entries", "statements", "analysis"],
    cards: [
      {
        id: "acct-card-assets",
        front: "What is the cleanest definition of an asset?",
        back: "An asset is a resource a business owns or controls that is expected to provide future economic benefit."
      },
      {
        id: "acct-card-equation",
        front: "What accounting equation must always stay balanced?",
        back: "Assets = Liabilities + Owner's Equity."
      },
      {
        id: "acct-card-debit-credit",
        front: "How do debits and credits behave in the basic equation?",
        back: "Debits increase assets and expenses, while credits increase liabilities, equity, and revenue."
      },
      {
        id: "acct-card-journal",
        front: "Why are journal entries important in an accounting workflow?",
        back: "They create the first formal record of each transaction before amounts move into ledger balances and statements."
      },
      {
        id: "acct-card-trial-balance",
        front: "What is the purpose of a trial balance?",
        back: "It checks whether total debits equal total credits before financial statements are prepared."
      },
      {
        id: "acct-card-adjusting",
        front: "What is an adjusting entry?",
        back: "An adjusting entry updates account balances at period end so revenue and expenses are recorded in the correct period."
      },
      {
        id: "acct-card-income-statement",
        front: "What does an income statement show?",
        back: "It reports revenue earned and expenses incurred over a period to show net income or net loss."
      },
      {
        id: "acct-card-balance-sheet",
        front: "What does the balance sheet communicate?",
        back: "It shows the business's financial position at one point in time through assets, liabilities, and owner's equity."
      }
    ]
  },
  "unit-accounting-cycle-quiz": {
    studyUnitId: "unit-accounting-cycle-quiz",
    mode: "quiz",
    summary:
      "A scored Accounting checkpoint covering the accounting equation, transaction analysis, adjusting entries, and statement logic.",
    warmupLabel: "Run this set when you want a realistic accounting readiness check",
    focusTags: ["accounting", "equation", "adjusting entries", "financial statements"],
    questions: [
      {
        id: "acct-quiz-1",
        prompt: "A company pays cash to reduce an existing liability. Which statement is correct?",
        options: [
          "Assets decrease and liabilities decrease.",
          "Assets increase and liabilities decrease.",
          "Liabilities decrease and owner's equity increases.",
          "Expenses increase and assets increase."
        ],
        correctIndex: 0,
        explanation: "Cash is an asset, so paying it out lowers assets. Because the debt is being reduced, liabilities also decrease.",
        topicTags: ["equation", "transaction analysis"]
      },
      {
        id: "acct-quiz-2",
        prompt: "What is the main purpose of adjusting entries at the end of an accounting period?",
        options: [
          "To make every account match the bank statement.",
          "To record errors from last year.",
          "To ensure revenues and expenses are recognized in the correct period.",
          "To close permanent accounts."
        ],
        correctIndex: 2,
        explanation: "Adjusting entries support accrual accounting by matching revenues and expenses to the period in which they belong.",
        topicTags: ["adjusting entries"]
      },
      {
        id: "acct-quiz-3",
        prompt: "If total debits equal total credits in the trial balance, what can you conclude?",
        options: [
          "The books are definitely error-free.",
          "The statements have already been prepared correctly.",
          "The debits and credits are numerically balanced, though some errors could still exist.",
          "Net income must be positive."
        ],
        correctIndex: 2,
        explanation: "A balanced trial balance is important, but it does not catch every type of accounting mistake.",
        topicTags: ["trial balance"]
      },
      {
        id: "acct-quiz-4",
        prompt: "Which financial statement is best used to evaluate profitability over a period of time?",
        options: [
          "Balance sheet",
          "Income statement",
          "Statement of owner's equity only",
          "Chart of accounts"
        ],
        correctIndex: 1,
        explanation: "The income statement summarizes revenues and expenses over a period and shows net income or loss.",
        topicTags: ["financial statements"]
      },
      {
        id: "acct-quiz-5",
        prompt: "A business provides a service on account. What immediate effect occurs?",
        options: [
          "Revenue increases and accounts receivable increases.",
          "Cash increases and revenue decreases.",
          "Liabilities increase and cash increases.",
          "Expenses increase and accounts payable increases."
        ],
        correctIndex: 0,
        explanation: "The business earned revenue, but because payment has not been collected yet, accounts receivable increases instead of cash.",
        topicTags: ["transaction analysis", "revenue recognition"]
      }
    ]
  },
  "unit-mobile-talking-points-cards": {
    studyUnitId: "unit-mobile-talking-points-cards",
    mode: "flashcards",
    summary:
      "Judge-facing prompts for Mobile Application Development: architecture choices, validation logic, privacy, and a polished walkthrough explanation.",
    warmupLabel: "Quick confidence pass before a mock round",
    focusTags: ["mobile", "architecture", "validation", "walkthrough flow"],
    cards: [
      {
        id: "mobile-card-architecture",
        front: "How do you explain your app architecture in one clear sentence?",
        back: "Lead with the user flow, then name the layers: interface, data handling, and recommendation logic working together for one member experience.",
        hint: "Avoid sounding like a file tree."
      },
      {
        id: "mobile-card-validation",
        front: "Why does input validation matter in a member-facing app?",
        back: "Validation protects data quality, prevents broken states, and shows judges you designed for real users instead of only the happy path."
      },
      {
        id: "mobile-card-personalization",
        front: "What makes the home dashboard feel personalized?",
        back: "Saved events, current study focus, scoped announcements, and relevant resources all reflect the member's chapter context and recent activity."
      },
      {
        id: "mobile-card-presentation-sequence",
        front: "What is the best presentation order for this project?",
        back: "Open home, show a saved event, jump into linked study and resources, then close with AI or community to prove the ecosystem feels connected."
      },
      {
        id: "mobile-card-privacy",
        front: "How would you answer a question about privacy preferences?",
        back: "Explain that members control profile visibility and notification settings so the app supports personalization without forcing exposure."
      },
      {
        id: "mobile-card-offline",
        front: "What do downloadable resources improve for members?",
        back: "They reduce conference-day friction by keeping important prep materials available even when connectivity is inconsistent."
      }
    ]
  },
  "unit-mobile-validation-quiz": {
    studyUnitId: "unit-mobile-validation-quiz",
    mode: "quiz",
    summary:
      "A scored Mobile Application Development checkpoint focused on validation, polished walkthrough logic, and explaining product decisions under pressure.",
    warmupLabel: "Score your event readiness before the next runthrough",
    focusTags: ["validation", "architecture clarity", "q&a recovery"],
    questions: [
      {
        id: "mobile-quiz-1",
        prompt: "Which answer best explains why a member app should validate onboarding input before saving it?",
        options: [
          "It makes the code shorter.",
          "It protects data quality and prevents broken downstream recommendations.",
          "It guarantees the app never needs updates.",
          "It replaces the need for user testing."
        ],
        correctIndex: 1,
        explanation: "Judges want to hear how validation protects the real user experience, not just the codebase.",
        topicTags: ["validation"]
      },
      {
        id: "mobile-quiz-2",
        prompt: "During a presentation, what is the strongest way to describe the home screen?",
        options: [
          "A list of tabs with a few cards on top.",
          "A dashboard that turns member context into relevant next actions across events, study, resources, and community.",
          "A place to store every piece of data in the app.",
          "Mostly a design showcase."
        ],
        correctIndex: 1,
        explanation: "That answer explains purpose, personalization, and cross-feature integration in one concise line.",
        topicTags: ["architecture clarity"]
      },
      {
        id: "mobile-quiz-3",
        prompt: "If a judge asks why your app links events to study content, what is the best response?",
        options: [
          "It saves time during development.",
          "It proves the app can hold more data.",
          "It helps members move directly from an upcoming competition milestone into the preparation materials that matter most.",
          "It makes the event screen look more full."
        ],
        correctIndex: 2,
        explanation: "The strongest answer is always framed around member value and workflow.",
        topicTags: ["walkthrough flow"]
      },
      {
        id: "mobile-quiz-4",
        prompt: "What is the best recovery move if you blank on a technical answer during Q&A?",
        options: [
          "Rush through a partial answer before the silence gets longer.",
          "Say you do not remember anything about the feature.",
          "Clarify the question, anchor your answer in user value, and explain the design tradeoff you chose.",
          "Switch to an unrelated feature."
        ],
        correctIndex: 2,
        explanation: "A calm, structured recovery shows confidence and product understanding even if the answer is not perfect.",
        topicTags: ["q&a recovery"]
      },
      {
        id: "mobile-quiz-5",
        prompt: "Which presentation moment most clearly shows product polish?",
        options: [
          "Jumping rapidly through screens to show quantity.",
          "Walking through one connected member journey with clear transitions and purpose.",
          "Reading technical notes directly from the slides.",
          "Skipping edge cases to save time."
        ],
        correctIndex: 1,
        explanation: "A connected journey feels intentional and helps judges understand the system rather than isolated screens.",
        topicTags: ["walkthrough flow", "architecture clarity"]
      }
    ]
  }
};

const getLatestAttempt = (quizAttempts: QuizAttempt[], studyUnitId: string) =>
  [...quizAttempts]
    .filter((item) => item.studyUnitId === studyUnitId)
    .sort((left, right) => new Date(right.attemptedAt).getTime() - new Date(left.attemptedAt).getTime())[0] ?? null;

const makeTopicPhrase = (tags: string[]) =>
  tags
    .slice(0, 3)
    .map((tag) => tag.replace(/[_-]/g, " "))
    .join(", ");

const buildFallbackPracticeContent = (studyUnit: StudyUnit, track?: StudyTrack | null): StudyPracticeContent | null => {
  if (studyUnit.unitType !== "flashcards" && studyUnit.unitType !== "quiz") return null;

  const focusTags = [...new Set([...(track?.tags ?? []), studyUnit.title.split(" ")[0].toLowerCase()])].slice(0, 4);
  const focusPhrase = makeTopicPhrase(focusTags);

  if (studyUnit.unitType === "flashcards") {
    return {
      studyUnitId: studyUnit.id,
      mode: "flashcards",
      summary: `${studyUnit.contentRef} This short set gives you another focused way to review the topic quickly.`,
      warmupLabel: `Quick recall set for ${track?.title ?? "this study track"}`,
      focusTags,
      cards: [
        {
          id: `${studyUnit.id}-card-1`,
          front: `What is the main goal of "${studyUnit.title}"?`,
          back: studyUnit.contentRef
        },
        {
          id: `${studyUnit.id}-card-2`,
          front: `Which topic should you emphasize first in ${track?.title ?? "this track"}?`,
          back: focusPhrase
            ? `Lead with ${focusPhrase}, then connect your answer back to the scenario or judging criteria.`
            : "Start with the clearest core concept, then tie it back to the event context."
        },
        {
          id: `${studyUnit.id}-card-3`,
          front: `What makes a practice answer stronger for this set?`,
          back: "A strong answer is concise, accurate, and tied to a realistic FBLA competition or leadership scenario."
        },
        {
          id: `${studyUnit.id}-card-4`,
          front: `How should you use this set before a meeting, conference, or mock round?`,
          back: "Run one fast pass for recall, then pause on any prompt that still feels shaky and turn it into a focused retry."
        }
      ]
    };
  }

  return {
    studyUnitId: studyUnit.id,
    mode: "quiz",
    summary: `${studyUnit.contentRef} This quiz offers a fast checkpoint for the topic and keeps the library well-rounded.`,
    warmupLabel: `Checkpoint quiz for ${track?.title ?? "this study track"}`,
    focusTags,
    questions: [
      {
        id: `${studyUnit.id}-question-1`,
        prompt: `Which choice best reflects the focus of "${studyUnit.title}"?`,
        options: [
          studyUnit.contentRef,
          "Memorizing unrelated chapter facts only.",
          "Skipping the event context and guessing what sounds professional.",
          "Treating every scenario exactly the same."
        ],
        correctIndex: 0,
        explanation: "The best answer is the one that matches the unit focus and keeps the practice grounded in the actual topic.",
        topicTags: focusTags.length ? focusTags : ["review"]
      },
      {
        id: `${studyUnit.id}-question-2`,
        prompt: `What is the strongest way to improve after a miss in this practice set?`,
        options: [
          "Ignore the miss if the wording felt tricky.",
          "Review the explanation, identify the weak topic, and retry with a clearer rule in mind.",
          "Jump to a different event immediately.",
          "Memorize only the letter choice."
        ],
        correctIndex: 1,
        explanation: "A good practice loop identifies the underlying concept, not just the answer key.",
        topicTags: focusTags.length ? focusTags : ["review strategy"]
      },
      {
        id: `${studyUnit.id}-question-3`,
        prompt: `Why is this quiz useful before an FBLA event or leadership milestone?`,
        options: [
          "It replaces the need for any other preparation.",
          "It gives a quick read on understanding so you can target weak spots before the real performance.",
          "It guarantees a top placement by itself.",
          "It is only for filling time."
        ],
        correctIndex: 1,
        explanation: "Short quizzes are most valuable when they show where your prep still needs attention.",
        topicTags: focusTags.length ? focusTags : ["readiness"]
      }
    ]
  };
};

export const getStudyPracticeContent = (
  studyUnitId: string,
  options?: { unit?: StudyUnit | null; track?: StudyTrack | null }
) =>
  practiceContentByUnitId[studyUnitId] ??
  (options?.unit ? buildFallbackPracticeContent(options.unit, options.track) : null);

export const hasStudyPracticeContent = (
  studyUnitId: string,
  options?: { unit?: StudyUnit | null; track?: StudyTrack | null }
) => Boolean(getStudyPracticeContent(studyUnitId, options));

export const formatPracticeModeLabel = (mode: PracticeMode) =>
  mode === "flashcards" ? "Flashcards" : "Quiz";

export const buildStudyPracticeCatalog = ({
  mode,
  studyTrackId,
  tracks,
  units,
  progress,
  quizAttempts
}: {
  mode: PracticeMode;
  studyTrackId?: string;
  tracks: StudyTrack[];
  units: StudyUnit[];
  progress: StudyProgress[];
  quizAttempts: QuizAttempt[];
}): StudyPracticeCatalogItem[] =>
  units
    .filter((item) => item.unitType === mode)
    .filter((item) => (studyTrackId ? item.studyTrackId === studyTrackId : true))
    .sort((left, right) => {
      const leftProgress = progress.find((item) => item.studyTrackId === left.studyTrackId)?.progressPercent ?? 0;
      const rightProgress = progress.find((item) => item.studyTrackId === right.studyTrackId)?.progressPercent ?? 0;
      if (rightProgress !== leftProgress) return rightProgress - leftProgress;
      return left.sequenceOrder - right.sequenceOrder;
    })
    .map((unit) => {
      const content = getStudyPracticeContent(unit.id);
      const track = tracks.find((item) => item.id === unit.studyTrackId);
      const resolvedContent = getStudyPracticeContent(unit.id, { unit, track });
      const latestAttempt = unit.unitType === "quiz" ? getLatestAttempt(quizAttempts, unit.id) : null;

      return {
        studyUnitId: unit.id,
        studyTrackId: unit.studyTrackId,
        mode,
        title: unit.title,
        summary: resolvedContent?.summary ?? unit.contentRef,
        trackTitle: track?.title ?? "Study track",
        estimatedMinutes: unit.estimatedMinutes,
        countLabel:
          resolvedContent?.mode === "flashcards"
            ? `${resolvedContent.cards.length} cards`
            : resolvedContent?.mode === "quiz"
              ? `${resolvedContent.questions.length} questions`
              : `${unit.estimatedMinutes} min`,
        performanceLabel:
          mode === "quiz"
            ? latestAttempt
              ? `Latest score ${latestAttempt.scorePercent}%`
              : "No attempt yet"
            : progress.find((item) => item.studyTrackId === unit.studyTrackId)
              ? `${progress.find((item) => item.studyTrackId === unit.studyTrackId)?.progressPercent ?? 0}% track progress`
              : "Fresh set",
        route: { name: "StudyPracticeDetail", params: { studyUnitId: unit.id } }
      };
    });
