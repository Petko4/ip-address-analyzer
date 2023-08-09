interface TableRecordProps {
  name: string;
  value: string;
}

export function TableRecord({ name, value }: TableRecordProps) {
  return (
    <tr className="border-b border-white">
      <th className="text-left pr-5">{name}</th>
      <td>{value}</td>
    </tr>
  );
}
