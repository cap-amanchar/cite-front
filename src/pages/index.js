import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
    const { user, isAuthenticated, loading } = useAuth();
    const router = useRouter();

    // Redirect to dashboard if already authenticated
    useEffect(() => {
        if (!loading && isAuthenticated) {
            router.push('/dashboard');
        }
    }, [isAuthenticated, loading, router]);

    return (
        <>
            <Head>
                <title>Absence Management System</title>
                <meta name="description" content="Manage employee absences and leave requests efficiently" />
            </Head>

            <div className="min-h-screen flex flex-col">
                {/* Header */}
                <header className="p-4 bg-yellow-400 border-b-4 border-black">
                    <div className="container mx-auto flex justify-between items-center">
                        <h1 className="text-2xl font-bold">Absence Management</h1>
                        <div>
                            <Link href="/login">
                                <Button variant="secondary" className="mr-2">Login</Button>
                            </Link>
                            <Link href="/register">
                                <Button>Register</Button>
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Hero section */}
                <section className="flex-1 flex items-center justify-center bg-gray-100 p-4">
                    <div className="container mx-auto max-w-5xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            <div>
                                <h2 className="text-4xl font-bold mb-4">Simplify Absence Management</h2>
                                <p className="text-lg mb-6">
                                    A comprehensive solution for tracking employee time off,
                                    streamlining approval workflows, and managing team availability.
                                </p>
                                <div className="space-x-4">
                                    <Link href="/register">
                                        <Button size="lg">Get Started</Button>
                                    </Link>
                                    <Link href="/login">
                                        <Button size="lg" variant="secondary">Login</Button>
                                    </Link>
                                </div>
                            </div>

                            <div className="p-6 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform rotate-1">
                                <div className="space-y-4">
                                    <div className="p-3 bg-green-100 border-3 border-black">
                                        <h3 className="font-bold">For Employees</h3>
                                        <p>Request time off easily and track your leave balances</p>
                                    </div>

                                    <div className="p-3 bg-blue-100 border-3 border-black">
                                        <h3 className="font-bold">For Managers</h3>
                                        <p>Approve requests and maintain team availability</p>
                                    </div>

                                    <div className="p-3 bg-purple-100 border-3 border-black">
                                        <h3 className="font-bold">For Administrators</h3>
                                        <p>Configure policies and generate comprehensive reports</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features section */}
                <section className="py-12 bg-white">
                    <div className="container mx-auto max-w-5xl">
                        <h2 className="text-3xl font-bold mb-8 text-center">Key Features</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="p-6 bg-yellow-100 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                <div className="flex items-center justify-center w-12 h-12 mb-4 bg-yellow-300 border-2 border-black rounded-full">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold mb-2">Kanban Board View</h3>
                                <p>Manage absence requests with an intuitive drag-and-drop interface</p>
                            </div>

                            <div className="p-6 bg-green-100 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                <div className="flex items-center justify-center w-12 h-12 mb-4 bg-green-300 border-2 border-black rounded-full">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold mb-2">Leave Balance Tracking</h3>
                                <p>Monitor vacation, sick, and personal leave allowances</p>
                            </div>

                            <div className="p-6 bg-blue-100 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                <div className="flex items-center justify-center w-12 h-12 mb-4 bg-blue-300 border-2 border-black rounded-full">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold mb-2">Comprehensive Reports</h3>
                                <p>Generate insightful absence reports and analytics</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="p-8 bg-gray-800 text-white border-t-4 border-black">
                    <div className="container mx-auto text-center">
                        <p>© {new Date().getFullYear()} Absence Management System</p>
                        <p className="mt-2 text-gray-400">A modern solution for absence tracking and management</p>
                    </div>
                </footer>
            </div>
        </>
    );
};

export default HomePage;