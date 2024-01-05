import React, { useEffect, useState } from 'react';


type CountdownProps = {
  timestampTillNextDraw: number; // The timestamp to count down to
};

type TimeLeft = {
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
};

const MILLISECONDS_IN_SECOND = 1000;
const SECONDS_IN_MINUTE = 60;
const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;
const ONE_MINUTE_IN_MS = MILLISECONDS_IN_SECOND * SECONDS_IN_MINUTE;
const ONE_HOUR_IN_MS = ONE_MINUTE_IN_MS * MINUTES_IN_HOUR;
const ONE_DAY_IN_MS = ONE_HOUR_IN_MS * HOURS_IN_DAY;

export const Countdown: React.FC<CountdownProps> = ({ timestampTillNextDraw }) => {
  const calculateTimeLeft = () => {
    const difference = timestampTillNextDraw - Date.now();
    const timeLeft: TimeLeft = {};

    if (difference > 0) {
        timeLeft.days = Math.floor(difference / (ONE_DAY_IN_MS));
        timeLeft.hours = Math.floor((difference / ONE_HOUR_IN_MS) % HOURS_IN_DAY);
        timeLeft.minutes = Math.floor((difference / ONE_MINUTE_IN_MS) % MINUTES_IN_HOUR);
        timeLeft.seconds = Math.floor((difference / MILLISECONDS_IN_SECOND) % SECONDS_IN_MINUTE);
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Clear timeout if the component is unmounted
    return () => clearTimeout(timer);
  });

  const { days, hours, minutes, seconds } = timeLeft;

  if (!days && !hours && !minutes && !seconds) {
    return null;
  }
  return (
    <div>
      Next draw: {days}/{hours}/{minutes}/{seconds}
    </div>
  );
};

export default Countdown;