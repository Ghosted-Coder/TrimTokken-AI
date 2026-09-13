import React, { useState } from 'react';
import { Terminal, Copy, Check, BookOpen, ShieldCheck, Zap, Globe } from 'lucide-react';

export const ApiGatewayDocsView: React.FC = () => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copySnippet = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const curlSnippet = `curl https://api.trimtoken.ai/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer tt-live-token" \\
  -d '{
    "model": "auto",
    "messages": [
      {"role": "user", "content": "Summarize the 14-day refund policy."}
    ]
  }'`;

  const pythonSnippet = `import os
from openai import OpenAI

# 1. Point standard OpenAI client to TrimToken AI Gateway
client = OpenAI(
    base_url="https://api.trimtoken.ai/v1",
    api_key="tt-live-token"
)

# 2. Use 'auto' to let TrimToken AI pick the optimal model dynamically
response = client.chat.completions.create(
    model="auto",
    messages=[
        {"role": "user", "content": "Extract customer tax ID from invoice text: ..."}
    ]
)

print("Routed Model:", response.model)
print("Response:", response.choices[0].message.content)`;

  const tsSnippet = `import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://api.trimtoken.ai/v1",
  apiKey: "tt-live-token",
});

async function main() {
  const completion = await client.chat.completions.create({
    model: "auto",
    messages: [{ role: "user", content: "Write a python script to parse logs." }],
  });

  console.log(completion.choices[0].message);
}

main();`;

  const qwenSnippet = `import os
import requests

# Route a request through TrimToken's OpenAI-compatible gateway
url = "https://api.trimtoken.ai/v1/chat/completions"
headers = {
    "Authorization": "Bearer tt-live-token",
    "Content-Type": "application/json",
    # Optional: pass your Alibaba DashScope key for zero-latency direct passthrough
    "X-Qwen-DashScope-Key": os.getenv("QWEN_API_KEY", "")
}
payload = {
    "model": "qwen-2.5-72b", # or "qwen-2.5-coder-32b"
    "messages": [
        {"role": "user", "content": "Explain quantum entanglement in simple terms."}
    ]
}

response = requests.post(url, json=payload, headers=headers)
print(response.json()["choices"][0]["message"]["content"])`;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="glass-panel rounded-xl p-6 border border-[#ffba20]/30 bg-gradient-to-r from-[#1c2026] via-[#262014] to-[#10141a]">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-lg bg-[#ffba20]/15 border border-[#ffba20]/40 flex items-center justify-center text-[#ffba20]">
            <BookOpen className="w-6 h-6" />
          </span>
          <div>
            <h2 className="font-display text-xl font-bold text-white">
              OpenAI Drop-In API Gateway
            </h2>
            <p className="text-xs font-mono-data text-[#b9ccb2]">
              Change only <code className="text-[#00ff41]">base_url</code> in your existing enterprise app. Zero codebase rewrites required.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* cURL */}
        <div className="glass-panel rounded-xl p-5 border border-[#3b4b37]/60 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="font-mono-data text-xs font-bold text-[#00ff41] flex items-center gap-1.5">
                <Terminal className="w-4 h-4" />
                cURL CLI REQUEST
              </span>
              <button
                onClick={() => copySnippet('curl', curlSnippet)}
                className="text-xs font-mono-data text-[#b9ccb2] hover:text-white flex items-center gap-1 bg-[#10141a] px-2 py-1 rounded border border-[#3b4b37]"
              >
                {copiedSection === 'curl' ? <Check className="w-3.5 h-3.5 text-[#00ff41]" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedSection === 'curl' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="bg-[#0a0e14] p-3 rounded-lg font-mono-data text-[11px] text-[#dfe2eb] overflow-x-auto leading-relaxed border border-[#3b4b37]/40 max-h-72 overflow-y-auto">
              <code>{curlSnippet}</code>
            </pre>
          </div>
        </div>

        {/* Qwen API / DashScope Integration */}
        <div className="glass-panel rounded-xl p-5 border border-[#00C9E8]/40 bg-[#00C9E8]/[0.02] flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="font-mono-data text-xs font-bold text-[#00C9E8] flex items-center gap-1.5">
                <Zap className="w-4 h-4" />
                QWEN 2.5 API (DASHSCOPE)
              </span>
              <button
                onClick={() => copySnippet('qwen', qwenSnippet)}
                className="text-xs font-mono-data text-[#b9ccb2] hover:text-white flex items-center gap-1 bg-[#10141a] px-2 py-1 rounded border border-[#3b4b37]"
              >
                {copiedSection === 'qwen' ? <Check className="w-3.5 h-3.5 text-[#00ff41]" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedSection === 'qwen' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="bg-[#0a0e14] p-3 rounded-lg font-mono-data text-[11px] text-[#dfe2eb] overflow-x-auto leading-relaxed border border-[#3b4b37]/40 max-h-72 overflow-y-auto">
              <code>{qwenSnippet}</code>
            </pre>
          </div>
        </div>

        {/* Python */}
        <div className="glass-panel rounded-xl p-5 border border-[#3b4b37]/60 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="font-mono-data text-xs font-bold text-[#00e5ff] flex items-center gap-1.5">
                <Globe className="w-4 h-4" />
                PYTHON OPENAI SDK
              </span>
              <button
                onClick={() => copySnippet('python', pythonSnippet)}
                className="text-xs font-mono-data text-[#b9ccb2] hover:text-white flex items-center gap-1 bg-[#10141a] px-2 py-1 rounded border border-[#3b4b37]"
              >
                {copiedSection === 'python' ? <Check className="w-3.5 h-3.5 text-[#00ff41]" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedSection === 'python' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="bg-[#0a0e14] p-3 rounded-lg font-mono-data text-[11px] text-[#dfe2eb] overflow-x-auto leading-relaxed border border-[#3b4b37]/40 max-h-72 overflow-y-auto">
              <code>{pythonSnippet}</code>
            </pre>
          </div>
        </div>

        {/* Node/TypeScript */}
        <div className="glass-panel rounded-xl p-5 border border-[#3b4b37]/60 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="font-mono-data text-xs font-bold text-[#ffba20] flex items-center gap-1.5">
                <Zap className="w-4 h-4" />
                NODE / TYPESCRIPT SDK
              </span>
              <button
                onClick={() => copySnippet('ts', tsSnippet)}
                className="text-xs font-mono-data text-[#b9ccb2] hover:text-white flex items-center gap-1 bg-[#10141a] px-2 py-1 rounded border border-[#3b4b37]"
              >
                {copiedSection === 'ts' ? <Check className="w-3.5 h-3.5 text-[#00ff41]" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedSection === 'ts' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="bg-[#0a0e14] p-3 rounded-lg font-mono-data text-[11px] text-[#dfe2eb] overflow-x-auto leading-relaxed border border-[#3b4b37]/40 max-h-72 overflow-y-auto">
              <code>{tsSnippet}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
