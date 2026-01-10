
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface Props {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}

const CountUp: React.FC<Props> = ({ value, duration = 1.5, decimals = 0, prefix = "", suffix = "" }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const obj = useRef({ val: 0 });

  useEffect(() => {
    gsap.to(obj.current, {
      val: value,
      duration: duration,
      ease: "power4.out",
      onUpdate: () => {
        setDisplayValue(obj.current.val);
      }
    });
  }, [value, duration]);

  return (
    <span>
      {prefix}{displayValue.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}{suffix}
    </span>
  );
};

export default CountUp;
