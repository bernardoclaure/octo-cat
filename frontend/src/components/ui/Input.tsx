type InputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export default function Input({ label, value, onChange }: InputProps) {
  return (
    <label>
      {label}
      <input value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}
