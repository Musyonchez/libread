'use client';

import { useState } from 'react';
import { NAVIGATION_PATTERNS, NavigationPattern, getSupportedDomains } from '@/config/domainGroups';
import { Globe, CheckCircle, XCircle, Info, Settings, ExternalLink } from 'lucide-react';

export default function DomainsPage() {
  const [selectedPattern, setSelectedPattern] = useState<NavigationPattern | null>(null);
  const [testUrl, setTestUrl] = useState('');

  const testUrlPattern = (url: string, pattern: NavigationPattern): boolean => {
    if (!url) return false;
    const matchesDomain = pattern.domains.some(domain => url.includes(domain));
    const matchesPattern = pattern.urlPattern.test(url);
    return matchesDomain && matchesPattern;
  };

  const extractChapterFromTest = (url: string, pattern: NavigationPattern) => {
    if (!testUrlPattern(url, pattern)) return null;
    return pattern.extractChapterInfo(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Domain Navigation Patterns</h1>
          <p className="text-lg text-gray-600">
            Configure and manage URL patterns for different novel reading sites
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Settings className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Navigation Patterns</p>
                <p className="text-2xl font-bold text-gray-900">{NAVIGATION_PATTERNS.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Globe className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Supported Domains</p>
                <p className="text-2xl font-bold text-gray-900">{getSupportedDomains().length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-emerald-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Status</p>
                <p className="text-2xl font-bold text-gray-900">Active</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Patterns List */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Navigation Patterns</h2>
            <p className="text-sm text-gray-500 mt-1">
              Click on a pattern to view details and test URLs
            </p>
          </div>

          <div className="divide-y divide-gray-200">
            {NAVIGATION_PATTERNS.map((pattern) => (
              <div
                key={pattern.id}
                className={`p-6 cursor-pointer transition-colors ${
                  selectedPattern?.id === pattern.id ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedPattern(pattern)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{pattern.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{pattern.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {pattern.domains.map((domain) => (
                        <span
                          key={domain}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          <Globe className="w-3 h-3 mr-1" />
                          {domain}
                        </span>
                      ))}
                    </div>

                    <div className="text-xs text-gray-500">
                      Pattern: <code className="bg-gray-100 px-2 py-1 rounded">{pattern.urlPattern.source}</code>
                    </div>
                  </div>

                  <div className="ml-4 flex-shrink-0">
                    <div className="flex flex-col items-center space-y-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-xs text-gray-500">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pattern Details & URL Testing */}
        {selectedPattern && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-blue-50">
              <h2 className="text-xl font-semibold text-gray-900">{selectedPattern.name} - Details</h2>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Pattern Details */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Pattern Configuration</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
                      <code className="block bg-gray-100 px-3 py-2 rounded text-sm">{selectedPattern.id}</code>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <p className="text-sm text-gray-600">{selectedPattern.description}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Supported Domains</label>
                      <div className="space-y-1">
                        {selectedPattern.domains.map((domain) => (
                          <div key={domain} className="flex items-center text-sm">
                            <Globe className="w-4 h-4 text-gray-400 mr-2" />
                            <span>www.{domain}</span>
                            <ExternalLink className="w-3 h-3 text-gray-400 ml-2" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Chapter Range</label>
                      <p className="text-sm text-gray-600">
                        {selectedPattern.minChapter || 1} - {selectedPattern.maxChapter || 999}
                      </p>
                    </div>
                  </div>
                </div>

                {/* URL Testing */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">URL Pattern Testing</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Test URL</label>
                      <input
                        type="url"
                        value={testUrl}
                        onChange={(e) => setTestUrl(e.target.value)}
                        placeholder="Enter a URL to test against this pattern..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {testUrl && (
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          {testUrlPattern(testUrl, selectedPattern) ? (
                            <>
                              <CheckCircle className="h-5 w-5 text-green-500" />
                              <span className="text-green-700 font-medium">Pattern matches!</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-5 w-5 text-red-500" />
                              <span className="text-red-700 font-medium">Pattern does not match</span>
                            </>
                          )}
                        </div>

                        {testUrlPattern(testUrl, selectedPattern) && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <h4 className="font-medium text-green-800 mb-2">Extracted Information:</h4>
                            {(() => {
                              const info = extractChapterFromTest(testUrl, selectedPattern);
                              return info ? (
                                <div className="space-y-1 text-sm">
                                  <p><strong>Novel ID:</strong> {info.novelId}</p>
                                  <p><strong>Chapter Number:</strong> {info.chapterNum}</p>
                                  <p><strong>Generated Next URL:</strong></p>
                                  <code className="block bg-white px-2 py-1 rounded text-xs break-all mt-1">
                                    {selectedPattern.generateUrl(info.novelId, info.chapterNum + 1)}
                                  </code>
                                </div>
                              ) : (
                                <p className="text-sm text-red-600">Could not extract chapter information</p>
                              );
                            })()}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <Info className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
                        <div>
                          <h4 className="font-medium text-blue-800 mb-1">Example URLs:</h4>
                          <div className="space-y-1 text-xs">
                            {selectedPattern.domains.slice(0, 2).map((domain) => (
                              <code key={domain} className="block text-blue-700">
                                https://www.{domain}/novel/example_1.html
                              </code>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}