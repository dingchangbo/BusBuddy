import React, { useEffect } from 'react';

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
  const canonicalUrl =
    pageUrl || (typeof window !== 'undefined' ? window.location.href : 'https://busbuddy.app');

  useEffect(() => {
    // Define global disqus config
    window.disqus_config = function () {
      this.page.url = canonicalUrl;
      this.page.identifier = pageIdentifier;
      this.page.title = pageTitle;
    };

    const disqusScriptId = 'disqus-embed-script';
    const existingScript = document.getElementById(disqusScriptId);

    if (window.DISQUS) {
      // If already loaded, reset for the new page / bus stop
      try {
        window.DISQUS.reset({
          reload: true,
          config: function () {
            this.page.identifier = pageIdentifier;
            this.page.url = canonicalUrl;
            this.page.title = pageTitle;
          },
        });
      } catch (e) {
        console.error('Error resetting Disqus:', e);
      }
    } else if (!existingScript) {
      // Inject Disqus script
      const d = document;
      const s = d.createElement('script');
      s.id = disqusScriptId;
      s.src = 'https://busbuddy-5.disqus.com/embed.js';
      s.setAttribute('data-timestamp', String(+new Date()));
      s.async = true;
      (d.head || d.body).appendChild(s);
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

          <span className="font-label-caps text-[11px] bg-[#ededf8] text-[#003d9b] px-3 py-1 rounded-full font-bold border border-[#c3c6d6]">
            Powered by Disqus
          </span>
        </div>

        {/* Disqus Embed Container */}
        <div className="min-h-[220px]">
          <div id="disqus_thread" className="w-full" />
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
