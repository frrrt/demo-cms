import React from "react";
import "./character-counter.scss";

interface CharacterCounterProps {
  currentLength: number;
  min?: number;
  max?: number;
}

export default function CharacterCounter({
  currentLength,
  min = 125,
  max = 150,
}: CharacterCounterProps) {
  const isInGoodRange = currentLength >= min && currentLength <= max;

  const getStatusText = () => {
    if (isInGoodRange) return "Good";
    if (currentLength < min) return "Consider adding more";
    return "Consider trimming";
  };

  return (
    <div className={`character-counter-box ${isInGoodRange ? "good" : "improve"}`}>
      <span className="counter-number">{currentLength}</span>
      <span className="counter-status">{getStatusText()}</span>
    </div>
  );
}
