import React from 'react';
import { MedievalIcon } from './MedievalIcon';

interface RulesOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesOverlay: React.FC<RulesOverlayProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      id="rules-overlay-modal"
      className="fixed inset-0 z-50 bg-[#060910]/85 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#0c1322] border border-[#cbb279]/30 rounded-2xl p-6 sm:p-8 space-y-6 text-[#f4f1ea] relative max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#cbb279]/20 pb-4">
          <h2 className="text-3xl sm:text-4xl font-jacquard text-[#f4f1ea] tracking-wider">
            How to play
          </h2>
          <button
            id="close-rules-btn"
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#a8a29e] hover:text-[#f4f1ea] rounded-full hover:bg-[#19263e] transition-colors cursor-pointer"
            aria-label="Close rules"
          >
            <MedievalIcon name="close" className="text-xs" />
          </button>
        </div>

        {/* Minimal rule rows */}
        <div className="space-y-4 text-sm font-sans">
          <div className="flex items-start space-x-3.5">
            <div className="w-8 h-8 rounded-lg bg-[#142033] border border-[#cbb279]/30 flex items-center justify-center shrink-0 mt-0.5 text-[#cbb279]">
              <MedievalIcon name="castle" className="text-sm text-[#cbb279]" />
            </div>
            <div className="space-y-0.5">
              <h3 className="font-semibold text-[#f4f1ea] text-sm">1. Forehead or stand (Party mode)</h3>
              <p className="text-[#a8a29e] text-xs leading-relaxed">
                Hold the device facing your tablemates or place it on a stand. You must remain blind to your secret character.
              </p>
            </div>
          </div>

          <div className="h-px bg-[#cbb279]/15" />

          <div className="flex items-start space-x-3.5">
            <div className="w-8 h-8 rounded-lg bg-[#142033] border border-[#cbb279]/30 flex items-center justify-center shrink-0 mt-0.5 text-[#cbb279]">
              <MedievalIcon name="help" className="text-sm text-[#cbb279]" />
            </div>
            <div className="space-y-0.5">
              <h3 className="font-semibold text-[#f4f1ea] text-sm">2. One question & guess</h3>
              <p className="text-[#a8a29e] text-xs leading-relaxed">
                On each turn, ask the table exactly <strong>one Yes/No question</strong>, then make <strong>one guess</strong> at your identity.
              </p>
            </div>
          </div>

          <div className="h-px bg-[#cbb279]/15" />

          <div className="flex items-start space-x-3.5">
            <div className="w-8 h-8 rounded-lg bg-[#142033] border border-[#cbb279]/30 flex items-center justify-center shrink-0 mt-0.5 text-[#cbb279]">
              <MedievalIcon name="sword" className="text-sm text-[#cbb279]" />
            </div>
            <div className="space-y-0.5">
              <h3 className="font-semibold text-[#f4f1ea] text-sm">3. Last turn round</h3>
              <p className="text-[#a8a29e] text-xs leading-relaxed">
                The first player to solve their identity scores +1 point and triggers the <strong>Last Turn</strong>. Remaining players receive one final turn to score.
              </p>
            </div>
          </div>
        </div>

        {/* Close CTA */}
        <button
          id="got-it-rules-btn"
          type="button"
          onClick={onClose}
          className="w-full py-3.5 bg-gradient-to-b from-[#e5cf96] via-[#d4b76a] to-[#ba9848] hover:from-[#edd8a4] hover:to-[#c6a454] active:scale-[0.99] text-[#120e09] font-bold text-sm rounded-xl transition-all cursor-pointer border border-[#fbf0cf] shadow-[0_4px_24px_rgba(212,183,106,0.25)] flex items-center justify-center space-x-2"
        >
          <MedievalIcon name="shield" className="text-sm text-[#120e09]" />
          <span>Got it</span>
        </button>
      </div>
    </div>
  );
};
