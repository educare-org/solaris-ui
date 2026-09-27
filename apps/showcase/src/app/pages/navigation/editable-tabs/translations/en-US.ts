export const EDITABLE_TABS_TRANSLATIONS_EN_US: Record<string, string> = {
  'editableTabs.title': 'Editable Tabs',
  'editableTabs.description':
    'Editable Tabs allow users to rename, remove, reorder, and manage tab sets using the existing Tabs and Dropdown Menu foundation.',
  'editableTabs.basic': 'Basic Editable Tabs',
  'editableTabs.icons-and-badges': 'Icons and Badges',
  'editableTabs.locked': 'Locked Tab',
  'editableTabs.rename': 'Inline Rename',
  'editableTabs.remove': 'Remove Behavior',
  'editableTabs.move': 'Move Left/Right',
  'editableTabs.default-event': 'Set as Default Event',
  'editableTabs.custom-actions': 'Custom Actions',
  'editableTabs.vertical': 'Vertical Orientation',
  'editableTabs.compact': 'Compact Density',
  'editableTabs.note':
    'Editable Tabs does not persist state internally. All persistence decisions (localStorage, backend, route params, user profile, tenant settings) are delegated to the consumer through events.',
  'editableTabs.example.basic.active-tab': 'Active tab: {{ value }}',
  'editableTabs.example.locked.description':
    'The "General" tab is locked — it cannot be renamed, removed, or moved.',
  'editableTabs.example.rename.description':
    'Click the ellipsis icon on a tab, select "Rename", type a new name, and press Enter.',
  'editableTabs.example.remove.description':
    'Remove tabs via the action menu. The last tab cannot be removed (minTabs=1).',
  'editableTabs.example.move.description':
    'Move tabs left/right using the action menu, or drag and drop a tab to a new position. Edge tabs have their menu move actions disabled.',
  'editableTabs.example.default-event.description':
    'Default tab: {{ value }} (not persisted by Solaris)',
  'editableTabs.example.custom-actions.last-action':
    'Last action: {{ action }}',
  'editableTabs.section.examples': 'Examples',
  'editableTabs.section.management': 'Rename, remove and move',
  'editableTabs.section.features': 'Features',
  'editableTabs.section.layout': 'Layout',
  'editableTabs.section.installation': 'Installation',
  'editableTabs.section.props': 'Props',
  'editableTabs.examples.note':
    'Start with the default editable tabs, then explore management actions and variants below. Tabs can also be reordered by drag and drop when dragToReorder is enabled.',
  'editableTabs.management.note':
    'Rename, remove and reorder actions live in the tab action menu. Drag and drop emits the same tabMove event as the menu actions.',
  'editableTabs.drag-reorder': 'Drag to reorder',
  'editableTabs.example.drag-reorder.description':
    'Drag a tab and drop it at a new position. The drop indicator shows where the tab will land.',
  'editableTabs.installation.note':
    'Install the single Solaris package, then import the component.',
  'editableTabs.props.note':
    'Props table coming soon with the table component.',
  'editableTabs.ai.prompt':
    "I'm looking at the Solaris UI documentation for {{component}} ({{url}}). Help me understand how to use it. Be ready to explain concepts, give examples, or help debug based on it.",
};
