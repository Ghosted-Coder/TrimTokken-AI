import React, { useState } from 'react';
import { X, Save, Sliders, AlertCircle, RefreshCw } from 'lucide-react';
import { ModelPricing } from '../types';

interface ManageProvidersModalProps {
  isOpen: boolean;
  onClose: () => void;
  models: ModelPricing[];
  onUpdateModels: (updated: ModelPricing[]) => void;
  onResetToDefaults: () => void;
}

export const ManageProvidersModal: React.FC<ManageProvidersModalProps> = ({
  isOpen,
  onClose,
  models,
  onUpdateModels,
  onResetToDefaults,
}) => {
  const [editableModels, setEditableModels] = useState<ModelPricing[]>(models);

  React.useEffect(() => {
    setEditableModels(models);
  }, [models, isOpen]);

  if (!isOpen) return null;

  const handlePriceChange = (id: string, field: 'promptPricePerM' | 'completionPricePerM' | 'qualityScore', val: number) => {
    setEditableModels(prev =>
      prev.map(m => (m.id === id ? { ...m, [field]: val } : m))
    );
  };

  const handleToggleActive = (id: string) => {
    setEditableModels(prev =>
      prev.map(m => (m.id === id ? { ...m, active: !m.active } : m))
    );
  };

  const handleSave = () => {
    onUpdateModels(editableModels);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#181c22] border border-[#00ff41]/40 rounded-xl w-full max-w-3xl overflow-hidden shadow-[0_0_40px_rgba(0,255,65,0.15)] flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 md:p-5 border-b border-[#3b4b37]/60 flex justify-between items-center bg-[#10141a]">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#00ff41]" />
            <div>
              <h2 className="font-display text-lg font-bold text-[#dfe2eb]">
                Manage Provider Pricing & Routing Weights
              </h2>
              <p className="text-xs font-mono-data text-[#b9ccb2]">
                Changes immediately recalculate dynamic vector k-NN frontiers.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#b9ccb2] hover:text-white p-1.5 rounded-lg hover:bg-[#353940]/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Table */}
        <div className="p-4 md:p-6 overflow-y-auto flex-grow space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono-data text-xs whitespace-nowrap">
              <thead className="text-[11px] text-[#b9ccb2] bg-[#10141a] border-b border-[#3b4b37]/60">
                <tr>
                  <th className="px-3 py-2.5">ACTIVE</th>
                  <th className="px-3 py-2.5">MODEL / PROVIDER</th>
                  <th className="px-3 py-2.5">INPUT ($/1M)</th>
                  <th className="px-3 py-2.5">OUTPUT ($/1M)</th>
                  <th className="px-3 py-2.5">BENCHMARK SCORE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3b4b37]/30 text-[#dfe2eb]">
                {editableModels.map((m) => (
                  <tr key={m.id} className="hover:bg-[#353940]/20">
                    <td className="px-3 py-3">
                      <input
                        type="checkbox"
                        checked={m.active}
                        onChange={() => handleToggleActive(m.id)}
                        className="rounded border-[#3b4b37] text-[#00e639] focus:ring-[#00e639] bg-[#10141a] w-4 h-4 cursor-pointer"
                      />
                    </td>
                    <td className="px-3 py-3">
                      <div className="font-semibold text-white flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color }}></span>
                        {m.name}
                        {m.hasKey ? (
                          <span className="text-[9px] font-mono-data bg-[#00ff41]/10 text-[#00ff41] px-1.5 py-0.2 rounded border border-[#00ff41]/30">
                            KEY CONFIGURED
                          </span>
                        ) : (
                          <span className="text-[9px] font-mono-data bg-[#353940]/50 text-[#b9ccb2]/60 px-1.5 py-0.2 rounded border border-[#3b4b37]/30">
                            NO KEY
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-[#b9ccb2]/60">{m.provider} • {m.tier}</div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1">
                        <span className="text-[#b9ccb2]">$</span>
                        <input
                          type="number"
                          step="0.05"
                          min="0.01"
                          value={m.promptPricePerM}
                          onChange={(e) => handlePriceChange(m.id, 'promptPricePerM', parseFloat(e.target.value) || 0.01)}
                          className="w-20 bg-[#10141a] border border-[#3b4b37] rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-[#00e639]"
                        />
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1">
                        <span className="text-[#b9ccb2]">$</span>
                        <input
                          type="number"
                          step="0.05"
                          min="0.01"
                          value={m.completionPricePerM}
                          onChange={(e) => handlePriceChange(m.id, 'completionPricePerM', parseFloat(e.target.value) || 0.01)}
                          className="w-20 bg-[#10141a] border border-[#3b4b37] rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-[#00e639]"
                        />
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={m.qualityScore}
                        onChange={(e) => handlePriceChange(m.id, 'qualityScore', parseFloat(e.target.value) || 50)}
                        className="w-16 bg-[#10141a] border border-[#3b4b37] rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-[#00e639]"
                      />
                      <span className="text-[10px] text-[#b9ccb2] ml-1">/100</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 md:p-5 border-t border-[#3b4b37]/60 flex flex-wrap justify-between items-center bg-[#10141a] gap-3">
          <button
            onClick={() => {
              onResetToDefaults();
              onClose();
            }}
            className="text-xs font-mono-data text-[#b9ccb2] hover:text-white flex items-center gap-1.5 px-3 py-2 rounded bg-[#353940]/40 border border-[#3b4b37]/50 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset to Market Defaults
          </button>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="text-xs font-mono-data px-4 py-2 rounded text-[#b9ccb2] hover:text-white bg-[#1c2026] border border-[#3b4b37]/50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="text-xs font-mono-data font-bold px-5 py-2 rounded bg-[#00ff41] text-[#003907] hover:bg-[#72ff70] transition-colors flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,255,65,0.25)] cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              Save Dynamic Matrix
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
