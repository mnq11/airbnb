'use client';

import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';

interface QRCodeDisplayProps {
    url: string;
    size?: number; // Optional size prop
}

export function QRCodeDisplay({ url, size = 128 }: QRCodeDisplayProps) {
    if (!url) {
        return null; // Don't render if URL is not provided
    }

    return (
        <div className="p-4 bg-white border border-rose-500 rounded-lg shadow-md inline-block">
            <QRCodeCanvas
                value={url}
                size={size}
                bgColor={"#ffffff"}
                fgColor={"#000000"}
                level={"L"} // Error correction level (L, M, Q, H)
                includeMargin={true}
            />
            <p className="text-center text-xs text-rose-700 mt-2 break-all">
                Scan or copy link
            </p>
        </div>
    );
} 