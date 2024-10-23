// Contains all the required types for API

// Types for chain data, including fee for bridging, available balance, and time taken for bridging in seconds.
type ChainData = {
    fee: number;
    balance: number;
    time: number;
};

type Chains = {
    [key: string]: ChainData;
};

// Types for the POST request body
// Represents the body of the POST request for bridging funds.
type PostRequestBody = {
    targetChain: string;
    amount: number;
    tokenAddress: string;
};

// Types for the route response and their purpose:
type Route = {
    sourceChain: string;
    amount: number;
    fee: number;
    time: number;
};

/* RouteResponse contains details about the target chain, token address, 
   routes taken, total fees, total time, and API response time. */
type RouteResponse = {
    targetChain: string;
    tokenAddress: string;
    routes: Route[];
    totalFees: number;
    totalTime: string;
    responseTime: string;
};