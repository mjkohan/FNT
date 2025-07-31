import {useEffect, useRef} from "react";
let tvScriptLoadingPromise;

export default function TradingViewChart({ symbol, loader }) {
    const onLoadScriptRef = useRef();

    useEffect(
        () => {
            onLoadScriptRef.current = createWidget;

            if (!tvScriptLoadingPromise) {
                tvScriptLoadingPromise = new Promise((resolve) => {
                    const script = document.createElement('script');
                    script.id = 'tradingview-widget-loading-script';
                    script.src = 'https://s3.tradingview.com/tv.js';
                    script.type = 'text/javascript';
                    script.onload = resolve;

                    document.head.appendChild(script);
                });
            }

            tvScriptLoadingPromise.then(() => onLoadScriptRef.current && onLoadScriptRef.current());

            return () => onLoadScriptRef.current = null;

            function createWidget() {
                if (document.getElementById('technical-analysis-chart-demo') && 'TradingView' in window) {
                    new window.TradingView.widget({
                        container_id: "technical-analysis-chart-demo",
                        width: "100%",
                        height: "100%",
                        autosize: true,
                        symbol: symbol,
                        interval: "120",
                        timezone: "exchange",
                        theme: "dark",
                        style: "1",
                        withdateranges: true,
                        hide_side_toolbar: false,
                        allow_symbol_change: true,
                        save_image: false,
                        // studies: ["ROC@tv-basicstudies","StochasticRSI@tv-basicstudies","MASimple@tv-basicstudies"],
                        show_popup_button: true,
                        popup_width: "1000",
                        popup_height: "650",
                        locale: "en",
                        backgroundColor:"#131316",
                        enable_publishing: true,

                    });
                }
            }
        },
        [symbol]
    );
    return (
        <div className="min-h-[600px] relative bg-slate-400">
            
            
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
