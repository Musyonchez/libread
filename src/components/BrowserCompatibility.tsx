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
      
      // Detect browser (order matters - more specific first)
      if ('brave' in navigator && (navigator as { brave?: unknown }).brave) {
        browserName = 'Brave';
      } else if (userAgent.includes('Vivaldi')) {
        browserName = 'Vivaldi';
        isCompatible = true; // Chromium-based
      } else if (userAgent.includes('Arc/')) {
        browserName = 'Arc';
        isCompatible = true; // Chromium-based
      } else if (userAgent.includes('SamsungBrowser')) {
        browserName = 'Samsung Internet';
        isCompatible = true; // Chromium-based
      } else if (userAgent.includes('YaBrowser')) {
        browserName = 'Yandex Browser';
        isCompatible = true; // Chromium-based
      } else if (userAgent.includes('OPR/') || userAgent.includes('Opera/')) {
        browserName = 'Opera';
        isCompatible = true; // Chromium-based since Opera 15+
      } else if (userAgent.includes('Edg/')) {
        browserName = 'Microsoft Edge';
        isCompatible = true;
      } else if (userAgent.includes('Chrome/') && !userAgent.includes('Edg')) {
        browserName = 'Google Chrome';
        isCompatible = true;
      } else if (userAgent.includes('CriOS')) {
        browserName = 'Chrome iOS';
        isCompatible = false; // iOS WebKit restrictions
      } else if (userAgent.includes('FxiOS')) {
        browserName = 'Firefox iOS';
        isCompatible = false; // iOS WebKit restrictions
      } else if (userAgent.includes('Safari/') && userAgent.includes('Version/')) {
        browserName = 'Safari';
        if (userAgent.includes('Mobile/')) {
          browserName = 'Mobile Safari';
          isCompatible = false; // iOS Safari has limited speech support
        } else {
          isCompatible = true; // Desktop Safari works well
        }
      } else if (userAgent.includes('Firefox/')) {
        browserName = 'Mozilla Firefox';
        // Firefox support varies by platform
      } else if (userAgent.includes('MSIE') || userAgent.includes('Trident/')) {
        browserName = 'Internet Explorer';
        isCompatible = false; // No modern speech support
      } else if (userAgent.includes('DuckDuckGo/')) {
        browserName = 'DuckDuckGo Browser';
      } else if (userAgent.includes('Tor/')) {
        browserName = 'Tor Browser';
        isCompatible = false; // Privacy-focused, blocks APIs
      } else if (userAgent.includes('UCBrowser')) {
        browserName = 'UC Browser';
      } else if (userAgent.includes('QQBrowser')) {
        browserName = 'QQ Browser';
      } else if (userAgent.includes('MiuiBrowser')) {
        browserName = 'MIUI Browser';
      } else if (userAgent.includes('HuaweiBrowser')) {
        browserName = 'Huawei Browser';
      } else if (userAgent.includes('SogouMobileBrowser')) {
        browserName = 'Sogou Browser';
      } else if (userAgent.includes('Maxthon')) {
        browserName = 'Maxthon';
      } else if (userAgent.includes('Electron/')) {
        browserName = 'Electron App';
        isCompatible = true; // Usually Chromium-based
      } else if (userAgent.includes('PhantomJS')) {
        browserName = 'PhantomJS';
        isCompatible = false; // Headless browser
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
      } else if (browserName === 'Mozilla Firefox') {
        if (hasVoices) {
          message = 'Firefox detected with speech support.';
          isCompatible = true;
        } else {
          message = 'Firefox may have limited speech synthesis support on some systems.';
          suggestion = 'For best results, try Chrome or Edge browsers.';
        }
      } else if (browserName === 'Internet Explorer') {
        message = 'Internet Explorer is not supported.';
        suggestion = 'Please upgrade to a modern browser like Chrome, Edge, Firefox, or Safari.';
      } else if (browserName === 'Tor Browser') {
        message = 'Tor Browser blocks speech synthesis for privacy protection.';
        suggestion = 'Use a regular browser like Chrome or Firefox for speech functionality.';
      } else if (browserName.includes('iOS') || browserName === 'Mobile Safari') {
        message = `${browserName} has limited speech synthesis support.`;
        suggestion = 'For best experience, use the desktop version or try Chrome/Firefox on desktop.';
      } else if (['UC Browser', 'QQ Browser', 'MIUI Browser', 'Huawei Browser', 'Sogou Browser'].includes(browserName)) {
        if (hasVoices) {
          message = `${browserName} detected with speech support.`;
          isCompatible = true;
        } else {
          message = `${browserName} may have limited speech synthesis support.`;
          suggestion = 'If speech doesn\'t work, try Chrome, Firefox, or Edge browsers.';
        }
      } else if (browserName === 'DuckDuckGo Browser') {
        if (hasVoices) {
          message = 'DuckDuckGo Browser detected with speech support.';
          isCompatible = true;
        } else {
          message = 'DuckDuckGo Browser may limit speech synthesis for privacy.';
          suggestion = 'If speech doesn\'t work, try Chrome or Firefox browsers.';
        }
      } else if (['Vivaldi', 'Arc', 'Samsung Internet', 'Yandex Browser', 'Opera'].includes(browserName)) {
        if (hasVoices) {
          message = `${browserName} (Chromium-based) with speech synthesis ready.`;
          isCompatible = true;
        } else {
          message = `${browserName} detected but no voices available.`;
          suggestion = 'Speech voices may still be loading. Try refreshing the page.';
        }
      } else if (browserName === 'Electron App') {
        if (hasVoices) {
          message = 'Desktop app with speech synthesis ready.';
          isCompatible = true;
        } else {
          message = 'Desktop app detected but speech may not be available.';
          suggestion = 'Speech support depends on the app\'s configuration.';
        }
      } else if (isCompatible) {
        if (hasVoices) {
          message = `${browserName} with speech synthesis ready.`;
        } else {
          message = `${browserName} detected but no voices available.`;
          suggestion = 'Speech voices may still be loading. Try refreshing the page.';
          isCompatible = false;
        }
      } else {
        message = `${browserName} may have limited speech synthesis support.`;
        suggestion = 'For best experience, use Chrome, Edge, Firefox, or Safari.';
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
    } else if (['Brave', 'Tor Browser', 'DuckDuckGo Browser'].includes(browserInfo.name) && !browserInfo.hasVoices) {
      return <AlertTriangle className="h-5 w-5 text-orange-500" />;
    } else if (['Internet Explorer', 'PhantomJS'].includes(browserInfo.name)) {
      return <AlertTriangle className="h-5 w-5 text-red-500" />;
    } else if (browserInfo.name.includes('iOS') || browserInfo.name === 'Mobile Safari') {
      return <Info className="h-5 w-5 text-yellow-500" />;
    } else {
      return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBgColor = () => {
    if (browserInfo.isCompatible) {
      return 'bg-green-50 border-green-200';
    } else if (['Brave', 'Tor Browser', 'DuckDuckGo Browser'].includes(browserInfo.name) && !browserInfo.hasVoices) {
      return 'bg-orange-50 border-orange-200';
    } else if (['Internet Explorer', 'PhantomJS'].includes(browserInfo.name)) {
      return 'bg-red-50 border-red-200';
    } else if (browserInfo.name.includes('iOS') || browserInfo.name === 'Mobile Safari') {
      return 'bg-yellow-50 border-yellow-200';
    } else {
      return 'bg-blue-50 border-blue-200';
    }
  };

  const getTextColor = () => {
    if (browserInfo.isCompatible) {
      return 'text-green-800';
    } else if (['Brave', 'Tor Browser', 'DuckDuckGo Browser'].includes(browserInfo.name) && !browserInfo.hasVoices) {
      return 'text-orange-800';
    } else if (['Internet Explorer', 'PhantomJS'].includes(browserInfo.name)) {
      return 'text-red-800';
    } else if (browserInfo.name.includes('iOS') || browserInfo.name === 'Mobile Safari') {
      return 'text-yellow-800';
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