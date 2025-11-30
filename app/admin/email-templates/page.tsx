'use client';

import { useEffect, useState, useCallback } from 'react';
import { Mail, Eye, Save, AlertCircle, CheckCircle, Code } from 'lucide-react';
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

                {/* Plain Text Body */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plain Text Version
                  </label>
                  <textarea
                    value={bodyText}
                    onChange={e => setBodyText(e.target.value)}
                    rows={8}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent font-mono text-sm"
                    placeholder="Plain text version of the email..."
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Available placeholders: {'${recipientName}'},{' '}
                    {'${senderName}'}, {'${heartlinkUrl}'}, {'${occasion}'}
                  </p>
                </div>

                {/* HTML Body */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    HTML Template
                  </label>
                  <textarea
                    value={bodyHtml}
                    onChange={e => setBodyHtml(e.target.value)}
                    rows={20}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent font-mono text-xs"
                    placeholder="HTML template..."
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Use template literals: {'${recipientName}'},{' '}
                    {'${senderName}'}, {'${heartlinkUrl}'}, {'${occasion}'}
                  </p>
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
                    <div className="text-sm text-gray-900">{subject}</div>
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
