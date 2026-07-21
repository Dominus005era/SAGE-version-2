import { GoogleGenAI, Type } from "@google/genai";
import { Category, KnowledgeItem } from "../types";

const getApiKey = () => {
  try {
    return (import.meta as any).env?.VITE_GEMINI_API_KEY || (import.meta as any).env?.GEMINI_API_KEY || process.env.GEMINI_API_KEY || "";
  } catch (e) {
    return process.env.GEMINI_API_KEY || "";
  }
};

interface SeenCardRecord {
  id: string;
  title: string;
  category: string;
  mode: string;
  seenAt: number;
}

function getSeenCards(): SeenCardRecord[] {
  try {
    const raw = localStorage.getItem("sage_seen_cards_v2");
    if (!raw) return [];
    const parsed: SeenCardRecord[] = JSON.parse(raw);
    const ThirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
    const now = Date.now();
    return parsed.filter(r => (now - r.seenAt) < ThirtyDaysMs);
  } catch (e) {
    return [];
  }
}

function markCardSeen(card: KnowledgeItem) {
  try {
    const seen = getSeenCards();
    const key = `${card.type}:${card.category}:${card.title}`.toLowerCase();
    const updated = [
      ...seen.filter(s => `${s.mode}:${s.category}:${s.title}`.toLowerCase() !== key),
      { id: card.id, title: card.title, category: card.category, mode: card.type, seenAt: Date.now() }
    ];
    localStorage.setItem("sage_seen_cards_v2", JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to mark card seen:", e);
  }
}

export async function generateMicroContent(
  category: Category, 
  mode: string, 
  language: string = 'english',
  isLearnMode: boolean = false
): Promise<KnowledgeItem> {
  
  const currentKey = getApiKey();
  if (!currentKey || currentKey === "dummy-gemini-api-key") {
    const mock = getLocalMockItem(category, mode, isLearnMode);
    markCardSeen(mock);
    return mock;
  }

  let prompt = "";
  // Ensure the AI generates diverse, non-repetitive subtopics
  const randomSalt = Math.floor(Math.random() * 10000);
  const baseInstructions = `You are a highly advanced educational AI. Your task is to generate a completely unique, obscure, and specific micro-lesson about the domain: '${category}'. DO NOT use generic topics. Pick a highly specific subfield, historical event, or advanced concept (Seed: ${randomSalt}). THE ENTIRE RESPONSE MUST BE IN ${language.toUpperCase()}.`;

  if (mode === "fact") {
    prompt = `${baseInstructions}
FORMAT: FACT
Generate a highly detailed, rich, educational micro-fact. It must contain 5-6 comprehensive sentences detailing exact physical, chemical, historical, or theoretical mechanisms. Focus on depth, not surface-level summaries.`;
  } else if (mode === "story") {
    prompt = `${baseInstructions}
FORMAT: STORY
Generate a captivating story card. Provide 5-6 sentences of a historical, futuristic, or hypothetical narrative involving specific characters or specific events. ALSO provide 3-4 comprehension quiz options with 1 correct option index (0-indexed).`;
  } else if (mode === "myth") {
    prompt = `${baseInstructions}
FORMAT: MYTH DEBUNKER
Identify a specific, widely believed misconception in this domain. Provide "mythText" (2-3 lines explaining the misconception) and "truthText" (2-3 lines detailing the scientific/historical truth). ALSO provide 3-4 selectable quiz options testing this specific truth.`;
  } else if (mode === "case_study") {
    prompt = `${baseInstructions}
FORMAT: CASE STUDY
Generate a deep-dive case study. Provide 5-6 sentences analyzing a specific real-world application, failure, or breakthrough. ALSO provide 3-4 decision/root-cause quiz options evaluating the case.`;
  } else if (mode === "discussion") {
    prompt = `${baseInstructions}
FORMAT: DISCUSSION
Generate a controversial debate thesis or ethical dilemma. Present two opposing perspectives in 5-6 balanced sentences. Provide 3 options representing different philosophical or practical stances.`;
  } else if (mode === "quiz") {
    prompt = `${baseInstructions}
FORMAT: QUIZ
Generate a pure trivia or knowledge-based quiz question. The content should provide 4-5 sentences of context leading up to a specific question. Provide 3-4 plausible options and 1 correct option index. DO NOT frame this as a "Scenario Assessment".`;
  } else if (mode === "scenario") {
    prompt = `${baseInstructions}
FORMAT: SCENARIO
Create a high-stakes, interactive simulation or roleplay scenario. Put the reader in a specific situation requiring a critical decision in 5-6 sentences. Provide 3-4 action-based options and 1 correct optimal choice.`;
  } else if (mode === "logic") {
    prompt = `${baseInstructions}
FORMAT: LOGIC PUZZLE
Create a complex deduction, math, or structural logic puzzle related to the domain. Provide 4-5 sentences setting up the parameters. Provide 3-4 options and 1 correct answer.`;
  } else {
    prompt = `${baseInstructions}
FORMAT: INTERACTIVE
Generate an interactive educational card. Provide a title, 5-6 detailed sentences of context, 3-4 options, correct option index, and explanation.`;
  }

  const schema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: "A catchy, highly specific 3-6 word title." },
      content: { type: Type.STRING, description: "The main body text (5-6 sentences minimum)." },
      mythText: { type: Type.STRING, description: "Detailed 2-3 lines of misconception (only if myth mode)" },
      truthText: { type: Type.STRING, description: "Detailed 2-3 lines of scientific truth (only if myth mode)" },
      options: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "3-4 options for test mode"
      },
      correctOptionIndex: { type: Type.INTEGER, description: "0-based index of the correct option" },
      explanation: { type: Type.STRING, description: "1-2 sentences explaining why the correct option is right." }
    },
    required: ["title", "content", "explanation"]
  };

  try {
    const aiInstance = new GoogleGenAI({ apiKey: currentKey });
    const response = await aiInstance.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema as any
      }
    });

    const data = JSON.parse(response.text);
    const seedStr = `${category}-${data.title || "synthesis"}`.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    
    const card: KnowledgeItem = {
      id: crypto.randomUUID(),
      type: mode as any,
      category,
      isLearnMode,
      createdAt: new Date().toISOString(),
      imageUrl: `https://picsum.photos/seed/${seedStr}/800/450`,
      ...data
    };

    markCardSeen(card);
    return card;
  } catch (error: any) {
    console.error("Gemini Engine Error (Falling back to dynamic mock):", error.message || error);
    const mock = getLocalMockItem(category, mode, isLearnMode);
    markCardSeen(mock);
    return mock;
  }
}

// -----------------------------------------------------------------------------
// DYNAMIC MOCK GENERATOR (Fallback when API fails or quota exceeded)
// -----------------------------------------------------------------------------
function getLocalMockItem(category: Category, mode: string, isLearnMode: boolean = false): KnowledgeItem {
  const seenCards = getSeenCards();
  const seenKeys = new Set(seenCards.map(s => `${s.mode}:${s.category}:${s.title}`.toLowerCase()));

  // Dynamic prefix/suffix generation for completely unknown/custom domains
  const dynamicPrefixes = ["Advanced", "Theoretical", "Applied", "Experimental", "Foundational", "Critical", "Modern", "Quantum", "Cognitive", "Systems", "Automated"];
  const dynamicSuffixes = ["Dynamics", "Mechanics", "Protocols", "Optimization", "Synthesis", "Analysis", "Architecture", "Frameworks", "Integration", "Paradigm"];
  
  const randomDynamicTopic = () => {
    const p = dynamicPrefixes[Math.floor(Math.random() * dynamicPrefixes.length)];
    const s = dynamicSuffixes[Math.floor(Math.random() * dynamicSuffixes.length)];
    return `${p} ${category} ${s}`;
  };

  // Procedural topics map per domain & fallback for custom domains
  const domainTopics: Record<string, string[]> = {
    space: ["Orbital Dynamics", "Black Hole Event Horizons", "Neutron Star Pulsars", "Apollo Lunar Descents", "Mars Terraforming Protocols", "Cosmic Microwave Background", "Exoplanet Atmospheres", "James Webb Deep Field Analysis"],
    science: ["Quantum Entanglement", "Graphene Superconductors", "Nuclear Fusion Magnetic Confinement", "Thermodynamic Entropy", "CRISPR Gene Editing", "Particle Accelerator Collisions", "Photonic Computing", "Nanomaterial Lattices"],
    nature: ["Mycelium Communication Networks", "Tardigrade Cryptobiosis", "Yellowstone Trophic Cascades", "Bioluminescent Counter-Illumination", "Deep-Sea Hydrothermal Vents", "Avian Magnetoreception Navigation", "Ecosystem Resilience", "Photosynthetic Energy Conversion"],
    brain: ["Synaptic Pruning Optimization", "Neuroplastic Rewiring", "Prefrontal Cortex Decision Loops", "Hippocampal Memory Consolidation", "Phineas Gage Frontal Lobe Case", "Dopaminergic Feedback Loops", "Neuralink Brain-Computer Interfaces", "Circadian Rhythm Gene Regulation"],
    ai: ["Transformer Attention Mechanisms", "Gradient Descent Optimization", "Generative Adversarial Networks", "Reinforcement Learning Rewards", "Backpropagation Calculus", "Few-Shot Prompt Engineering", "Vector Database Retrieval", "Algorithmic Bias Mitigation"],
    edtech: ["Adaptive Spaced Repetition", "Constructivist Learning Environments", "Gamified Skill Trees", "Cognitive Load Theory", "Flipped Classroom Models", "Formative Assessment Algorithms", "Zone of Proximal Development", "Micro-Learning Retention Rates"]
  };

  const catLower = category.toLowerCase();
  const topicList = domainTopics[catLower] || Array.from({length: 8}, () => randomDynamicTopic());

  let chosenTopic = topicList[Math.floor(Math.random() * topicList.length)];
  let attempts = 0;
  while (seenKeys.has(`${mode}:${category}:${chosenTopic}`.toLowerCase()) && attempts < 20) {
    chosenTopic = topicList[Math.floor(Math.random() * topicList.length)];
    attempts++;
  }

  const salt = Math.floor(Math.random() * 9000 + 1000);
  const cardTitle = `${chosenTopic} #${salt}`;
  const seedStr = `${category}-${mode}-${salt}`.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

  let content = "";
  let mythText: string | undefined = undefined;
  let truthText: string | undefined = undefined;
  let options: string[] | undefined = undefined;
  let correctOptionIndex: number | undefined = undefined;
  let explanation = "";

  // Template arrays for diversity
  const factOpeners = [
    `An in-depth examination of ${chosenTopic} reveals fascinating structural dependencies within ${category}.`,
    `Recent breakthroughs in ${category} have fundamentally shifted our understanding of ${chosenTopic}.`,
    `The underlying mechanics of ${chosenTopic} demonstrate a highly complex interaction of variables.`
  ];
  const factBodies = [
    `By isolating specific parameters, researchers observed that feedback loops dictate overall stability. When thresholds are breached, the system rapidly adapts to dissipate excess energy or information. This adaptive stabilization ensures long-term viability under extreme stress.`,
    `Empirical data shows that initial assumptions regarding its linearity were incorrect. In reality, the architecture relies on distributed nodes that share cognitive or physical load. This decentralized approach prevents single points of failure.`,
    `At the micro-level, interactions are governed by probabilistic equations rather than absolute determinism. This allows for a degree of flexibility and mutation, which is essential for evolutionary or developmental progress over time.`
  ];

  if (mode === "fact") {
    content = `${factOpeners[Math.floor(Math.random() * factOpeners.length)]} ${factBodies[Math.floor(Math.random() * factBodies.length)]} Modern models are currently being updated to incorporate these newly discovered dynamics.`;
    explanation = `The core principles of ${chosenTopic} highlight how systemic adaptation drives resilience.`;
  } else if (mode === "quiz") {
    content = `Knowledge Check: In the context of ${chosenTopic} within ${category}, which of the following mechanisms is primarily responsible for preventing systemic degradation over extended operational periods?`;
    options = [
      "Dynamic load balancing and adaptive feedback loops",
      "Strict linear processing of isolated variables",
      "Elimination of all external environmental interactions"
    ];
    correctOptionIndex = 0;
    explanation = "Adaptive feedback loops allow the system to self-correct and distribute stress efficiently.";
  } else if (mode === "story") {
    content = `Historical Narrative: During the early stages of exploring ${chosenTopic}, the lead research team encountered a catastrophic anomaly. The primary framework collapsed under testing. Instead of reverting to old models, they embraced the anomaly, discovering a hidden variable that completely revolutionized ${category}.`;
    options = [
      "They discovered a hidden variable by embracing the anomaly",
      "They abandoned the project due to funding cuts",
      "They reverted to the previous, stable model"
    ];
    correctOptionIndex = 0;
    explanation = "Embracing anomalies often leads to paradigm-shifting discoveries.";
  } else if (mode === "myth") {
    mythText = `Myth: It is widely assumed that ${chosenTopic} operates independently of external variables.`;
    truthText = `Truth: Extensive studies prove that ${chosenTopic} is deeply entangled with its environment, requiring constant recalibration.`;
    content = `Challenge: A common misconception plagues the study of ${chosenTopic}. Which statement represents the actual scientific consensus?`;
    options = [
      `It requires constant recalibration with external variables`,
      `It operates in a completely isolated, independent state`,
      `It ignores environmental feedback entirely`
    ];
    correctOptionIndex = 0;
    explanation = `The truth of ${chosenTopic} relies on continuous environmental interaction.`;
  } else if (mode === "case_study") {
    content = `Case Analysis: A recent implementation of ${chosenTopic} in a high-stress environment yielded unexpected results. Efficiency dropped by 40% in the first week. Upon investigation, engineers found that the integration layer lacked sufficient buffering capacity for rapid data spikes.`;
    options = [
      "Insufficient buffering capacity in the integration layer",
      "Over-optimization of the primary processing core",
      "Lack of user engagement during the testing phase"
    ];
    correctOptionIndex = 0;
    explanation = "The bottleneck was identified at the integration layer due to poor buffering.";
  } else if (mode === "discussion") {
    content = `Ethical Dilemma: As ${chosenTopic} becomes increasingly powerful, experts are divided. Should we mandate strict, global regulations that could slow innovation, or encourage unregulated open-source development to accelerate progress in ${category}?`;
    options = [
      "Implement strict global regulations",
      "Encourage unregulated open-source development",
      "Adopt a tiered framework balancing safety and innovation"
    ];
    correctOptionIndex = 2;
    explanation = "A tiered framework is widely considered the most pragmatic approach to emerging paradigms.";
  } else if (mode === "scenario") {
    content = `Simulation: You are overseeing a critical deployment involving ${chosenTopic}. Suddenly, the primary metrics indicate a cascading desynchronization event. You have 10 seconds to issue a command. What is your priority action?`;
    options = [
      "Initiate an emergency localized shutdown to isolate the cascade",
      "Increase power throughput to force resynchronization",
      "Run a full diagnostic scan while monitoring the system"
    ];
    correctOptionIndex = 0;
    explanation = "Isolating a cascading failure immediately prevents global system collapse.";
  } else if (mode === "logic") {
    content = `Logic Puzzle: System X handles ${chosenTopic}. It processes 2 units every 3 minutes. System Y processes 3 units every 4 minutes. If they start simultaneously, how many total units will they have processed after 12 minutes?`;
    options = ["15 units", "17 units", "24 units"];
    correctOptionIndex = 1;
    explanation = "System X completes 4 cycles (8 units). System Y completes 3 cycles (9 units). Total = 17 units.";
  } else {
    content = `General Assessment: Evaluate the primary function of ${chosenTopic} within the broader ecosystem of ${category}.`;
    options = ["Adaptive regulation", "Static storage", "Linear degradation"];
    correctOptionIndex = 0;
    explanation = "Adaptive regulation is the defining characteristic of this mechanism.";
  }

  return {
    id: crypto.randomUUID(),
    type: mode as any,
    category,
    isLearnMode,
    title: cardTitle,
    content,
    mythText,
    truthText,
    options,
    correctOptionIndex,
    explanation,
    createdAt: new Date().toISOString(),
    imageUrl: `https://picsum.photos/seed/${seedStr}/800/450`
  };
}

