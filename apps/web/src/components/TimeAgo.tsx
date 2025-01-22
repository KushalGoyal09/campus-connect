"use client";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { getTimeAgo } from "@/lib/timeAgo";
import { useEffect, useState } from "react";

const TimeAgo = ({ date }: { date: Date }) => {
    const [time, setTime] = useState("");
    useEffect(() => {
        setTime(getTimeAgo(date));
    }, [date]);
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>
                    <p className="text-xs text-gray-400">{time}</p>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{date.toLocaleString()}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default TimeAgo;
