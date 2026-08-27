import React from 'react';

interface TopAppBarProps {
  onHomeClick: () => void;
  onSearchClick?: () => void;
  onSettingsClick: () => void;
  showSearchButton?: boolean;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  onHomeClick,
  onSearchClick,
  onSettingsClick,
  showSearchButton = false,
}) => {
  return (
    <header
      id="top-app-bar"
      className="bg-[#faf8ff] border-b border-[#c3c6d6] flex justify-between items-center w-full px-4 md:px-8 h-16 z-50 sticky top-0"
    >
      <div className="flex items-center gap-3">
        <button
          id="btn-nav-home"
          onClick={onHomeClick}
          className="text-left group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#003d9b] rounded-lg p-1 transition-transform active:scale-95"
          aria-label="TransitFlow Home"
        >
          <span className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg font-bold text-[#003d9b] tracking-tight">
            TransitFlow
          </span>
        </button>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {showSearchButton && (
          <button
            id="btn-nav-search"
            onClick={onSearchClick}
            className="text-[#434654] hover:bg-[#f3f3fd] hover:text-[#003d9b] p-2 rounded-full transition-colors active:opacity-80 flex items-center justify-center cursor-pointer"
            aria-label="Search for bus stops"
            title="Search for bus stops"
          >
            <span className="material-symbols-outlined text-[24px]">search</span>
          </button>
        )}

        <button
          id="btn-nav-settings"
          onClick={onSettingsClick}
          className="text-[#434654] hover:bg-[#f3f3fd] hover:text-[#003d9b] p-2 rounded-full transition-colors active:opacity-80 flex items-center justify-center cursor-pointer"
          aria-label="Application Settings"
          title="Settings"
        >
          <span className="material-symbols-outlined text-[24px]">settings</span>
        </button>
      </div>
    </header>
  );
};
