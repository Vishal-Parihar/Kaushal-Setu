const COLOR = {
  pending:     'bg-yellow-100 text-yellow-800',
  confirmed:   'bg-blue-100 text-blue-800',
  accepted:    'bg-blue-100 text-blue-800',
  in_progress: 'bg-indigo-100 text-indigo-800',
  completed:   'bg-green-100 text-green-800',
  cancelled:   'bg-red-100 text-red-700',
  rejected:    'bg-red-100 text-red-700',
}
const StatusBadge = ({ status }) => (
  <span className={`badge capitalize ${COLOR[status] || 'bg-gray-100 text-gray-600'}`}>
    {status?.replace('_', ' ')}
  </span>
)
export default StatusBadge
