import { ParentGuard } from '@/lib/auth/client-guard'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <ParentGuard>{children}</ParentGuard>
}
