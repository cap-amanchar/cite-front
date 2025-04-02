// src/pages/login.js
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import LoginForm from '../components/auth/LoginForm';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    // Redirect to dashboard if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            router.push('/dashboard');
        }
    }, [isAuthenticated, router]);

    return (
        <>
            <Head>
                <title>Login | Absence Management</title>
                <meta name="description" content="Login to the absence management system" />
            </Head>

            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold mb-2">Absence Management</h1>
                    <p className="text-lg text-gray-600">Login to manage absence requests</p>
                </div>

                <LoginForm />
            </div>
        </>
    );
};

export default LoginPage;