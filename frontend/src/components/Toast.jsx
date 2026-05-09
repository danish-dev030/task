import { useToastStore } from '../store/toastStore';

export default function Toast() {
  const { toast } = useToastStore();
  if (!toast) return null;
  return <div className={`toast ${toast.type}`}>{toast.message}</div>;
}
