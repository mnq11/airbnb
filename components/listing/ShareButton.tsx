'use client';

import { useState, useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { ShareIcon, ClipboardIcon, CheckIcon, QrCodeIcon } from '@heroicons/react/24/outline';
import { QRCodeDisplay } from './QRCodeDisplay';
import { motion } from 'framer-motion';

export function ShareButton() {
    const pathname = usePathname();
    const [copied, setCopied] = useState(false);
    const [canShare, setCanShare] = useState(false);
    const [showQrCode, setShowQrCode] = useState(false);

    useEffect(() => {
        setCanShare(typeof navigator !== 'undefined' && !!navigator.share);
    }, []);

    const fullUrl = useMemo(() => {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : '');
        return `${baseUrl}${pathname}`;
    }, [pathname]);

    const handleShare = async () => {
        if (!fullUrl) return;

        if (canShare) {
            try {
                await navigator.share!({
                    title: document.title,
                    text: 'Check out this listing!',
                    url: fullUrl,
                });
                console.log('Successfully shared');
                setShowQrCode(false);
            } catch (error) {
                if ((error as Error).name !== 'AbortError') {
                    console.error('Error sharing:', error);
                }
                copyToClipboard(fullUrl);
                setShowQrCode(true);
            }
        } else {
            copyToClipboard(fullUrl);
            setShowQrCode(!showQrCode);
        }
    };

    const copyToClipboard = (url: string) => {
        navigator.clipboard.writeText(url).then(() => {
            setCopied(true);
            setTimeout(() => {
                setCopied(false);
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy:', err);
            setShowQrCode(false);
        });
    };

    return (
        <div className="relative inline-block">
            <motion.button
                onClick={handleShare}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-rose-500 hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-colors duration-150 ease-in-out"
                aria-label={copied ? "Link Copied" : "Share this listing"}
                title={canShare ? "Share via system dialog" : "Copy link / Show QR Code"}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                {copied ? (
                    <>
                        <CheckIcon className="h-5 w-5 mr-1.5" aria-hidden="true" />
                        Copied!
                    </>
                ) : (
                    <>
                        {canShare ? (
                            <ShareIcon className="h-5 w-5 mr-1.5" aria-hidden="true" />
                        ) : (
                            <ClipboardIcon className="h-5 w-5 mr-1.5" aria-hidden="true" />
                        )}
                        Share
                    </>
                )}
            </motion.button>
            {showQrCode && fullUrl && (
                <motion.div 
                    className="absolute left-0 mt-2 z-20"
                    initial={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                >
                    <QRCodeDisplay url={fullUrl} size={140} />
                </motion.div>
            )}
        </div>
    );
} 