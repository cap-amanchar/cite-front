// src/components/leave/LeaveBalanceCard.jsx
import React from 'react';
import Card, { CardHeader, CardTitle, CardBody } from '../common/Card';

const LeaveBalanceCard = ({ balance, title, showYear = true, className = '' }) => {
    if (!balance) {
        return (
            <Card className={className}>
                <CardHeader>
                    <CardTitle>{title || 'Leave Balance'}</CardTitle>
                </CardHeader>
                <CardBody>
                    <div className="p-4 text-center">
                        <p>No balance data available</p>
                    </div>
                </CardBody>
            </Card>
        );
    }

    // Calculate usage percentages
    const calculatePercentage = (used, total) => {
        if (total === 0) return 0;
        return Math.round((used / total) * 100);
    };

    const vacationPercentage = calculatePercentage(
        balance.used?.vacation || 0,
        balance.balance?.vacation || 0
    );

    const sickPercentage = calculatePercentage(
        balance.used?.sick || 0,
        balance.balance?.sick || 0
    );

    const personalPercentage = calculatePercentage(
        balance.used?.personal || 0,
        balance.balance?.personal || 0
    );

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>
                    {title || 'Leave Balance'}
                    {showYear && balance.year && (
                        <span className="ml-2 text-sm font-normal">({balance.year})</span>
                    )}
                </CardTitle>
            </CardHeader>
            <CardBody>
                {/* Vacation days */}
                <div className="mb-4">
                    <div className="flex justify-between mb-1">
                        <span className="font-bold">Vacation Days</span>
                        <span>
              {balance.remaining?.vacation} remaining of {balance.balance?.vacation}
            </span>
                    </div>
                    <div className="w-full h-4 bg-gray-200 border-2 border-black">
                        <div
                            className="h-full bg-sky-400"
                            style={{ width: `${vacationPercentage}%` }}
                        ></div>
                    </div>
                    <div className="flex justify-between mt-1 text-sm">
                        <span>{balance.used?.vacation || 0} used</span>
                        <span>{vacationPercentage}%</span>
                    </div>
                </div>

                {/* Sick days */}
                <div className="mb-4">
                    <div className="flex justify-between mb-1">
                        <span className="font-bold">Sick Days</span>
                        <span>
              {balance.remaining?.sick} remaining of {balance.balance?.sick}
            </span>
                    </div>
                    <div className="w-full h-4 bg-gray-200 border-2 border-black">
                        <div
                            className="h-full bg-red-400"
                            style={{ width: `${sickPercentage}%` }}
                        ></div>
                    </div>
                    <div className="flex justify-between mt-1 text-sm">
                        <span>{balance.used?.sick || 0} used</span>
                        <span>{sickPercentage}%</span>
                    </div>
                </div>

                {/* Personal days */}
                <div>
                    <div className="flex justify-between mb-1">
                        <span className="font-bold">Personal Days</span>
                        <span>
              {balance.remaining?.personal} remaining of {balance.balance?.personal}
            </span>
                    </div>
                    <div className="w-full h-4 bg-gray-200 border-2 border-black">
                        <div
                            className="h-full bg-purple-400"
                            style={{ width: `${personalPercentage}%` }}
                        ></div>
                    </div>
                    <div className="flex justify-between mt-1 text-sm">
                        <span>{balance.used?.personal || 0} used</span>
                        <span>{personalPercentage}%</span>
                    </div>
                </div>

                {/* Last updated */}
                {balance.lastUpdated && (
                    <div className="mt-4 text-xs text-right text-gray-500">
                        Last updated: {new Date(balance.lastUpdated).toLocaleString()}
                    </div>
                )}
            </CardBody>
        </Card>
    );
};

export default LeaveBalanceCard;