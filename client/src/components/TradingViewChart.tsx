"use client";

import React, { useEffect, useRef, memo } from 'react';
import { useTheme } from "next-themes";

interface TradingViewChartProps {
    symbol: string;
    loader?: boolean;
    interval?: string;
}

function TradingViewChart({ symbol, interval = "D" }: TradingViewChartProps) {
    const container = useRef<HTMLDivElement>(null);
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        if (!container.current || !symbol || symbol === "NOT_FOUND") return;

        // Clear any existing content
        container.current.innerHTML = '';

        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
        script.type = "text/javascript";
        script.async = true;
        
        // Determine theme
        const chartTheme = resolvedTheme === 'dark' ? 'dark' : 'light';
        const backgroundColor = chartTheme === 'dark' ? '#0F0F0F' : '#ffffff';
        const gridColor = chartTheme === 'dark' ? 'rgba(242, 242, 242, 0.06)' : 'rgba(242, 242, 242, 0.5)';
        
        script.innerHTML = `
        {
          "allow_symbol_change": true,
          "calendar": false,
          "details": false,
          "hide_side_toolbar": true,
          "hide_top_toolbar": false,
          "hide_legend": false,
          "hide_volume": false,
          "hotlist": false,
          "interval": "${interval}",
          "locale": "en",
          "save_image": true,
          "style": "1",
          "symbol": "${symbol}",
          "theme": "${chartTheme}",
          "timezone": "Etc/UTC",
          "backgroundColor": "${backgroundColor}",
          "gridColor": "${gridColor}",
          "watchlist": [],
          "withdateranges": false,
          "compareSymbols": [],
          "studies": [],
          "autosize": true
        }`;
        
        container.current.appendChild(script);

        return () => {
            // Cleanup script when component unmounts or dependencies change
            if (container.current && script.parentNode) {
                script.parentNode.removeChild(script);
            }
        };
    }, [symbol, interval, resolvedTheme]);

    if (!symbol || symbol === "NOT_FOUND") {
        return (
            <div className="min-h-[600px] relative bg-muted flex items-center justify-center">
                <div className="text-muted-foreground">No chart data available</div>
            </div>
        );
    }

    return (
        <div className="min-h-[600px] relative bg-muted">
            <div 
                className="tradingview-widget-container" 
                ref={container} 
                style={{ height: "100%", width: "100%" }}
            />
        </div>
    );
}

export default memo(TradingViewChart);
