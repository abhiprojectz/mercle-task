"use client";
// Basic UI for frontend 

import { useState } from 'react';
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ApiResponse = {
  targetChain: string;
  tokenAddress: string;
  routes: { sourceChain: string; amount: number; fee: number; time: number }[];
  totalFees: number;
  totalTime: string;
  responseTime: string;
};

// Exporting page ui 
export default function Home() {
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const makeRequest = async (targetChain: string, amount: number, tokenAddress: string) => {
    setLoading(true);
    const res = await fetch('/api/bridge-route', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetChain, amount, tokenAddress }),
    });
    const data = await res.json();
    setResponse(data);
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center p-10">
      <Card className="w-full  mb-4 p-4">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Bridge Route API</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center p-4">
          <div className="flex space-x-4 mb-4">
            {/* 4 Test Scenarios cases  */}
            <Button onClick={() => makeRequest('polygon', 80, 'USDC')}>Scenario 1</Button>
            <Button onClick={() => makeRequest('polygon', 100, 'USDC')}>Scenario 2</Button>
            <Button onClick={() => makeRequest('polygon', 150, 'USDC')}>Scenario 3</Button>
            <Button onClick={() => makeRequest('polygon', 200, 'USDC')}>Scenario 4</Button>
          </div>
          {loading && <p className="text-center">Loading...</p>}
          {response && (
            <div className="mt-4">
              <h2 className="text-lg font-semibold mb-2">Response:</h2>
              <pre className="bg-gray-100 p-2 rounded">{JSON.stringify(response, null, 2)}</pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
