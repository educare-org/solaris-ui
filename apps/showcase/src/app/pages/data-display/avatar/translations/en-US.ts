export const EN_US_AVATAR: Record<string, string> = {
  'avatar.title': 'Avatar',
  'avatar.description':
    'Identity block with photo, generative initials, presence, counts, group, and profile.',

  'avatar.section.examples': 'Examples',
  'avatar.section.status': 'Status',
  'avatar.section.badge': 'Count badge',
  'avatar.section.overlays': 'Overlays',
  'avatar.section.group': 'Group',
  'avatar.section.profile': 'Profile',
  'avatar.section.states': 'States',
  'avatar.section.size-radius': 'Size & radius',
  'avatar.section.installation': 'Installation',
  'avatar.section.props': 'Props',

  'avatar.examples.note':
    'Start with a photo, then the generative fallback, then the empty placeholder.',
  'avatar.status.note':
    'The dot renders per status. Force off-hours to preview the z emblem without changing the status color.',
  'avatar.badge.note':
    'Counts above max render as "{max}+" with the full value in the title tooltip. Zero hides the counter unless showZero is set.',
  'avatar.overlays.note':
    'Verified, organization, and action markers reuse slots — tooltips and menus come from the consumer.',
  'avatar.group.note':
    'Groups overlap members and truncate with a focusable +N pill that opens a consumer menu.',
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
  'avatar.example.add-member': 'Add member',
  'avatar.example.profile.name': 'Amelia Davis',
  'avatar.example.profile.email': 'davis@example.com',
  'avatar.example.profile.badge': 'PRO',

  'avatar.ai.prompt':
    "I'm looking at the Solaris UI documentation for {{component}} ({{url}}). Help me understand how to use it. Be ready to explain concepts, give examples, or help debug based on it.",
};
