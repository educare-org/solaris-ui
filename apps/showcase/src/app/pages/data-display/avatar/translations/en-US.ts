export const EN_US_AVATAR: Record<string, string> = {
  'avatar.title': 'Avatar',
  'avatar.description':
    'Identity block with photo, generative initials, presence, counts, group, and profile.',

  'avatar.section.examples': 'Examples',
  'avatar.section.status': 'Status',
  'avatar.section.badge': 'Count badge',
  'avatar.section.overlays': 'Overlays',
  'avatar.section.group': 'Group',
  'avatar.section.group-badge': 'Group badge',
  'avatar.section.integrations': 'Integrations',
  'avatar.section.profile': 'Profile',
  'avatar.section.states': 'States',
  'avatar.section.size-radius': 'Size & radius',
  'avatar.section.installation': 'Installation',
  'avatar.section.props': 'Props',

  'avatar.examples.note':
    'Start with real photos (remote URLs with graceful generative fallback), then the generative fallback and the empty placeholder. Grow the group with the dashed add button — members live in memory only and reset on reload.',
  'avatar.status.note':
    'The dot renders per status. Force off-hours to preview the z emblem without changing the status color.',
  'avatar.badge.note':
    'Counts above max render as "{max}+" with the full value in the title tooltip. Zero hides the counter unless showZero is set.',
  'avatar.overlays.note':
    'Verified, organization, and action markers reuse slots — tooltips and menus come from the consumer.',
  'avatar.group.note':
    'Groups overlap members and truncate with a focusable +N pill that opens a consumer menu.',
  'avatar.group-badge.note':
    'A pill with a mini member cluster and a text label. The +N marker is static text, so the pill itself can be a link or a button.',
  'avatar.integrations.note':
    'Avatars never implement overlays: hover the avatar for a reused tooltip, and open the group member list through a consumer dropdown menu. The +N pill stays keyboard-focusable.',
  'avatar.profile.note':
    'Profiles pair identity with title, subtitle, and an optional badge. Compact mode renders the avatar only.',
  'avatar.states.note':
    'Active renders a continuous ring; loading renders an animated arc that stops under reduced motion.',
  'avatar.size-radius.note':
    'Sizes are fixed in px; radius follows the host, including every marker.',
  'avatar.installation.note':
    'Install the single Solaris package, then import the family.',
  'avatar.props.note': 'Props table coming soon with the table component.',

  'avatar.status.online': 'Online',
  'avatar.status.away': 'Away',
  'avatar.status.busy': 'Busy',
  'avatar.status.dnd': 'Do not disturb',
  'avatar.status.offline': 'Offline',

  'avatar.toggle.off-hours': 'Off-hours',
  'avatar.toggle.on-hours': 'On hours',
  'avatar.toggle.show-zero': 'Show zero',
  'avatar.toggle.hide-zero': 'Hide zero',
  'avatar.toggle.verified': 'Verified',
  'avatar.toggle.plain': 'No seal',
  'avatar.toggle.compact': 'Compact',
  'avatar.toggle.full': 'Full',

  'avatar.example.photo': 'Photo',
  'avatar.example.generative': 'Generative',
  'avatar.example.empty': 'Empty',
  'avatar.example.action': 'Edit photo',
  'avatar.example.highlight': 'Highlight avatar',
  'avatar.example.add-random': 'Add random member',
  'avatar.example.group-badge.label': 'Design team',
  'avatar.example.tooltip-hint': 'Amelia Davis — Online',
  'avatar.example.menu-opened': 'Menu opened via +N pill',
  'avatar.example.add-member': 'Add member',
  'avatar.example.profile.name': 'Amelia Davis',
  'avatar.example.profile.email': 'davis@example.com',
  'avatar.example.profile.badge': 'PRO',

  'avatar.ai.prompt':
    "I'm looking at the Solaris UI documentation for {{component}} ({{url}}). Help me understand how to use it. Be ready to explain concepts, give examples, or help debug based on it.",
};
