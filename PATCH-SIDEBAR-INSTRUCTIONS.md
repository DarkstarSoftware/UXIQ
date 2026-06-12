# Add Clients to Sidebar

Open:

components/layout/sidebar.tsx

Add this import:

```tsx
import { Users } from 'lucide-react';
```

Then add this nav item:

```tsx
{ href: '/clients', label: 'Clients', icon: Users },
```

If your sidebar already imports icons in one line, add `Users` to that import.
