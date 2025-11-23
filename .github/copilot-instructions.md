# AgriVerse AI Coding Instructions

**Project**: 农业产品融销平台 (Agricultural Product Finance-Trade Platform)  
**Tech Stack**: React 18 + TypeScript + Vite + Tailwind CSS + Radix UI + Three.js  
**Last Updated**: 2025-11-18

---

## Architecture Overview

### Multi-Role Platform Structure
This is a **role-based SaaS** with 5 distinct personas: farmer (农户), buyer (买家), bank (银行), expert (专家), admin (管理员). Each role has:
- Separate navigation trees defined in `config/roleNavigation.ts`
- Role-specific dashboards and features
- Permission system via `RoleContext` (contexts/RoleContext.tsx)
- Role permissions hardcoded in `rolePermissions` object

**Key Pattern**: Use `useRole()` hook to access current role and `hasPermission()` to check access. Pages/components conditionally render based on role.

### Component Organization
- **`components/`** - Feature-organized structure (demand/, finance/, bank/, expert/, admin/, etc.)
- **`components/ui/`** - shadcn/ui base components (Radix UI primitives wrapped with Tailwind)
- **`components/common/`** - Shared components across roles (CartIcon, DemandFab, IMFloat, Model360, QtyStepper)
- **`pages/`** - Full-page views (MeetingRoomBooking, ExpertCalendar, Checkout, LoanApplication, etc.)

### State Management (Zustand)
**Pattern**: Define stores in `stores/` directory (cartStore.ts, demandStore.ts, loanStore.ts, etc.).
- **NOT global Redux**: Zustand for isolated domain state
- **Persist pattern**: Stores use `set()` and `get()` for mutations and queries
- **Toast feedback**: Use `sonner` for side-effect notifications on state changes

### Styling Strategy
- **Colors**: Custom role-specific palette defined in `tailwind.config.js`:
  - `aurora-cyan: #00D6C2`, `bio-green: #18FF74`, `quantum-purple: #A78BFA`, `plasma-pink: #F472B6`
- **Dark Mode Only**: Deep space theme applied globally via `useTheme()` hook (always night mode)
- **Glass Morphism**: Reusable `glass-morphism` class combining backdrop blur + semi-transparent background
- **Gradients**: Heavy use of gradient overlays for visual depth (see HomePage.tsx examples)

---

## Critical Developer Workflows

### Build & Run
```bash
# Development (hot reload on localhost:5173)
npm run dev

# Build (bundles with chunk splitting for Three.js, React vendors, UI vendors)
npm run build

# Preview production build locally
npm run preview

# Lint (strict mode, no unused vars)
npm run lint
```

### Build Output Structure
Vite creates manual chunks in `dist/`:
- `react-vendor.js` - React + React-DOM
- `ui-vendor.js` - Radix UI components  
- `motion-vendor.js` - Motion animation library
- `chart-vendor.js` - Recharts
- `three-vendor.js` - Three.js (ensures single instance via deduplication)

**Three.js Important**: Configured with `dedupe: ['three']` and alias in `vite.config.ts` to prevent duplicate instances that break 3D rendering.

### TypeScript Config
- **Target**: ES2020
- **Path Alias**: `@/*` maps to project root (use `@/components/`, `@/utils/`, etc.)
- **Strict Mode**: Enforced (no `any`, unused variables detected)

---

## Key Patterns & Conventions

### Role-Based Routing
No traditional router. Instead:
```tsx
// App.tsx manages page state via custom event dispatch
type PageType = "home" | "trade" | "finance" | "expert" | "profile" | "cart" | ...
setCurrentPage() + window.addEventListener('navigate-to-*')
// Use: window.dispatchEvent(new Event('navigate-to-meeting'))
```

**Navigation Config** (`config/roleNavigation.ts`):
```tsx
export const roleNavigations: Record<RoleType, NavItem[]> = {
  farmer: [{ id: 'home', label: '田心星云', icon: Home, color: '#18FF74' }],
  buyer: [{ id: 'home', label: '购市星云', icon: Grid, color: '#FFE600' }],
  // Each role has themed nav labels ("田心" for farmer, "购市" for buyer, etc.)
}
```

### Component Composition Patterns
**Modal/Dialog Pattern** (demand/cards/BasicInfoCard.tsx):
```tsx
// Use Radix UI Dialog + AnimatePresence
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
    <DialogContent>...</DialogContent>
  </motion.div>
</Dialog>
```

**List Rendering with Motion** (HomePage.tsx):
```tsx
{data.map((item, index) => (
  <motion.div
    key={item.id}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
  >
```

**Form Patterns** (demand/cards/BasicInfoCard.tsx):
- Use `react-hook-form` with `Zod` for validation
- Wrap Radix UI inputs with form context for error handling

### API Layer (`api/auth.ts`, `api/client.ts`)
- Typed interfaces for all requests/responses (LoginRequest, RegisterRequest, UserInfo, etc.)
- Base client with `post()`, `get()` methods + error handling
- Role types centralized: `type RoleType = 'farmer' | 'buyer' | 'bank' | 'expert' | 'admin'`

### Animation Library (Motion, not Framer Motion)
**Installed**: `motion` v11 (lightweight Framer Motion alternative)
```tsx
import { motion } from 'motion/react'
// AnimatePresence for exit animations, layout animations supported
```

### Custom Hooks
- **`useRole()`** - Access current role + permissions
- **`useRoleNav()`** - Get role-specific navigation
- **`useTheme()`** - Apply deep space theme (always returns `theme: 'night'`)
- **Domain-specific**: `useFarmerFinance()`, `useMapPicker()`, `useSignCanvas()`, etc.

---

## Common Tasks & Solutions

### Add New Page for a Role
1. Create component in `pages/` (e.g., `NewFeaturePage.tsx`)
2. Import in `App.tsx` and add to `PageType` union
3. Add dispatch handler in useEffect
4. Conditionally render in main switch based on role + currentPage

### Add New Feature to Admin Panel
1. Create component in `components/admin/` (e.g., `AnalyticsDashboard.tsx`)
2. Use `useRole()` to check `role === 'admin'`
3. Integrate with appropriate Zustand store if needed
4. Use Recharts for charts (see FeatureFlagControl.tsx example)

### Create UI Component Using shadcn/ui
1. Base components already in `components/ui/` (button.tsx, dialog.tsx, slider.tsx, etc.)
2. Compose with Tailwind utility classes
3. Example from FeatureFlagControl.tsx:
```tsx
<Button className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30">
```

### Form with Validation
```tsx
// Use react-hook-form + Zod
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema)
})
```

### Toast Notifications
```tsx
import { toast } from 'sonner'
toast.success('Operation complete')
toast.error('Something went wrong')
toast.loading('Processing...')
```

### Three.js Components
- Stored in `components/` with naming pattern `*Sphere.tsx`, `*Shader.ts`
- Shaders in `components/shaders/` (atmosphereShader.ts, meteorShader.ts, sunShader.ts)
- Use `three-singleton.ts` util to ensure single Three.js instance
- See `WebGLSphere.tsx` for full 3D scene setup

---

## Important Files Reference

| File | Purpose |
|------|---------|
| `App.tsx` | Main app shell, page routing via state + events, role selection |
| `contexts/RoleContext.tsx` | Global role + user data, permission checking |
| `config/roleNavigation.ts` | Role-specific nav configs + role metadata (colors, themes) |
| `stores/*.ts` | Domain-specific state (cart, demand, loan, meeting, messages) |
| `utils/useTheme.ts` | Deep space theme initialization |
| `components/ui/*.tsx` | Radix UI base components (all styled with Tailwind) |
| `vite.config.ts` | Build config, Three.js deduplication, chunk splitting |
| `tailwind.config.js` | Custom color palette, theme variables |

---

## Code Style & Preferences

- **Naming**: camelCase for functions/variables, PascalCase for components/types
- **Exports**: Named exports for utilities, default exports for React components
- **Imports**: Organize as: React imports → library imports → local imports
- **Props**: Use interface for component props (e.g., `interface CartIconProps { }`)
- **Async**: Favor async/await over .then() chains
- **CSS**: Prefer Tailwind utilities; custom CSS only in `index.css`
- **Comments**: JSDoc for exported functions, inline for complex logic

---

## Common Gotchas

⚠️ **Three.js Duplication**: Must use `dedupe` in vite.config.ts or 3D rendering breaks  
⚠️ **Role Context**: Always wrap components with `<RoleProvider>` (done in App.tsx)  
⚠️ **Dark Mode**: Colors must work on dark background; use opacity variants (`/20`, `/40`, etc.)  
⚠️ **Custom Events**: Page routing uses window events, not React Router (different mental model)  
⚠️ **Zustand Stores**: No persistence by default; implement in store if needed  
⚠️ **Animation Delays**: Use `delay: index * 0.1` for staggered list animations to avoid janky UX  

---

## Quick Debugging

- **Browser Console**: Check for Three.js errors, verify Redux store state
- **Network Tab**: Verify API calls to `/api/` endpoints
- **React DevTools**: Inspect component hierarchy, RoleContext values
- **Vite HMR**: Hot reload should preserve state; if broken, hard refresh
- **Strict Mode**: If errors about unused variables, check tsconfig.json strict rules

---

## Related Documentation

- README.md - High-level project structure
- guidelines/Guidelines.md - Design system specifics
- api/README.md - API endpoint reference
