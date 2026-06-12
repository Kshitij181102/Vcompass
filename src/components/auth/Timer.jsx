import React, { useMemo } from 'react';
import Countdown from 'react-countdown';
import { Clock } from 'lucide-react';

const Timer = ({ time, setIsExpire }) => {
  const targetTime = useMemo(() => Date.now() + time, [time]);

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.35rem',
      fontSize: '0.84rem',
      color: '#b45309',
      fontFamily: 'Outfit, sans-serif',
      fontWeight: 500,
    }}>
      <Clock size={14} strokeWidth={2} />
      Resend in <Countdown onComplete={() => setIsExpire(true)} date={targetTime} />
    </span>
  );
};

export default Timer;
