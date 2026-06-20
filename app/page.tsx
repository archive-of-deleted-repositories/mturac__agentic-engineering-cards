"use client";

import { useMemo, useState } from "react";
import { CARDS, evaluateCard, generateCardReport } from "@/lib/cards";

export default function Home() {
  const [selected, setSelected] = useState(CARDS[0]);
  const [evidence, setEvidence] = useState<Record<string, boolean>>({});

  const result = useMemo(() => evaluateCard(selected.id, evidence), [selected, evidence]);

  return (
    <div className="min-h-screen bg-[#0f0610] text-slate-200">
      <header className="border-b border-pink-900/40">
        <div className="max-w-6xl mx-auto px-6 py-5">
          <h1 className="text-2xl font-bold text-pink-100">agentic-engineering-cards</h1>
          <p className="text-pink-600/80 text-sm">Real-world agent benchmarks — prove it, don't just code it</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 grid lg:grid-cols-3 gap-6">
        <div className="space-y-2">
          {CARDS.map((c) => (
            <button
              key={c.id}
              onClick={() => { setSelected(c); setEvidence({}); }}
              className={`w-full text-left p-4 rounded-xl border transition ${selected.id === c.id ? "border-pink-500 bg-pink-500/10" : "border-pink-900/30"}`}
            >
              <div className="text-xs text-pink-600 font-mono">Card {c.id}</div>
              <div className="font-medium">{c.title}</div>
              <div className="flex gap-2 mt-2">
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800">{c.category}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800">{c.difficulty}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="p-5 rounded-2xl border border-pink-900/30">
            <h2 className="text-lg font-bold">{selected.title}</h2>
            <p className="text-sm text-slate-400 mt-2">{selected.description}</p>
          </div>

          <div className="flex items-center gap-4">
            <div className={`text-3xl font-bold ${result.passed ? "text-green-400" : "text-pink-400"}`}>{result.score}%</div>
            <span className={`px-3 py-1 rounded-full text-sm font-bold ${result.passed ? "bg-green-500/20 text-green-400" : "bg-pink-500/20 text-pink-400"}`}>
              {result.passed ? "PASSED" : "IN PROGRESS"}
            </span>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm text-pink-600 uppercase">Must Prove</h3>
            {selected.mustProve.map((item) => (
              <label key={item} className="flex items-center gap-3 p-3 rounded-lg border border-slate-800 cursor-pointer hover:border-pink-800">
                <input type="checkbox" checked={!!evidence[item]} onChange={(e) => setEvidence({ ...evidence, [item]: e.target.checked })} className="accent-pink-500" />
                <span className="text-sm">{item}</span>
              </label>
            ))}
          </div>

          <div className="space-y-2">
            <h3 className="text-sm text-red-600 uppercase">Must Not</h3>
            {selected.mustNot.map((item) => (
              <label key={item} className="flex items-center gap-3 p-3 rounded-lg border border-red-900/30 cursor-pointer">
                <input type="checkbox" checked={!!evidence[`violation:${item}`]} onChange={(e) => setEvidence({ ...evidence, [`violation:${item}`]: e.target.checked })} className="accent-red-500" />
                <span className="text-sm text-red-300/80">{item}</span>
              </label>
            ))}
          </div>

          <button onClick={() => { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([generateCardReport(result)])); a.download = `card-${selected.id}-report.md`; a.click(); }} className="text-sm text-pink-400 hover:underline">
            Export card report
          </button>
        </div>
      </main>
    </div>
  );
}