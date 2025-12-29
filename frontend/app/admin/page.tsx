// @/app/admin/page.tsx
import { redirect } from 'next/navigation';

export default function AdminPage() {
  // The old content of this page has been moved to /admin/cms
  // We now redirect to the default orders page.
  redirect('/admin/orders');
  
  // Return null as redirect will throw an error and stop execution.
  return null;
}