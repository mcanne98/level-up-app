import { ChildGuard } from '@/lib/auth/client-guard'

export default function ChildLayout({ children }: { children: React.ReactNode }) {
  return <ChildGuard>{children}</ChildGuard>
}
