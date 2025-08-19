'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface BrowserInfo {
  name: string;
  isCompatible: boolean;
  hasVoices: boolean;
  message: string;
  suggestion?: string;
}

export default function BrowserCompatibility() {
  const [browserInfo, setBrowserInfo] = useState<BrowserInfo | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const detectBrowserAndVoices = () => {
      const userAgent = navigator.userAgent;
      let browserName = 'Unknown';
      let isCompatible = false;
      
      // Detect browser
      if ('brave' in navigator && (navigator as { brave?: unknown }).brave) {
        browserName = 'Brave';
      } else if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
        browserName = 'Chrome';
        isCompatible = true;
      } else if (userAgent.includes('Edg')) {
        browserName = 'Edge';
        isCompatible = true;
      } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
        browserName = 'Safari';
        isCompatible = true;
      } else if (userAgent.includes('Firefox')) {
        browserName = 'Firefox';
      } else if (userAgent.includes('Opera')) {
        browserName = 'Opera';
      }

      // Check voice availability
      const hasVoices = speechSynthesis.getVoices().length > 0;
      const isSupported = 'speechSynthesis' in window;

      let message = '';
      let suggestion = '';

      if (!isSupported) {
        message = 'Your browser does not support text-to-speech functionality.';
        suggestion = 'Please upgrade to a modern browser like Chrome, Edge, or Safari.';
      } else if (browserName === 'Brave') {
        if (hasVoices) {
          message = 'Brave browser detected with speech support enabled.';
          isCompatible = true;
        } else {
          message = 'Brave browser blocks speech synthesis by default for privacy.';
          suggestion = 'Enable sound in Brave settings (brave://settings/content/sound) or try Chrome.';
        }
      } else if (browserName === 'Firefox') {
        if (hasVoices) {
          message = 'Firefox detected with speech support.';
          isCompatible = true;
        } else {
          message = 'Firefox may have limited speech synthesis support on some systems.';
          suggestion = 'For best results, try Chrome or Edge browsers.';
        }
      } else if (isCompatible) {
        if (hasVoices) {
          message = `${browserName} browser with speech synthesis ready.`;
        } else {
          message = `${browserName} detected but no voices available.`;
          suggestion = 'Speech voices may still be loading. Try refreshing the page.';
          isCompatible = false;
        }
      } else {
        message = `${browserName} browser may have limited speech synthesis support.`;
        suggestion = 'For best experience, use Chrome, Edge, or Safari.';
      }

      setBrowserInfo({
        name: browserName,
        isCompatible: isCompatible && hasVoices,
        hasVoices,
        message,
        suggestion
      });
    };

    // Initial detection
    detectBrowserAndVoices();

    // Listen for voice loading
    speechSynthesis.onvoiceschanged = detectBrowserAndVoices;

    // Re-check after a delay for voice loading
    setTimeout(detectBrowserAndVoices, 1000);
  }, []);

  if (!browserInfo) return null;

  const getIcon = () => {
    if (browserInfo.isCompatible) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    } else if (browserInfo.hasVoices === false && browserInfo.name === 'Brave') {
      return <AlertTriangle className="h-5 w-5 text-orange-500" />;
    } else {
      return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBgColor = () => {
    if (browserInfo.isCompatible) {
      return 'bg-green-50 border-green-200';
    } else if (browserInfo.hasVoices === false && browserInfo.name === 'Brave') {
      return 'bg-orange-50 border-orange-200';
    } else {
      return 'bg-blue-50 border-blue-200';
    }
  };

  const getTextColor = () => {
    if (browserInfo.isCompatible) {
      return 'text-green-800';
    } else if (browserInfo.hasVoices === false && browserInfo.name === 'Brave') {
      return 'text-orange-800';
    } else {
      return 'text-blue-800';
    }
  };

  return (
    <div className={`rounded-lg border p-4 mb-6 ${getBgColor()}`}>
      <div className="flex items-start gap-3">
        {getIcon()}
        <div className="flex-1">
          <div className={`font-medium ${getTextColor()}`}>
            Browser Compatibility: {browserInfo.name}
          </div>
          <div className={`text-sm mt-1 ${getTextColor()}`}>
            {browserInfo.message}
          </div>
          {browserInfo.suggestion && (
            <div className={`text-sm mt-2 ${getTextColor()}`}>
              <strong>Suggestion:</strong> {browserInfo.suggestion}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}