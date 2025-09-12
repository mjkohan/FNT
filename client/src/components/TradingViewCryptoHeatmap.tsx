"use client";

import React, { useEffect, useRef, memo } from 'react';
import { useTheme } from "next-themes";

function TradingViewCryptoHeatmap() {
  const container = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!container.current) return;

    // Clear any existing content
    container.current.innerHTML = '';

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-crypto-coins-heatmap.js";
    script.type = "text/javascript";
    script.async = true;
    
    // Determine theme
    const colorTheme = resolvedTheme === 'dark' ? 'dark' : 'light';
    
    script.innerHTML = `
      {
        "dataSource": "Crypto",
        "blockSize": "market_cap_calc",
        "blockColor": "24h_close_change|5",
        "locale": "en",
        "symbolUrl": "",
        "colorTheme": "${colorTheme}",
        "hasTopBar": false,
        "isDataSetEnabled": false,
        "isZoomEnabled": false,
        "hasSymbolTooltip": true,
        "isMonoSize": false,
        "width": "100%",
        "height": "500"
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
    <div className="w-full">
      <div className="tradingview-widget-container" ref={container}>
        <div className="tradingview-widget-container__widget"></div>
        <div className="tradingview-widget-copyright">
          <a 
            href="https://www.tradingview.com/markets/cryptocurrencies/" 
            rel="noopener nofollow" 
            target="_blank"
          >
          </a>
        </div>
      </div>
    </div>
  );
}

export default memo(TradingViewCryptoHeatmap);
