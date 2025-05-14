import React, { useMemo } from 'react'
import Countdown from 'react-countdown';

const Timer = ({time,setIsExpire}) => {
  const targetTime = useMemo(()=>Date.now()+time,[time]);
  return (
    <div className="timer">
        <Countdown onComplete={()=>setIsExpire(true)} date={targetTime} /> 
    </div>
  )
}

export default Timer