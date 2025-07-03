'use client';

import { useState } from 'react';
import { LogIn, Loader2, ShieldAlert } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        window.location.href = '/admin';
      } else {
        const data = await response.json();
        setError(data.error || 'Invalid credentials.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#0d1a2e] min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
            <div className="text-center mb-8">
                <img 
                    src="https://miro.medium.com/v2/resize:fit:1400/1*KSH-ELYLBI0dzE1Wt7mRKg.png" 
                    alt="BNCC Logo"
                    className="h-20 w-auto mx-auto"
                />
                <h1 className="text-3xl font-bold text-white mt-4">Praetorian Admin Login</h1>
                <p className="text-gray-400">Please sign in to continue to the dashboard.</p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 p-8 rounded-2xl shadow-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                            Email Address
                        </label>
                        <div className="mt-1">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-gray-700/50 border border-gray-600 rounded-md py-2 px-3 text-white focus:ring-[#00a9e0] focus:border-[#00a9e0]"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                            Password
                        </label>
                        <div className="mt-1">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-gray-700/50 border border-gray-600 rounded-md py-2 px-3 text-white focus:ring-[#00a9e0] focus:border-[#00a9e0]"
                            />
                        </div>
                    </div>
                    
                    {error && (
                        <div className="flex items-center space-x-2 text-red-400 text-sm p-3 bg-red-500/10 rounded-md border border-red-400/30">
                            <ShieldAlert className="h-4 w-4 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-bold text-white bg-[#00a9e0] hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-sky-500 transition-all duration-300 transform hover:scale-105 disabled:opacity-70 disabled:scale-100"
                        >
                            {isLoading ? (
                                <Loader2 className="h-6 w-6 animate-spin" />
                            ) : (
                                <>
                                    <LogIn className="h-6 w-6 mr-2" />
                                    Sign In
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  );
}
