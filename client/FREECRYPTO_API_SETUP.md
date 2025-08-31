# FreeCrypto API Setup Guide

## Required Environment Variables

To use the chart data API, you need to add the following API key to your `.env.local` file:

```bash
# FreeCrypto API Key (for chart data and technical indicators)
FREECRYPTO_API_KEY=your_freecrypto_api_key_here
```

## How to Get API Key

1. Go to [FreeCrypto API](https://freecryptoapi.com/)
2. Sign up for an account
3. Navigate to your dashboard
4. Generate an API key
5. Copy the generated key

## API Endpoint Usage

### GET Request (Query Parameters)

```bash
GET /api/crypto/chart-data?symbol=BTCUSDT&interval=1h
```

### POST Request (JSON Body)

```bash
POST /api/crypto/chart-data
Content-Type: application/json

{
  "symbol": "BTCUSDT",
  "interval": "1h",
  "limit": 100
}
```

## Supported Parameters

### Symbol
- **Format**: Cryptocurrency symbol (e.g., BTCUSDT, ETHUSDT, SOLUSDT)
- **Validation**: 3-10 characters long
- **Default**: BTCUSDT

### Interval
- **Supported Values**: 1m, 5m, 15m, 30m, 1h, 4h, 1d, 1w
- **Default**: 1h
- **Description**: Time interval for candlestick data

### Limit (POST only)
- **Type**: Number
- **Default**: 100
- **Max**: 1000 (API limit)
- **Description**: Number of candlesticks to return

## Response Format

```json
{
  "symbol": "BTCUSDT",
  "interval": "1h",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "candles": [
    {
      "timestamp": "2024-01-15T10:00:00.000Z",
      "open": 45000.50,
      "high": 45100.25,
      "low": 44950.75,
      "close": 45050.00,
      "volume": 1250.75
    }
  ],
  "indicators": {
    "RSI": 65.5,
    "MACD": {
      "macd": 125.50,
      "signal": 120.25,
      "histogram": 5.25
    },
    "MovingAverages": {
      "sma20": 44800.00,
      "sma50": 44500.00,
      "ema12": 44900.00,
      "ema26": 44600.00
    }
  },
  "latestPrice": 45050.00,
  "metadata": {
    "totalCandles": 20,
    "dataSource": "FreeCryptoAPI",
    "lastUpdated": "2024-01-15T10:30:00.000Z"
  }
}
```

## Error Responses

### Invalid Parameters
```json
{
  "error": "Invalid interval. Must be one of: 1m, 5m, 15m, 30m, 1h, 4h, 1d, 1w",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "symbol": "BTCUSDT",
  "interval": "invalid"
}
```

### API Key Missing
```json
{
  "error": "FreeCrypto API key not configured",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "symbol": "BTCUSDT",
  "interval": "1h"
}
```

### API Error
```json
{
  "error": "History API error: 401 Unauthorized",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "symbol": "BTCUSDT",
  "interval": "1h"
}
```

## Features

### 1. Historical Data
- **Candlestick data** with OHLCV (Open, High, Low, Close, Volume)
- **Configurable timeframes** from 1 minute to 1 week
- **Last 20 candles** by default (configurable via limit)

### 2. Technical Indicators
- **RSI (Relative Strength Index)**: Momentum oscillator
- **MACD**: Trend-following momentum indicator
- **Moving Averages**: SMA and EMA for different periods

### 3. Data Validation
- **Parameter validation** for symbols and intervals
- **Data type conversion** and sanitization
- **Error handling** with descriptive messages

### 4. Performance
- **Caching headers** for better performance
- **Efficient data processing** with proper error handling
- **Rate limiting** support (respects API limits)

## Example Usage in Frontend

```typescript
// Fetch chart data for Bitcoin with 1-hour intervals
const fetchChartData = async (symbol: string, interval: string) => {
  try {
    const response = await fetch(
      `/api/crypto/chart-data?symbol=${symbol}&interval=${interval}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch chart data');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Chart data error:', error);
    throw error;
  }
};

// Usage
const chartData = await fetchChartData('BTCUSDT', '1h');
console.log('Latest price:', chartData.latestPrice);
console.log('RSI:', chartData.indicators.RSI);
```

## Security Notes

- Never commit your `.env.local` file to version control
- Keep your API key secure and don't share it publicly
- Monitor your API usage to avoid rate limiting
- Consider implementing additional rate limiting for production use

## API Limits

- **FreeCrypto API**: Check your plan limits
- **Rate Limiting**: Respect API rate limits
- **Data Retention**: Historical data availability varies by plan

## Troubleshooting

### Common Issues

1. **401 Unauthorized**: Check your API key
2. **Invalid Symbol**: Ensure symbol format is correct (e.g., BTCUSDT not BTC)
3. **Invalid Interval**: Use only supported time intervals
4. **No Data**: Some symbols may not have data for all intervals

### Debug Mode

Enable debug logging by checking the console for detailed error messages and API responses.
