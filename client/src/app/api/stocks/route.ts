import { NextResponse, NextRequest } from "next/server";

const POPULAR_TICKERS = [
  "AAPL"
  , "MSFT", "AMZN", "GOOGL", "META", "TSLA",
  "NVDA", "NFLX", "BRK.B", "JPM", "V", "DIS",
  "ADBE", "PYPL", "INTC", "CMCSA", "PEP", "KO",
  "CSCO", "ORCL", "CRM", "NKE", "MCD", "WMT",
  "BA", "COST", "IBM", "HON", "AMGN", "MDLZ"
];

export async function GET(req: NextRequest) {
  try {
    // Return the popular tickers array directly
    const stocksData = POPULAR_TICKERS.map(symbol => ({
      symbol,
      description: symbol, // Will be updated with real data from quote/logo APIs
      displaySymbol: symbol,
      type: "Common Stock",
      mic: "XNAS", // Default to NASDAQ
      figi: "",
      currency: "USD"
    }));

    return NextResponse.json(stocksData);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
// import { NextResponse, NextRequest } from "next/server";

// export async function GET(req: NextRequest) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const exchange = searchParams.get("exchange") || "US";

//     // Optional: only fetch NASDAQ or NYSE to reduce list to more known stocks
//     const mic = searchParams.get("mic") || "XNGS"; // NASDAQ default
    

//     // Build query string
//     const params = new URLSearchParams({  exchange: "US", mic: "XNGS" });
//     console.log(params.toString());
//     const res = await fetch(
//       `https://finnhub.io/api/v1/stock/symbol?${params.toString()}&token=${process.env.FINHUB_API_KEY}`,
//       {
//         headers: { "Accept": "application/json" },
//         next: { revalidate: 600 }, // cache 10 min
//       }
//     );

//     if (!res.ok) {
//       return NextResponse.json({ error: "Failed to fetch data" }, { status: res.status });
//     }

//     const data = await res.json();
//     console.log(data);
//     // Limit locally to first 50 symbols (mostly famous)
//     const limited = data.slice(0, 50);

//     return NextResponse.json(limited);
//   } catch (e) {
//     console.error(e);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }

