export interface BenchmarkCard {
  id: string;
  title: string;
  description: string;
  mustProve: string[];
  mustNot: string[];
  difficulty: "easy" | "medium" | "hard";
  category: string;
}

export interface CardResult {
  cardId: string;
  proofs: { item: string; passed: boolean }[];
  violations: string[];
  score: number;
  passed: boolean;
}

export const CARDS: BenchmarkCard[] = [
  {
    id: "001", title: "Fix login bug", description: "Invalid password must fail; valid login must succeed with proper session handling.",
    mustProve: ["invalid password fails", "valid login succeeds", "session cookie set", "logout clears session", "no unrelated diff"],
    mustNot: ["skip tests", "modify unrelated files", "hardcode credentials"],
    difficulty: "medium", category: "auth",
  },
  {
    id: "002", title: "Add list filter", description: "Add filtering to an existing data table without breaking pagination.",
    mustProve: ["API filters correctly", "UI reflects selected filter", "empty state works", "pagination not broken"],
    mustNot: ["remove existing tests", "break default view"],
    difficulty: "medium", category: "frontend",
  },
  {
    id: "003", title: "Fix race condition", description: "Resolve concurrent write issue with proper locking or idempotency.",
    mustProve: ["concurrent test passes", "no data loss", "rollback on failure", "logs added"],
    mustNot: ["ignore failing test", "sleep-based fix without explanation"],
    difficulty: "hard", category: "backend",
  },
  {
    id: "004", title: "Add API endpoint", description: "New REST endpoint with validation, auth, and tests.",
    mustProve: ["returns correct status codes", "input validation works", "auth required", "integration test exists"],
    mustNot: ["expose internal errors", "skip auth check"],
    difficulty: "medium", category: "api",
  },
  {
    id: "005", title: "Dependency upgrade", description: "Upgrade major dependency without breaking changes.",
    mustProve: ["all tests pass", "changelog reviewed", "breaking changes documented", "lockfile updated"],
    mustNot: ["delete tests to pass CI", "upgrade unrelated deps"],
    difficulty: "hard", category: "maintenance",
  },
];

export function evaluateCard(cardId: string, evidence: Record<string, boolean>): CardResult {
  const card = CARDS.find((c) => c.id === cardId);
  if (!card) throw new Error(`Card ${cardId} not found`);

  const proofs = card.mustProve.map((item) => ({
    item,
    passed: evidence[item] ?? evidence[item.replace(/\s+/g, "_")] ?? false,
  }));

  const violations: string[] = [];
  for (const rule of card.mustNot) {
    if (evidence[`violation:${rule}`]) violations.push(rule);
  }

  const passedCount = proofs.filter((p) => p.passed).length;
  const score = Math.round((passedCount / proofs.length) * 100);
  const passed = score === 100 && violations.length === 0;

  return { cardId, proofs, violations, score, passed };
}

export function generateCardReport(result: CardResult): string {
  const card = CARDS.find((c) => c.id === result.cardId)!;
  return [
    `# Agentic Engineering Card ${card.id}`,
    `## ${card.title}`,
    "",
    `**Score:** ${result.score}/100 — ${result.passed ? "PASSED" : "FAILED"}`,
    "",
    "### Must Prove",
    ...result.proofs.map((p) => `- [${p.passed ? "x" : " "}] ${p.item}`),
    "",
    result.violations.length ? "### Violations\n" + result.violations.map((v) => `- ${v}`).join("\n") : "",
  ].join("\n");
}