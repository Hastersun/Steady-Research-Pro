import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SliderWithInputProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  showLabels?: boolean;
}

const SliderWithInput: React.FC<SliderWithInputProps> = ({
  id,
  label,
  value,
  onChange,
  min,
  max,
  step,
  showLabels = true,
}) => {
  const isDecimal = step < 1;
  
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="text-base font-semibold">{label}</Label>
        <Input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || min)}
          min={min}
          max={max}
          step={step}
          className="w-24 h-9 text-center font-mono"
        />
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
      />
      {showLabels && (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{isDecimal ? min.toFixed(1) : min}</span>
          <span>{isDecimal ? ((min + max) / 2).toFixed(1) : Math.floor((min + max) / 2)}</span>
          <span>{isDecimal ? max.toFixed(1) : max}</span>
        </div>
      )}
    </div>
  );
};

export default SliderWithInput;
