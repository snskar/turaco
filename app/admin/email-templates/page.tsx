'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Mail,
  Eye,
  Save,
  AlertCircle,
  CheckCircle,
  Code,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useAdminAuth, authenticatedFetch } from '../lib/auth';
import AdminNav from '../components/AdminNav';

type EmailTemplate = {
  id: string;
  name: string;
  subject: string;
  bodyText: string;
  bodyHtml: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function EmailTemplatesPage() {
  const [, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] =
    useState<EmailTemplate | null>(null);
  const [subject, setSubject] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [bodyHtml, setBodyHtml] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [serverAuthValid, setServerAuthValid] = useState(false);
  const [isHtmlExpanded, setIsHtmlExpanded] = useState(false);

  // Editable text content fields
  const [greetingText, setGreetingText] = useState('Hi');
  const [mainMessage, setMainMessage] = useState(
    "has created a personalised HeartLink just for you. It's a little something they wanted to share with you, and we hope it brings a smile to your face. 🥰"
  );
  const [ctaIntro, setCtaIntro] = useState('You can open it here:');
  const [buttonText, setButtonText] = useState('Open Your HeartLink');
  const [closingText, setClosingText] = useState('With love,');
  const [teamName, setTeamName] = useState('Team Turaco Ink');

  const { signOut, checkServerAuth } = useAdminAuth();

  // Check authentication
  useEffect(() => {
    setMounted(true);
    const verifyAuth = async () => {
      const valid = await checkServerAuth();
      setServerAuthValid(valid);
      setAuthChecked(true);
      if (!valid) {
        signOut();
      }
    };
    verifyAuth();
  }, [checkServerAuth, signOut]);

  // Load templates
  const loadTemplates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await authenticatedFetch('/admin/api/email-templates');
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to load templates');
      }

      const templateList = Array.isArray(json.data) ? json.data : [];
      setTemplates(templateList);

      // Auto-select the heartlink notification template if available
      const heartlinkTemplate = templateList.find(
        (t: EmailTemplate) => t.name === 'heartlink_notification'
      );
      if (heartlinkTemplate) {
        setSelectedTemplate(heartlinkTemplate);
        setSubject(heartlinkTemplate.subject);
        setBodyText(heartlinkTemplate.bodyText);
        setBodyHtml(heartlinkTemplate.bodyHtml);
        extractTextFromHtml(heartlinkTemplate.bodyHtml);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load templates');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (mounted && authChecked && serverAuthValid) {
      loadTemplates();
    }
  }, [mounted, authChecked, serverAuthValid, loadTemplates]);

  // Extract text content from HTML
  const extractTextFromHtml = (html: string) => {
    // Extract greeting
    const greetingMatch = html.match(
      /<p[^>]*>\s*(.*?)\s*<strong>\$\{recipientName\}<\/strong>/
    );
    if (greetingMatch) setGreetingText(greetingMatch[1].trim());

    // Extract main message (after ${senderName})
    const mainMessageMatch = html.match(
      /<strong>\$\{senderName\}<\/strong>\s*([\s\S]*?)<\/p>/
    );
    if (mainMessageMatch) {
      const cleanMessage = mainMessageMatch[1]
        .replace(/<br\s*\/?>/gi, ' ')
        .trim();
      setMainMessage(cleanMessage);
    }

    // Extract CTA intro
    const ctaMatch = html.match(
      /<p[^>]*>\s*([\s\S]*?)\s*<\/p>\s*<!--\s*CTA Button/
    );
    if (ctaMatch) {
      const lines = ctaMatch[1].split('</p>');
      const lastLine = lines[lines.length - 1];
      if (lastLine) setCtaIntro(lastLine.replace(/<[^>]+>/g, '').trim());
    }

    // Extract button text
    const buttonMatch = html.match(/<a[^>]*>\s*(.*?)\s*<\/a>/);
    if (buttonMatch) setButtonText(buttonMatch[1].trim());

    // Extract closing and team name
    const closingMatch = html.match(
      /<p[^>]*>\s*(.*?)<br\/>\s*<strong[^>]*>(.*?)<\/strong>/
    );
    if (closingMatch) {
      setClosingText(closingMatch[1].trim());
      setTeamName(closingMatch[2].trim());
    }
  };

  // Update HTML when text fields change - find and replace in existing HTML
  useEffect(() => {
    if (selectedTemplate && bodyHtml) {
      let updatedHtml = bodyHtml;

      // Find and replace greeting (before ${recipientName})
      updatedHtml = updatedHtml.replace(
        /(<p[^>]*>\s*)([^<]*?)(\s*<strong>\$\{recipientName\}<\/strong>)/,
        `$1${greetingText}$3`
      );

      // Find and replace main message (after ${senderName})
      updatedHtml = updatedHtml.replace(
        /(<strong>\$\{senderName\}<\/strong>\s*)([^<]*?)(\s*<\/p>)/,
        `$1${mainMessage}$3`
      );

      // Find and replace CTA intro
      updatedHtml = updatedHtml.replace(
        /(<p[^>]*>)([^<]*?)(<\/p>\s*<!--\s*CTA Button)/,
        (match, p1, p2, p3) => {
          // Only replace the last paragraph before CTA Button comment
          return `${p1}${ctaIntro}${p3}`;
        }
      );

      // Find and replace button text
      updatedHtml = updatedHtml.replace(
        /(<a[^>]*href="\$\{heartlinkUrl\}"[^>]*>)([^<]*?)(<\/a>)/,
        `$1${buttonText}$3`
      );

      // Find and replace closing text (before team name)
      updatedHtml = updatedHtml.replace(
        /(<p[^>]*>)([^<]*?)(<br\/>\s*<strong[^>]*>[^<]*?<\/strong>)/,
        (match, p1, p2, p3) => {
          // Only if it's in the closing section
          if (match.includes('color: #718096')) {
            return `${p1}${closingText}${p3}`;
          }
          return match;
        }
      );

      // Find and replace team name
      updatedHtml = updatedHtml.replace(
        /(<strong style="color: #4a5568;">)([^<]*?)(<\/strong>)/,
        `$1${teamName}$3`
      );

      if (updatedHtml !== bodyHtml) {
        setBodyHtml(updatedHtml);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [greetingText, mainMessage, ctaIntro, buttonText, closingText, teamName]);

  // Handle template save
  const handleSave = async () => {
    if (!selectedTemplate) return;

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const res = await authenticatedFetch('/admin/api/email-templates', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedTemplate.id,
          subject,
          bodyText,
          bodyHtml,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to save template');
      }

      setSuccess('Template saved successfully!');
      await loadTemplates();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save template');
    } finally {
      setSaving(false);
    }
  };

  // Generate preview HTML with sample data
  const generatePreviewHtml = () => {
    // Use the current HTML from bodyHtml state (which includes both form field and direct HTML edits)
    let html = bodyHtml;

    // Replace placeholders with sample data
    html = html.replace(/\$\{recipientName\}/g, 'Sanskar');
    html = html.replace(/\$\{senderName\}/g, 'Gopika Arora');
    html = html.replace(
      /\$\{heartlinkUrl\}/g,
      'https://heartlink.turaco-ink.com/heartlink/sample-1'
    );
    html = html.replace(/\$\{occasion\}/g, 'Birthday');
    html = html.replace(
      /\$\{new Date\(\)\.getFullYear\(\)\}/g,
      new Date().getFullYear().toString()
    );

    return html;
  };

  // Generate preview subject with sample data
  const generatePreviewSubject = () => {
    let subjectText = subject;

    // Replace placeholders with sample data
    subjectText = subjectText.replace(/\$\{recipientName\}/g, 'Sanskar');
    subjectText = subjectText.replace(/\$\{senderName\}/g, 'Gopika Arora');
    subjectText = subjectText.replace(/\$\{occasion\}/g, 'Birthday');

    return subjectText;
  };

  // Show loading state
  if (!mounted || !authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50/30 via-white to-cyan-50/30">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show unauthorized state
  if (!serverAuthValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50/30 via-white to-cyan-50/30">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Authentication Required
          </h2>
          <p className="text-gray-600">Redirecting to sign in...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50/30 via-white to-cyan-50/30 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-100/20 via-transparent to-cyan-100/20 pointer-events-none" />

      {/* Navigation */}
      <AdminNav />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Mail className="h-8 w-8 text-pink-500" />
            <h1 className="text-3xl font-bold text-gray-900">
              Email Templates
            </h1>
          </div>
          <p className="text-gray-600">
            Customize email templates for Heartlink notifications
          </p>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-900">Error</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-green-900">Success</h3>
              <p className="text-green-700 text-sm">{success}</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading templates...</p>
            </div>
          </div>
        ) : selectedTemplate ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Editor Panel */}
            <div className="space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Edit Template
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Code className="h-4 w-4" />
                    <span>{selectedTemplate.name}</span>
                  </div>
                </div>

                {/* Subject Line */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject Line
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Email subject..."
                  />
                </div>

                {/* Email Content Fields */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-600" />
                      Email Content
                    </h3>
                    <p className="text-xs text-gray-500 italic">
                      Quick edit fields (edit HTML directly for full control)
                    </p>
                  </div>

                  {/* Greeting */}
                  <div className="mb-3">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Greeting
                    </label>
                    <input
                      type="text"
                      value={greetingText}
                      onChange={e => setGreetingText(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="Hi"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Shown before recipient&apos;s name
                    </p>
                  </div>

                  {/* Main Message */}
                  <div className="mb-3">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Main Message
                    </label>
                    <textarea
                      value={mainMessage}
                      onChange={e => setMainMessage(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="Main email message..."
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Shown after sender&apos;s name
                    </p>
                  </div>

                  {/* CTA Intro */}
                  <div className="mb-3">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Call-to-Action Intro
                    </label>
                    <input
                      type="text"
                      value={ctaIntro}
                      onChange={e => setCtaIntro(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="You can open it here:"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Shown before the button
                    </p>
                  </div>

                  {/* Button Text */}
                  <div className="mb-3">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Button Text
                    </label>
                    <input
                      type="text"
                      value={buttonText}
                      onChange={e => setButtonText(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="Open Your HeartLink"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Closing Text */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Closing
                      </label>
                      <input
                        type="text"
                        value={closingText}
                        onChange={e => setClosingText(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="With love,"
                      />
                    </div>

                    {/* Team Name */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Team Name
                      </label>
                      <input
                        type="text"
                        value={teamName}
                        onChange={e => setTeamName(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="Team Turaco Ink"
                      />
                    </div>
                  </div>
                </div>

                {/* HTML Body */}
                <div className="mb-6">
                  <button
                    onClick={() => setIsHtmlExpanded(!isHtmlExpanded)}
                    className="w-full flex items-center justify-between text-sm font-medium text-gray-700 mb-2 hover:text-gray-900 transition-colors"
                  >
                    <span>HTML Template (Full Control)</span>
                    {isHtmlExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                  {isHtmlExpanded && (
                    <>
                      <textarea
                        value={bodyHtml}
                        onChange={e => setBodyHtml(e.target.value)}
                        rows={20}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent font-mono text-xs"
                        placeholder="HTML template..."
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Available placeholders: {'${recipientName}'},{' '}
                        {'${senderName}'}, {'${heartlinkUrl}'}, {'${occasion}'}{' '}
                        - You can move these anywhere in your HTML
                      </p>
                    </>
                  )}
                  {!isHtmlExpanded && (
                    <div className="text-xs text-gray-400 italic">
                      Click to expand HTML template editor (edit HTML directly &
                      move placeholders freely)
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <Save className="h-4 w-4" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>

                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="flex items-center gap-2 px-6 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
                  >
                    <Eye className="h-4 w-4" />
                    {showPreview ? 'Hide' : 'Show'} Preview
                  </button>
                </div>
              </div>
            </div>

            {/* Preview Panel */}
            {showPreview && (
              <div className="space-y-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Email Preview
                  </h2>

                  {/* Subject Preview */}
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-xs font-medium text-gray-500 mb-1">
                      Subject:
                    </div>
                    <div className="text-sm text-gray-900">
                      {generatePreviewSubject()}
                    </div>
                  </div>

                  {/* HTML Preview */}
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <iframe
                      srcDoc={generatePreviewHtml()}
                      className="w-full h-[800px] bg-white"
                      title="Email Preview"
                      sandbox="allow-same-origin"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-12">
            <div className="text-center text-gray-500">
              <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No templates found. Creating default template...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
