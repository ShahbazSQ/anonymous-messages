import React, { useState } from 'react';
import { Send, CheckCircle, MessageSquare } from 'lucide-react';

export default function AnonymousMessenger() {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    setStatus('');

    try {
      // This would call your serverless function
      const response = await fetch('/api/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: message.trim() })
      });

      if (response.ok) {
        setStatus('success');
        setMessage('');
        setTimeout(() => setStatus(''), 3000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-lg rounded-full mb-4">
            <MessageSquare className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Send Anonymous Message
          </h1>
          <p className="text-blue-200 text-lg">
            Share your thoughts without revealing your identity
          </p>
        </div>

        {/* Message Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white font-medium mb-3 text-lg">
                Your Anonymous Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here... Everything is anonymous."
                className="w-full h-40 px-4 py-3 bg-white/20 border-2 border-white/30 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all resize-none"
                maxLength={1000}
              />
              <div className="mt-2 text-right text-sm text-blue-200">
                {message.length}/1000 characters
              </div>
            </div>

            {/* Status Messages */}
            {status === 'success' && (
              <div className="flex items-center gap-2 p-4 bg-green-500/20 border border-green-400/50 rounded-lg text-green-100">
                <CheckCircle className="w-5 h-5" />
                <span>Message sent successfully! Thank you for sharing.</span>
              </div>
            )}

            {status === 'error' && (
              <div className="flex items-center gap-2 p-4 bg-red-500/20 border border-red-400/50 rounded-lg text-red-100">
                <span>Failed to send message. Please try again.</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !message.trim()}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Send Anonymous Message</span>
                </>
              )}
            </button>
          </form>

          {/* Privacy Notice */}
          <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
            <p className="text-sm text-blue-100 leading-relaxed">
              🔒 <strong>Privacy Notice:</strong> Your message is completely anonymous. 
              We don't collect any personal information that can identify you.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-blue-200 text-sm">
          Made with ❤️ for anonymous communication
        </div>
      </div>
    </div>
  );
}