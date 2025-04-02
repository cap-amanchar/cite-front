// src/pages/register.js
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import RegisterForm from '../components/auth/RegisterForm';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
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
                <title>Register | Absence Management</title>
                <meta name="description" content="Register for the absence management system" />
            </Head>

            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold mb-2">Absence Management</h1>
                    <p className="text-lg text-gray-600">Create a new account</p>
                </div>

                <RegisterForm />
            </div>
        </>
    );
};

export default RegisterPage;