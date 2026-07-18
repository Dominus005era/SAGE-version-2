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
  if (mode === "fact") {
    prompt = `Generate a highly detailed, rich, educational micro-fact about ${category}. It must contain 5-6 comprehensive sentences (+1 to 2 extra lines of knowledge) detailing the exact physical, chemical, or biological mechanisms. THE ENTIRE RESPONSE MUST BE IN ${language.toUpperCase()}.`;
  } else if (mode === "story") {
    prompt = `Generate a captivating story card about ${category}. Provide 5-6 sentences of historical/future story narrative. ALSO provide 3-4 comprehension quiz options with 1 correct option index so the card can be toggled between Learn and Test modes. THE ENTIRE RESPONSE MUST BE IN ${language.toUpperCase()}.`;
  } else if (mode === "myth") {
    prompt = `Generate a famous misconception card about ${category}. Provide "mythText" (2-3 lines explaining misconception) and "truthText" (2-3 lines detailing scientific truth). ALSO provide 3-4 selectable quiz options for Test Mode. THE ENTIRE RESPONSE MUST BE IN ${language.toUpperCase()}.`;
  } else if (mode === "case_study") {
    prompt = `Generate a deep-dive case study card about ${category}. Provide 5-6 sentences of case analysis narrative. ALSO provide 3-4 decision/root-cause quiz options. THE ENTIRE RESPONSE MUST BE IN ${language.toUpperCase()}.`;
  } else if (mode === "discussion") {
    prompt = `Generate a controversial debate thesis about ${category}. Present two opposing perspectives in 5-6 balanced sentences. Provide 3 options/perspectives for evaluation. THE ENTIRE RESPONSE MUST BE IN ${language.toUpperCase()}.`;
  } else {
    prompt = `Generate an interactive card for ${category} in ${mode} mode. Provide a title, 5-6 detailed sentences of context, 3-4 options, correct option index, and explanation. THE ENTIRE RESPONSE MUST BE IN ${language.toUpperCase()}.`;
  }

  const schema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      content: { type: Type.STRING },
      mythText: { type: Type.STRING, description: "Detailed 2-3 lines of misconception" },
      truthText: { type: Type.STRING, description: "Detailed 2-3 lines of scientific truth" },
      options: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "3-4 options for test mode"
      },
      correctOptionIndex: { type: Type.INTEGER },
      explanation: { type: Type.STRING }
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
  } catch (error) {
    console.error("Gemini Engine Error:", error);
    const mock = getLocalMockItem(category, mode, isLearnMode);
    markCardSeen(mock);
    return mock;
  }
}

function getLocalMockItem(category: Category, mode: string, isLearnMode: boolean = false): KnowledgeItem {
  const seenCards = getSeenCards();
  const seenKeys = new Set(seenCards.map(s => `${s.mode}:${s.category}:${s.title}`.toLowerCase()));

  // Procedural topics map per domain & fallback for custom domains
  const domainTopics: Record<string, string[]> = {
    space: ["Orbital Dynamics", "Black Hole Event Horizons", "Neutron Star Pulsars", "Apollo Lunar Descents", "Mars Terraforming Protocols", "Cosmic Microwave Background", "Exoplanet Atmospheres", "James Webb Deep Field Analysis"],
    science: ["Quantum Entanglement", "Graphene Superconductors", "Nuclear Fusion Magnetic Confinement", "Thermodynamic Entropy", "CRISPR Gene Editing", "Particle Accelerator Collisions", "Photonic Computing", "Nanomaterial Lattices"],
    nature: ["Mycelium Communication Networks", "Tardigrade Cryptobiosis", "Yellowstone Trophic Cascades", "Bioluminescent Counter-Illumination", "Deep-Sea Hydrothermal Vents", "Avian Magnetoreception Navigation", "Ecosystem Resilience", "Photosynthetic Energy Conversion"],
    brain: ["Synaptic Pruning Optimization", "Neuroplastic Rewiring", "Prefrontal Cortex Decision Loops", "Hippocampal Memory Consolidation", "Phineas Gage Frontal Lobe Case", "Dopaminergic Feedback Loops", "Neuralink Brain-Computer Interfaces", "Circadian Rhythm Gene Regulation"]
  };

  const catLower = category.toLowerCase();
  const topicList = domainTopics[catLower] || [
    `${category} Fundamental Mechanics`,
    `${category} Critical Breakthroughs`,
    `${category} Operational Systems`,
    `${category} Strategic Analysis`,
    `${category} Historical Milestones`
  ];

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

  if (mode === "fact") {
    content = `Comprehensive analysis of ${chosenTopic} in ${category}. Empirical observations reveal that fundamental mechanisms operate on complex feedback loops. When environmental or structural stress is applied, the underlying system balances energy dissipation with adaptive stabilization. This allows ${chosenTopic} to preserve structural integrity over extended periods. Modern research continues to optimize our mathematical models of these dynamics to unlock advanced applications.`;
    explanation = `The core mechanics of ${chosenTopic} demonstrate how physical, biological, or structural laws dictate system stability under varying external parameters.`;
  } else if (mode === "story") {
    content = `Historical Micro-Story: During the initial breakthrough in ${chosenTopic}, researchers faced an unexpected failure when baseline assumptions collapsed under experimental testing. Instead of abandoning the hypothesis, the lead team isolated the root variable, making a pivotal discovery. This single event reshaped how humanity understands ${category}, paving the way for revolutionary modern applications.`;
    options = [
      "Isolating the failing subsystem immediately and updating models",
      "Increasing throughput power to override systemic feedback",
      "Terminating the research program entirely"
    ];
    correctOptionIndex = 0;
    explanation = "Isolating the failing subsystem and updating models allowed the team to discover the underlying principle.";
  } else if (mode === "myth") {
    mythText = `Myth: It is widely believed that ${chosenTopic} operates linearly without loss of efficiency over time.`;
    truthText = `Truth: Rigorous testing shows that ${chosenTopic} is governed by non-linear decay laws, requiring continuous structural or energetic inputs to maintain equilibrium.`;
    content = `Challenge: Common misconceptions claim that ${chosenTopic} operates linearly without efficiency loss. Which statement represents the scientific truth?`;
    options = [
      `It operates linearly under all physical conditions`,
      `It is governed by non-linear decay laws requiring continuous equilibrium control`,
      `It operates independent of physical energy limits`
    ];
    correctOptionIndex = 1;
    explanation = `Non-linear dynamics govern ${chosenTopic}, dispelling the myth of frictionless linear operation.`;
  } else if (mode === "case_study") {
    content = `Deep-Dive Case Study: Analysis of ${chosenTopic} reveals a classic structural bottleneck. Initially, early prototypes failed due to unforeseen stress concentration along key boundaries. By redesigning the internal architecture to distribute load dynamically, efficiency increased by 340%. This case study serves as a benchmark for modern engineering in ${category}.`;
    options = [
      "Stress concentration along unreinforced boundary joints",
      "Excessive fluid cooling in secondary reservoirs",
      "Over-simplification of atmospheric pressure parameters"
    ];
    correctOptionIndex = 0;
    explanation = "Post-mortem failure analysis proved unreinforced boundary joints created lethal stress concentration points.";
  } else if (mode === "discussion") {
    content = `Debate Thesis: Should humanity aggressively accelerate industrial implementation of ${chosenTopic} in ${category}, or mandate global precautionary delays until multi-decadal safety frameworks are ratified?`;
    options = [
      "Accelerate deployment to solve urgent resource bottlenecks",
      "Mandate precautionary delays to mitigate unknown systemic risks",
      "Implement a hybrid framework with real-time sandbox regulation"
    ];
    correctOptionIndex = 2;
    explanation = "A hybrid framework balances rapid technological innovation with real-time safety sandboxing.";
  } else if (mode === "scenario") {
    content = `High-Stakes Simulation: You are managing a critical facility operating ${chosenTopic}. Primary containment sensors trigger a red alert. Pressure is spiking by 15% per second. What is your immediate command?`;
    options = [
      "Inject emergency suppression fluid and isolate Section 4",
      "Override safety locks and attempt manual valve adjustments",
      "Vent all atmospheric gases into the external environment"
    ];
    correctOptionIndex = 0;
    explanation = "Protocol dictates immediate automated injection of suppression fluid to prevent thermal runaway.";
  } else if (mode === "logic") {
    content = `Structural Deduction Puzzle: System A, B, and C govern ${chosenTopic}. System A activates every 3 cycles, System B every 5 cycles, and System C every 15 cycles. If all three activate simultaneously on Cycle 1, on which cycle will they next activate together?`;
    options = ["Cycle 15", "Cycle 16", "Cycle 30"];
    correctOptionIndex = 1;
    explanation = "The Least Common Multiple (LCM) of 3, 5, and 15 is 15. Adding 15 to the initial alignment at Cycle 1 yields Cycle 16.";
  } else {
    // Quiz default
    content = `Scenario Assessment: When applying ${chosenTopic} to high-density environments in ${category}, which factor provides the greatest performance stabilization?`;
    options = [
      "Dynamic load distribution across decentralized nodes",
      "Single-point centralized processing",
      "Eliminating safety feedback loops"
    ];
    correctOptionIndex = 0;
    explanation = "Decentralized load distribution prevents single points of failure and enhances overall structural stability.";
  }

  const card: KnowledgeItem = {
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

  return card;
}
