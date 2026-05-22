# Phase 6: Settings & Management - Research

## Discovery Level 0: Skip

### Justification
This phase entails building out standard CRUD user interfaces for:
1. **Category Management**: Allowing the user to define categories and specify monthly budget limits.
2. **Vendor Management**: Allowing the user to fix vendor name typos and re-assign default categories.
3. **Transaction History**: A paginated view of past transactions.

Since we already have Dexie configured (`localDb.categories`, `localDb.vendors`, `localDb.transactions`) and the Next.js routing architecture is established, there are no new libraries or architectures needed. All UI elements will use standard React and Tailwind CSS.
