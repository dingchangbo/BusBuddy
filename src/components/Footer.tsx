import React, { useState } from 'react';

export const Footer: React.FC = () => {
  const [modalContent, setModalContent] = useState<{ title: string; text: string } | null>(null);

  const handleLinkClick = (e: React.MouseEvent, type: string) => {
    e.preventDefault();
    if (type === 'terms') {
      setModalContent({
        title: 'BusBuddy Terms of Service',
        text: 'BusBuddy provides real-time open transit telemetry and arrival predictions for Singapore bus networks. Timetable feeds and bus positions are aggregated from LTA DataMall.',
      });
    } else if (type === 'privacy') {
      setModalContent({
        title: 'Privacy Policy',
        text: 'BusBuddy does not store personal trip history or private location data on external servers. All saved stops and commuter preferences are stored locally on your device.',
      });
    } else if (type === 'contact') {
      setModalContent({
        title: 'BusBuddy Support',
        text: 'For feedback, bus stop corrections, or support, reach out to the BusBuddy community team or leave a comment on the commuter board below.',
      });
    } else if (type === 'status') {
      setModalContent({
        title: 'System Status: All Services Operational',
        text: 'LTA DataMall v3 Stream: Active • Real-Time Stop Displays: 100% Operational • Live Countdown Engine: Running.',
      });
    }
  };

  return (
    <>
      <footer
        id="app-footer"
        className="bg-[#ffffff] border-t border-[#c3c6d6] flex flex-col md:flex-row justify-between items-center w-full px-4 md:px-8 py-4 mt-auto"
      >
        <div className="font-label-caps text-label-caps font-bold text-[#003d9b] mb-3 md:mb-0">
          © {new Date().getFullYear()} BusBuddy Singapore
        </div>
        <div className="flex flex-wrap gap-4 md:gap-6 justify-center">
          <a
            href="#terms"
            onClick={(e) => handleLinkClick(e, 'terms')}
            className="font-label-caps text-label-caps text-[#515f74] hover:text-[#003d9b] transition-colors cursor-pointer"
          >
            Terms
          </a>
          <a
            href="#privacy"
            onClick={(e) => handleLinkClick(e, 'privacy')}
            className="font-label-caps text-label-caps text-[#515f74] hover:text-[#003d9b] transition-colors cursor-pointer"
          >
            Privacy
          </a>
          <a
            href="#contact"
            onClick={(e) => handleLinkClick(e, 'contact')}
            className="font-label-caps text-label-caps text-[#515f74] hover:text-[#003d9b] transition-colors cursor-pointer"
          >
            Contact
          </a>
          <a
            href="#status"
            onClick={(e) => handleLinkClick(e, 'status')}
            className="font-label-caps text-label-caps text-[#515f74] hover:text-[#003d9b] transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            System Status
          </a>
        </div>
      </footer>

      {/* Info Popup Modal */}
      {modalContent && (
        <div className="fixed inset-0 bg-[#191b23]/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#ffffff] rounded-xl border border-[#c3c6d6] shadow-xl max-w-md w-full p-5 animate-fadeIn">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-headline-lg-mobile text-lg font-bold text-[#003d9b]">
                {modalContent.title}
              </h3>
              <button
                onClick={() => setModalContent(null)}
                className="text-[#737685] hover:text-[#191b23] p-1 rounded-lg"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <p className="font-body-md text-sm text-[#434654] leading-relaxed mb-4">
              {modalContent.text}
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setModalContent(null)}
                className="px-4 py-1.5 bg-[#003d9b] text-[#ffffff] font-label-caps text-xs rounded hover:bg-[#0040a2] transition-colors cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
