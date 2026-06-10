import { ParentGuard } from '@/lib/auth/client-guard'

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  return <ParentGuard>{children}</ParentGuard>
}
