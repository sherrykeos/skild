"use client";

import React, { useState } from "react";
import { Download, TrendingUp } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function DownloadsChart() {
  const [period, setPeriod] = useState("30");

  // Sample trend points for technical developer visual
  const points = [
    { label: "Day 1", value: 120 },
    { label: "Day 5", value: 180 },
    { label: "Day 10", value: 260 },
    { label: "Day 15", value: 410 },
    { label: "Day 20", value: 380 },
    { label: "Day 25", value: 680 },
    { label: "Day 30", value: 920 },
  ];

  const maxValue = Math.max(...points.map((p) => p.value));

  return (
    <Card className="border-[#252D28] bg-[#0E1210]">
      <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm font-bold text-[#F1F4EF] flex items-center gap-2">
            <Download className="h-4 w-4 text-[#CCD7C5]" />
            <span>Downloads Overview</span>
          </CardTitle>
          <p className="text-xs text-[#707A72] mt-0.5">Aggregate package installations over time</p>
        </div>

        <div className="w-[130px]">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="h-8 bg-[#141916] border-[#252D28] text-xs">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent className="bg-[#0E1210] border-[#252D28]">
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-4">
        {/* Technical SVG Area chart */}
        <div className="h-48 w-full relative flex items-end justify-between gap-2 pt-6">
          <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 700 160">
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#CCD7C5" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#CCD7C5" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            {/* Grid lines */}
            <line x1="0" y1="40" x2="700" y2="40" stroke="#1A211D" strokeDasharray="3 3" />
            <line x1="0" y1="80" x2="700" y2="80" stroke="#1A211D" strokeDasharray="3 3" />
            <line x1="0" y1="120" x2="700" y2="120" stroke="#1A211D" strokeDasharray="3 3" />

            {/* Filled area */}
            <path
              d="M0,150 Q100,130 200,110 T400,60 T600,40 T700,20 L700,160 L0,160 Z"
              fill="url(#gradient)"
            />

            {/* Stroke line */}
            <path
              d="M0,150 Q100,130 200,110 T400,60 T600,40 T700,20"
              fill="none"
              stroke="#CCD7C5"
              strokeWidth="2.5"
            />

            {/* Peak marker */}
            <circle cx="700" cy="20" r="4" fill="#CCD7C5" stroke="#0E1210" strokeWidth="2" />
          </svg>
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-[#707A72] pt-3 border-t border-[#1A211D]">
          <span>30 days ago</span>
          <span>15 days ago</span>
          <span className="text-[#CCD7C5] font-semibold">Today (Peak: 1.2K/day)</span>
        </div>
      </CardContent>
    </Card>
  );
}
