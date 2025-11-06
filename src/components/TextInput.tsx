import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TextInputProps {
  id: string;
  label: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  type?: 'text' | 'password' | 'email' | 'url';
}

const TextInput: React.FC<TextInputProps> = ({
  id,
  label,
  value,
  defaultValue,
  placeholder,
  onChange,
  type = 'text',
}) => {
  return (
    <div className="space-y-3">
      <Label htmlFor={id} className="text-base font-semibold">{label}</Label>
      <Input
        id={id}
        type={type}
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        className="h-11 text-base"
      />
    </div>
  );
};

export default TextInput;
