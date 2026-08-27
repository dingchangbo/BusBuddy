import React, { useEffect, useState, useRef } from 'react';

interface DisqusCommentsProps {
  pageIdentifier?: string;
  pageTitle?: string;
  pageUrl?: string;
}

declare global {
  interface Window {
    DISQUS?: {
      reset: (options: {
        reload: boolean;
        config?: (this: {
          page: {
            identifier: string;
            url: string;
            title: string;
          };
        }) => void;
      }) => void;
    };
    disqus_config?: (this: {
      page: {
        identifier: string;
        url: string;
        title: string;
      };
    }) => void;
  }
}

export const DisqusComments: React.FC<DisqusCommentsProps> = ({
  pageIdentifier = 'busbuddy-home',
  pageTitle = 'BusBuddy Community',
  pageUrl,
}) => {
  const [loadError, setLoadError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const threadRef = useRef<HTMLDivElement>(null);

  const canonicalUrl =
    pageUrl ||
    (typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}#${pageIdentifier}`
      : `https://busbuddy.app/#${pageIdentifier}`);

  useEffect(() => {
    // Intercept cross-origin script error originating from third-party widgets
    const handleGlobalError = (event: ErrorEvent) => {
      if (
        event.message === 'Script error.' ||
        (event.filename && event.filename.includes('disqus'))
      ) {
        // Prevent third-party cross-origin script noise from crashing React tree
        event.preventDefault();
        return true;
      }
    };

    window.addEventListener('error', handleGlobalError);

    return () => {
      window.removeEventListener('error', handleGlobalError);
    };
  }, []);

  useEffect(() => {
    setLoadError(false);

    try {
      // Define global Disqus config
      window.disqus_config = function () {
        this.page.url = canonicalUrl;
        this.page.identifier = pageIdentifier;
        this.page.title = pageTitle;
      };

      const disqusScriptId = 'disqus-embed-script';
      const existingScript = document.getElementById(disqusScriptId);

      if (window.DISQUS && typeof window.DISQUS.reset === 'function') {
        // If already initialized, safely reset for the new stop/page
        try {
          window.DISQUS.reset({
            reload: true,
            config: function () {
              this.page.identifier = pageIdentifier;
              this.page.url = canonicalUrl;
              this.page.title = pageTitle;
            },
          });
          setIsLoaded(true);
        } catch (resetErr) {
          console.warn('Disqus reset notice:', resetErr);
        }
      } else if (!existingScript) {
        // Inject Disqus script
        const s = document.createElement('script');
        s.id = disqusScriptId;
        s.src = 'https://busbuddy-5.disqus.com/embed.js';
        s.setAttribute('data-timestamp', String(+new Date()));
        s.async = true;

        s.onload = () => {
          setIsLoaded(true);
        };

        s.onerror = () => {
          console.warn('Disqus embed script could not be loaded directly (may be blocked by browser tracking prevention or sandbox).');
          setLoadError(true);
        };

        (document.head || document.body).appendChild(s);
      }
    } catch (err) {
      console.warn('Disqus initialization caught error:', err);
    }
  }, [pageIdentifier, pageTitle, canonicalUrl]);

  return (
    <section
      id="section-disqus-comments"
      aria-label="Commuter Discussions and Feedback"
      className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8"
    >
      <div className="bg-[#ffffff] rounded-2xl border border-[#c3c6d6] p-6 md:p-8 shadow-xs">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3 pb-4 mb-6 border-b border-[#ededf8]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#003d9b] text-[#ffffff] flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[22px]">forum</span>
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-[#191b23] tracking-tight">
                Commuter Community & Live Discussions
              </h2>
              <p className="text-xs md:text-sm text-[#515f74]">
                Share real-time transit updates, bus feedback, or tips for{' '}
                <span className="font-semibold text-[#003d9b]">{pageTitle}</span>.
              </p>
            </div>
          </div>

          <a
            href={`https://busbuddy-5.disqus.com`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-label-caps text-[11px] bg-[#ededf8] hover:bg-[#e1e2ec] text-[#003d9b] px-3 py-1 rounded-full font-bold border border-[#c3c6d6] transition-colors inline-flex items-center gap-1"
          >
            <span>Powered by Disqus</span>
            <span className="material-symbols-outlined text-[14px]">open_in_new</span>
          </a>
        </div>

        {/* Disqus Embed Container */}
        <div className="min-h-[220px] relative">
          <div id="disqus_thread" ref={threadRef} className="w-full" />

          {loadError && (
            <div className="p-6 text-center bg-[#f3f3fd] rounded-xl border border-[#c3c6d6] flex flex-col items-center gap-3">
              <span className="material-symbols-outlined text-[#003d9b] text-3xl">chat</span>
              <p className="text-sm font-semibold text-[#191b23]">
                Third-party comments loaded in sandboxed mode.
              </p>
              <p className="text-xs text-[#515f74] max-w-md">
                If Disqus is restricted by your browser's third-party cookie or tracking protection, you can also join the live discussion directly on Disqus.
              </p>
              <a
                href={`https://busbuddy-5.disqus.com`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[#003d9b] text-[#ffffff] font-bold text-xs rounded-xl hover:bg-[#002d72] transition-colors inline-flex items-center gap-2"
              >
                <span>Open BusBuddy Disqus Forum</span>
                <span className="material-symbols-outlined text-[16px]">open_in_new</span>
              </a>
            </div>
          )}

          <noscript>
            Please enable JavaScript to view the{' '}
            <a
              href="https://disqus.com/?ref_noscript"
              target="_blank"
              rel="noreferrer"
              className="text-[#003d9b] underline font-bold"
            >
              comments powered by Disqus.
            </a>
          </noscript>
        </div>
      </div>
    </section>
  );
};
