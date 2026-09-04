import React, { useState } from 'react';
import { Code2, Copy, Check, Download, Terminal, FileCode, Play, Sparkles } from 'lucide-react';
import { PYTHON_CODE_FILES } from '../lib/pythonBackendCode';

export const PythonCodeView: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<keyof typeof PYTHON_CODE_FILES>('router.py');
  const [copied, setCopied] = useState(false);

  const currentContent = PYTHON_CODE_FILES[selectedFile];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([currentContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = selectedFile;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel rounded-xl p-6 border border-[#00e5ff]/30 bg-gradient-to-r from-[#10141a] via-[#16222f] to-[#10141a]">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-lg bg-[#00e5ff]/15 border border-[#00e5ff]/40 flex items-center justify-center text-[#00e5ff]">
              <Code2 className="w-6 h-6" />
            </span>
            <div>
              <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
                Python Backend MVP & Dynamic Router Engine
              </h2>
              <p className="text-xs font-mono-data text-[#b9ccb2]">
                Complete runnable FastAPI middleware implementing CSCR vector routing and OpenAI drop-in proxy.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 rounded-lg bg-[#353940] text-xs font-mono-data text-white hover:bg-[#353940]/80 border border-[#3b4b37] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-[#00ff41]" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'COPIED!' : 'COPY CODE'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-3.5 py-2 rounded-lg bg-[#00e5ff] text-xs font-mono-data text-[#002f65] font-bold hover:bg-[#80ebff] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>DOWNLOAD FILE</span>
            </button>
          </div>
        </div>
      </div>

      {/* Code Editor Container */}
      <div className="glass-panel rounded-xl overflow-hidden border border-[#3b4b37]/60 flex flex-col">
        {/* File Tabs */}
        <div className="flex items-center gap-1 px-4 pt-3 bg-[#10141a] border-b border-[#3b4b37]/60 overflow-x-auto">
          {(Object.keys(PYTHON_CODE_FILES) as Array<keyof typeof PYTHON_CODE_FILES>).map((fileName) => (
            <button
              key={fileName}
              onClick={() => setSelectedFile(fileName)}
              className={`px-4 py-2 rounded-t-lg text-xs font-mono-data tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                selectedFile === fileName
                  ? 'bg-[#181c22] text-[#00e5ff] border-t-2 border-t-[#00e5ff] border-x border-x-[#3b4b37]/60 font-bold'
                  : 'text-[#b9ccb2] hover:text-white hover:bg-[#353940]/30'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              {fileName}
            </button>
          ))}
        </div>

        {/* Code Content */}
        <div className="p-4 md:p-6 bg-[#0a0e14] overflow-x-auto max-h-[600px] overflow-y-auto">
          <pre className="font-mono-data text-xs md:text-sm text-[#dfe2eb] leading-relaxed whitespace-pre font-normal">
            <code>{currentContent}</code>
          </pre>
        </div>

        {/* Execution Guide Footer */}
        <div className="p-4 bg-[#14181f] border-t border-[#3b4b37]/50 flex flex-wrap items-center justify-between gap-3 text-xs font-mono-data text-[#b9ccb2]">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#00ff41]" />
            <span>To run locally: <code className="text-[#00ff41] bg-[#10141a] px-2 py-0.5 rounded border border-[#3b4b37]">pip install -r requirements.txt && python main.py</code></span>
          </div>
          <span className="text-[11px] text-[#72ff70] bg-[#00ff41]/10 px-2 py-0.5 rounded border border-[#00ff41]/30">
            OpenAI SDK Drop-In Compatible
          </span>
        </div>
      </div>
    </div>
  );
};
