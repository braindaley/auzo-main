
"use client";

import Link from 'next/link';

const AccountPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
        <main className="flex-1 pb-24">
            <div className="p-6 space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Account</h1>
                    <p className="text-gray-600">
                        Manage your account settings and preferences
                    </p>
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                    <Link href="/wallet" className="block bg-white rounded-xl px-6 pt-3 pb-3 shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors no-underline">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 m-0">Wallet</h3>
                            <div className="text-gray-400">
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </Link>
                    
                    <Link href="/activity" className="block bg-white rounded-xl px-6 pt-3 pb-3 shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors no-underline">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 m-0">Activity</h3>
                            <div className="text-gray-400">
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </Link>
                    
                    <Link href="/account/manage-users" className="block bg-white rounded-xl px-6 pt-3 pb-3 shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors no-underline">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 m-0">Manage Users</h3>
                            <div className="text-gray-400">
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </Link>

                    <Link href="/drivers" className="block bg-white rounded-xl px-6 pt-3 pb-3 shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors no-underline">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 m-0">Drivers</h3>
                            <div className="text-gray-400">
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </Link>
                    
                    <Link href="/account/profile" className="block bg-white rounded-xl px-6 pt-3 pb-3 shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors no-underline">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 m-0">Profile Settings</h3>
                            <div className="text-gray-400">
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </Link>
                    
                    <div className="bg-white rounded-xl px-6 pt-3 pb-3 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 m-0">Notifications</h3>
                            <div className="text-gray-400">
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
  );
};

export default AccountPage;
