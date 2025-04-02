// src/pages/_app.js
import React from 'react';
import Head from 'next/head';
import { AuthProvider } from '../context/AuthContext';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
    return (
        <>
            <Head>
                <title>Absence Management System</title>
                <meta name="description" content="An absence management system for tracking time off and leave requests" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />

                {/* Import fonts */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap" rel="stylesheet" />
            </Head>

            <AuthProvider>
                <Component {...pageProps} />
            </AuthProvider>
        </>
    );
}

export default MyApp;