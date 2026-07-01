type StatusBadgeProps = {
  status: string;
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const palette: Record<string, string> = {
    Draft: 'gray',
    Submitted: 'blue',
    Approved: 'green',
    Fulfilled: 'purple',
    Cancelled: 'red',
  };

  return <span style={{ color: palette[status] || 'black', fontWeight: 600 }}>{status}</span>;
}
