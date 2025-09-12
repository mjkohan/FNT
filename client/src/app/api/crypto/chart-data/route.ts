import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // Get query parameters from the request URL
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol') || 'BTCUSDT';
    const interval = searchParams.get('interval') || '15m';
    //const limit = searchParams.get('limit') || '100';
    const limit =  '5';

    // Validate interval parameter (Binance supported intervals)
    const validIntervals = ['1m', '3m', '5m', '15m', '30m', '1h', '2h', '4h', '6h', '8h', '12h', '1d', '3d', '1w', '1M'];
    if (!validIntervals.includes(interval)) {
      return NextResponse.json(
        { error: 'Invalid interval. Must be one of: 1m, 3m, 5m, 15m, 30m, 1h, 2h, 4h, 6h, 8h, 12h, 1d, 3d, 1w, 1M' },
        { status: 400 }
      );
    }

    // Validate symbol parameter (basic validation for crypto symbols)
    if (!symbol || symbol.length < 3 || symbol.length > 10) {
      return NextResponse.json(
        { error: 'Invalid symbol. Must be 3-10 characters long' },
        { status: 400 }
      );
    }

    // Validate limit parameter
    const limitNum = parseInt(limit);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 1000) {
      return NextResponse.json(
        { error: 'Invalid limit. Must be a number between 1 and 1000' },
        { status: 400 }
      );
    }

    // Fetch data from Binance API
    const binanceUrl = `https://api.binance.com/api/v3/klines?symbol=${symbol.toUpperCase()}USDT&interval=${interval}&limit=${limitNum}`;
    const response = await fetch(binanceUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Binance API error: ${response.status} ${response.statusText}`);
    }

    const binanceData = await response.json();

    // Process Binance klines data
    const candles = binanceData.map((candle: unknown[]) => ({
      timestamp: candle[0], // Open time (ms since Unix epoch)
      open: parseFloat(String(candle[1])),
      high: parseFloat(String(candle[2])),
      low: parseFloat(String(candle[3])),
      close: parseFloat(String(candle[4])),
      //volume: parseFloat(String(candle[5])),
      //closeTime: candle[6], // Close time (ms since Unix epoch)
      //quoteVolume: parseFloat(String(candle[7])), // Quote asset volume
      //trades: parseInt(String(candle[8])), // Number of trades
      //takerBuyBaseVolume: parseFloat(String(candle[9])), // Taker buy base asset volume
      //takerBuyQuoteVolume: parseFloat(String(candle[10])) // Taker buy quote asset volume
    }));

    const latestPrice = candles.length > 0 ? candles[candles.length - 1]?.close : null;

    // Create clean chartData object
    const chartData = {
      symbol: symbol.toUpperCase(),
      timestamp: new Date().toISOString(),
      candles,
      latestPrice,
      metadata: {
        totalCandles: candles.length,
        dataSource: 'Binance API',
        lastUpdated: new Date().toISOString(),
        symbol,
        interval,
        limit: limitNum
      }
    };

    // Add success response headers
    const response2 = NextResponse.json(chartData);
    response2.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    
    return response2;

  } catch (error: unknown) {
    console.error("Binance API error:", error);
    
    // Return appropriate error response
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch chart data';
    
    return NextResponse.json(
      { 
        error: errorMessage,
        timestamp: new Date().toISOString(),
        symbol: new URL(request.url).searchParams.get('symbol') || 'BTCUSDT',
        interval: new URL(request.url).searchParams.get('interval') || '15m',
        limit: new URL(request.url).searchParams.get('limit') || '100'
      }, 
      { status: 500 }
    );
  }
}

// Optional: Add POST method for more complex queries
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { symbol, interval, limit = 100 } = body;

    // Validate required parameters
    if (!symbol || !interval) {
      return NextResponse.json(
        { error: 'Symbol and interval are required' },
        { status: 400 }
      );
    }

    // Reuse the same logic but with POST body parameters
    const { searchParams } = new URL(request.url);
    searchParams.set('symbol', symbol);
    searchParams.set('interval', interval);
    searchParams.set('limit', limit.toString());
    
    // Create a new request with the parameters
    const newRequest = new Request(`${request.url}?${searchParams.toString()}`);
    return GET(newRequest);

  } catch (error: unknown) {
    console.error("POST chart-data error:", error);
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
