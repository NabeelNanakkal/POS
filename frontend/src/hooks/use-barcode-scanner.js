import { useEffect, useRef } from 'react';

/**
 * Custom hook to detect input from a hardware barcode scanner.
 * Most hardware scanners act as a keyboard, typing characters rapidly
 * and ending with an "Enter" key.
 */
export const useBarcodeScanner = (onScan) => {
    const buffer = useRef('');
    const lastKeyTime = useRef(Date.now());

    useEffect(() => {
        const handleKeyDown = (event) => {
            const currentTime = Date.now();
            const timeDiff = currentTime - lastKeyTime.current;
            lastKeyTime.current = currentTime;

            // Barcode scanners usually type very fast. 
            // If the time between characters is more than 50ms, it might be manual typing.
            // However, in a POS, we often just buffer everything and check on "Enter".
            
            if (event.key === 'Enter') {
                if (buffer.current.length > 3) {
                    onScan(buffer.current);
                    buffer.current = '';
                }
            } else if (event.key.length === 1) {
                // If the gap is too large, reset the buffer (it was likely manual typing elsewhere)
                if (timeDiff > 100) {
                    buffer.current = '';
                }
                buffer.current += event.key;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onScan]);
};
