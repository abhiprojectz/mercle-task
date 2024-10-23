import { NextRequest } from "next/server";

// Chain data with User balance, fee, and time for bridging (in seconds)
// Each chain has a fee, balance, and time associated with bridging.
const chains: Chains = {
    polygon: { fee: 0, balance: 50, time: 0 },
    arbitrum: { fee: 1, balance: 100, time: 5 },
    base: { fee: 0.5, balance: 80, time: 4 },
    gnosis: { fee: 0.1, balance: 25, time: 3 },
    blast: { fee: 0.2, balance: 30, time: 2 },
};

// Simple status check
export async function GET() {
    const data = { status: "API is live..." };
    return new Response(JSON.stringify(data), { status: 200 });
}

// Main request to calculate the most efficient route
export async function POST(req: NextRequest) {
    // Capturing the start time
    const responseTime = performance.now();

    // Getting the request data
    const { targetChain, amount, tokenAddress }: PostRequestBody = await req.json();

    // Get available balances from chains except the target chain
    const availableBalances = Object.keys(chains)
        .filter((chain) => chain !== targetChain)
        .map((chain) => ({
            chain,
            balance: chains[chain].balance,
            fee: chains[chain].fee,
            time: chains[chain].time,
        }));

    // Variables to store total balance on the target chain, routes taken, and for total fees and time
    let totalBalanceOnTarget = chains[targetChain].balance;
    let routes: Route[] = [];
    let totalFees = 0;
    let totalTime = 0;

    // Calculating routes and fees.
    // First getting needed amount then sorting available balances by fee to find the cheapest options.
    if (totalBalanceOnTarget < amount) {
        let neededAmount = amount - totalBalanceOnTarget;
        availableBalances.sort((a, b) => a.fee - b.fee);

        // Checks if more funds are needed, then calculates the amount to bridge, updates the routes, total fees and time. 
        for (const chain of availableBalances) {
            if (neededAmount <= 0) break;
            let bridgeAmount = Math.min(chain.balance, neededAmount);
            routes.push({ sourceChain: chain.chain, amount: bridgeAmount, fee: chain.fee, time: chain.time });
            totalFees += chain.fee;
            totalTime += chain.time;
            neededAmount -= bridgeAmount;
        }
    }

    // Seding data to client with Calculated API response time at last.
    const data = {
        targetChain,
        tokenAddress,
        routes,
        totalFees,
        totalTime: `${totalTime} seconds`,
        responseTime: `${(performance.now() - responseTime).toFixed(5)} seconds`,
    };

    return new Response(JSON.stringify(data), { status: 200 });
}
