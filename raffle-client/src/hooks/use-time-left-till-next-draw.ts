import { useEffect, useState } from "react";
import { useTimestampTillNextDraw } from "./use-timestamp-till-next-draw";

const MILLISECONDS_IN_SECOND = 1000;
const SECONDS_IN_MINUTE = 60;
const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;
const ONE_MINUTE_IN_MS = MILLISECONDS_IN_SECOND * SECONDS_IN_MINUTE;
const ONE_HOUR_IN_MS = ONE_MINUTE_IN_MS * MINUTES_IN_HOUR;
const ONE_DAY_IN_MS = ONE_HOUR_IN_MS * HOURS_IN_DAY;
const FIVE_MINUTES_IN_MS = ONE_MINUTE_IN_MS * 5;

type TimeLeft = {
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
};

export const useTimeLeftTillNextDraw = () => {
    const timestampTillNextDraw = useTimestampTillNextDraw();
    const [timeLeft, setTimeLeft] = useState<TimeLeft>();
    const [stopTicketSale, setStopTicketSale] = useState(false)
    
  useEffect(() => {
    const calculateTimeLeft = () => {
        const difference = timestampTillNextDraw - Date.now();
        const timeLeft: TimeLeft = {};
        // Stop ticket sale if the difference is less than 5 Minutes
        if (difference <= FIVE_MINUTES_IN_MS) {
          setStopTicketSale(true) 
        }

        if (difference > 0) {
            timeLeft.days = Math.floor(difference / (ONE_DAY_IN_MS));
            timeLeft.hours = Math.floor((difference / ONE_HOUR_IN_MS) % HOURS_IN_DAY);
            timeLeft.minutes = Math.floor((difference / ONE_MINUTE_IN_MS) % MINUTES_IN_HOUR);
            timeLeft.seconds = Math.floor((difference / MILLISECONDS_IN_SECOND) % SECONDS_IN_MINUTE);
        }
        
        return timeLeft;
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Clear timeout if the component is unmounted
    return () => clearInterval(timer);
  }, [timestampTillNextDraw]);

  return {timeLeft, stopTicketSale};
}
