import { describe, expect, it } from "vitest";
import { CARDS, evaluateCard, generateCardReport } from "./cards";

describe("agentic-engineering-cards", () => {
  it("has benchmark cards", () => expect(CARDS.length).toBeGreaterThanOrEqual(5));

  it("evaluates passing card", () => {
    const evidence: Record<string, boolean> = {};
    CARDS[0].mustProve.forEach((p) => (evidence[p] = true));
    const r = evaluateCard("001", evidence);
    expect(r.passed).toBe(true);
    expect(r.score).toBe(100);
  });

  it("evaluates failing card", () => {
    const r = evaluateCard("001", { "invalid password fails": true });
    expect(r.passed).toBe(false);
    expect(r.score).toBeLessThan(100);
  });

  it("detects violations", () => {
    const evidence: Record<string, boolean> = {};
    CARDS[0].mustProve.forEach((p) => (evidence[p] = true));
    evidence["violation:skip tests"] = true;
    const r = evaluateCard("001", evidence);
    expect(r.passed).toBe(false);
    expect(r.violations).toContain("skip tests");
  });

  it("generates card report", () => {
    const md = generateCardReport(evaluateCard("001", {}));
    expect(md).toContain("Fix login bug");
    expect(md).toContain("FAILED");
  });

  it("card 002 has filter proofs", () => {
    expect(CARDS[1].mustProve).toContain("pagination not broken");
  });

  it("card 003 is hard", () => {
    expect(CARDS[2].difficulty).toBe("hard");
  });

  it("throws for unknown card", () => {
    expect(() => evaluateCard("999", {})).toThrow();
  });
});