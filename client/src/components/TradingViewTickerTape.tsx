"use client";

import React, { useEffect, useRef, memo } from 'react';
import { useTheme } from "next-themes";

function TradingViewTickerTape() {
  const container = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!container.current) return;

    // Clear any existing content
    container.current.innerHTML = '';

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.type = "text/javascript";
    script.async = true;
    
    // Determine theme
    const colorTheme = resolvedTheme === 'dark' ? 'dark' : 'light';
    console.log(colorTheme,resolvedTheme);
    
    script.innerHTML = `
      {
        "symbols": [
          {
            "proName": "BITSTAMP:BTCUSD",
            "title": "Bitcoin"
          },
          {
            "proName": "BITSTAMP:ETHUSD",
            "title": "Ethereum"
          },
          {
            "proName": "TVC:GOLD",
            "title": "Gold"
          },
          {
            "proName": "BLACKBULL:BRENT",
            "title": "Oil"
          },
          {
            "proName": "NASDAQ:AAPL",
            "title": "Apple"
          },
          {
            "proName": "NASDAQ:ADBE",
            "title": "Adobe"
          },
          {
            "proName": "NASDAQ:MSFT",
            "title": "Microsoft"
          },
          {
            "proName": "NASDAQ:GOOGL",
            "title": "Google"
          },
          {
            "proName": "NASDAQ:TSLA",
            "title": "Tesla"
          },
          {
            "proName": "NASDAQ:NVDA",
            "title": "NVIDIA"
          }
        ],
        "colorTheme": "${colorTheme}",
        "locale": "en",
        "largeChartUrl": "",
        "isTransparent": false,
        "showSymbolLogo": true,
        "displayMode": "adaptive"
      }`;
    
    container.current.appendChild(script);

    return () => {
      // Cleanup script when component unmounts or dependencies change
      if (container.current && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [resolvedTheme]);

  return (
    <div className="w-full ">
      <div className="tradingview-widget-container" ref={container}>
        <div className="tradingview-widget-container__widget"></div>
        <div className="tradingview-widget-copyright">
          <a 
            href="https://www.tradingview.com/" 
            rel="noopener nofollow" 
            target="_blank"
          >
            <span className="blue-text">Ticker tape by TradingView</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default memo(TradingViewTickerTape);
