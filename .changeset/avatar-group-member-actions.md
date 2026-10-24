---
'@educarehq/solaris-ui': minor
---

Add per-member actions and hover interaction to `solaris-avatar-group` and `solaris-avatar-group-badge`: `SolarisAvatarGroupUser` accepts `actionAriaLabel` / `actionAriaLabelKey` to render that member as an interactive avatar button, with a new `memberClick` output emitting `{ user, index }`. Badge members only render actions when the pill itself is static (never nested inside a link/button). Both clusters lift the hovered/focused avatar (`translateY(-4px)`), dim siblings to `var(--solaris-opacity-60)`, thicken the separator ring to `var(--solaris-spacing-3)`, and disable the lift under reduced motion.
