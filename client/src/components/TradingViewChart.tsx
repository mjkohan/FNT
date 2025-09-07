"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

let tvScriptLoadingPromise: Promise<void>;

interface TradingViewChartProps {
    symbol: string;
    loader?: boolean;
}

export default function TradingViewChart({ symbol }: TradingViewChartProps) {
    const onLoadScriptRef = useRef<(() => void) | null>(null);
    // Get current theme for chart styling
    const { resolvedTheme } = useTheme();

    useEffect(
        () => {
            onLoadScriptRef.current = createWidget;

            if (!tvScriptLoadingPromise) {
                tvScriptLoadingPromise = new Promise<void>((resolve) => {
                    const script = document.createElement('script');
                    script.id = 'tradingview-widget-loading-script';
                    script.src = 'https://s3.tradingview.com/tv.js';
                    script.type = 'text/javascript';
                    script.onload = () => resolve();

                    document.head.appendChild(script);
                });
            }

            tvScriptLoadingPromise.then(() => onLoadScriptRef.current && onLoadScriptRef.current());

            return () => { onLoadScriptRef.current = null; };

            function createWidget() {
                if (document.getElementById('technical-analysis-chart-demo') && 'TradingView' in window) {
                    // Determine the theme to use - prefer resolvedTheme over theme for more accurate detection
                    const chartTheme = resolvedTheme === 'dark' ? 'dark' : 'light';
                    
                    new (window as any).TradingView.widget({
                        container_id: "technical-analysis-chart-demo",
                        width: "100%",
                        height: "100%",
                        autosize: true,
                        symbol: symbol,
                        interval: "120",
                        timezone: "exchange",
                        theme: chartTheme,
                        style: "1",
                        withdateranges: true,
                        hide_side_toolbar: false,
                        allow_symbol_change: true,
                        save_image: false,
                        show_popup_button: true,
                        popup_width: "1000",
                        popup_height: "650",
                        locale: "en",
                        backgroundColor: chartTheme === 'dark' ? "#131316" : "#ffffff",
                        enable_publishing: true,
                    });
                }
            }
        },
        [symbol, resolvedTheme]
    );

    return (
        <div className="min-h-[600px] relative bg-muted">
            <div className="h-full">
                {symbol && symbol !== "NOT_FOUND" && (
                    <div className='tradingview-widget-container'>
                        <div id='technical-analysis-chart-demo' />
                    </div>
                )}
            </div>
        </div>
    );
}
