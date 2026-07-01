type InputProps = {
  label: string;
  value: string;
  type?: string;
  onChange: (value: string) => void;
};

export default function Input({ label, value, type = 'text', onChange }: InputProps) {
  const inputId = `input-${label.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <label htmlFor={inputId} style={{ display: 'block', marginBottom: '0.5rem' }}>
      <span>{label}</span>
      <input
        id={inputId}
        aria-label={label}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        style={{ display: 'block', width: '100%', marginTop: '0.25rem' }}
      />
    </label>
  );
}
