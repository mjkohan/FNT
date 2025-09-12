"use client";

import React, { useEffect, useRef, memo } from 'react';
import { useTheme } from "next-themes";

interface TradingViewFinancialsProps {
  symbol: string;
}

function TradingViewFinancials({ symbol }: TradingViewFinancialsProps) {
  const container = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!container.current || !symbol) return;

    // Clear any existing content
    container.current.innerHTML = '';

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-financials.js";
    script.type = "text/javascript";
    script.async = true;
    
    // Determine theme
    const colorTheme = resolvedTheme === 'dark' ? 'dark' : 'light';
    
    script.innerHTML = `
      {
        "symbol": "${symbol}",
        "colorTheme": "${colorTheme}",
        "displayMode": "compact",
        "isTransparent": false,
        "locale": "en",
        "width": "100%",
        "height": "100%",
        "backgroundColor": "${colorTheme === 'dark' ? '#0a0a0a' : '#FFFFFF'}"
      }`;
    
    container.current.appendChild(script);

    return () => {
      // Cleanup script when component unmounts or dependencies change
      if (container.current && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [symbol, resolvedTheme]);

  return (
    <div className="w-full h-full tradingview-financials-override">
      <div className="tradingview-widget-container tradingview-financials-override" ref={container}>
        <div className="tradingview-widget-container__widget tradingview-financials-override"></div>
        <div className="tradingview-widget-copyright tradingview-financials-override">
          <a 
            href={`https://www.tradingview.com/symbols/${symbol.replace(':', '-')}/financials-overview/?exchange=${symbol.split(':')[0]}`} 
            rel="noopener nofollow" 
            target="_blank"
          >
          </a>
        </div>
      </div>
    </div>
  );
}

export default memo(TradingViewFinancials);
