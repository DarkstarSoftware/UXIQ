# Add Roadmaps to Sidebar

Open:

components/layout/sidebar.tsx

Add icon import:

```tsx
import { Map } from 'lucide-react';
```

Add nav item:

```tsx
{ href: '/roadmaps', label: 'Roadmaps', icon: Map },
```
