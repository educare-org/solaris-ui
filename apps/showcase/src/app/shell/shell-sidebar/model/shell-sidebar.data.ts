export interface ShowcaseSidebarNavItem {
  readonly labelKey: string;
  readonly route?: string;
  readonly children?: readonly ShowcaseSidebarNavItem[];
}

export interface ShowcaseSidebarNavGroup {
  readonly labelKey: string;
  readonly items: readonly ShowcaseSidebarNavItem[];
}

export interface ShowcaseSidebarNavSection {
  readonly labelKey: string;
  readonly items: readonly ShowcaseSidebarNavItem[];
  readonly groups: readonly ShowcaseSidebarNavGroup[];
}

/**
 * Sidebar navigation derived from `apps/showcase/src/app/routes/*.routes.ts`.
 * Top-level sections split pages by route type (getting started, foundation,
 * components); inside the components section, groups are discreet collapsible
 * sub-groups. Keep routes in sync with the route files when adding pages.
 */
export const SHELL_SIDEBAR_SECTIONS: readonly ShowcaseSidebarNavSection[] = [
  {
    labelKey: 'shell.sidebar.section.getting-started',
    items: [
      {
        labelKey: 'shell.sidebar.item.configuration',
        route: '/configuration',
      },
    ],
    groups: [],
  },
  {
    labelKey: 'shell.sidebar.section.foundation',
    items: [{ labelKey: 'shell.sidebar.item.icons', route: '/icons' }],
    groups: [],
  },
  {
    labelKey: 'shell.sidebar.section.components',
    items: [],
    groups: [
      {
        labelKey: 'shell.sidebar.group.actions',
        items: [
          { labelKey: 'shell.sidebar.item.button', route: '/actions/button' },
          {
            labelKey: 'shell.sidebar.item.icon-button',
            route: '/actions/icon-button',
          },
          {
            labelKey: 'shell.sidebar.item.button-group',
            route: '/actions/button-group',
          },
        ],
      },
      {
        labelKey: 'shell.sidebar.group.calendar',
        items: [
          {
            labelKey: 'shell.sidebar.item.month-view',
            route: '/scheduling/month-view',
          },
          {
            labelKey: 'shell.sidebar.item.week-view',
            route: '/scheduling/week-view',
          },
          {
            labelKey: 'shell.sidebar.item.year-view',
            route: '/scheduling/year-view',
          },
          {
            labelKey: 'shell.sidebar.item.schedule-view',
            route: '/scheduling/schedule-view',
          },
        ],
      },
      {
        labelKey: 'shell.sidebar.group.content',
        items: [
          {
            labelKey: 'shell.sidebar.item.divider',
            route: '/content/divider',
          },
        ],
      },
      {
        labelKey: 'shell.sidebar.group.data-display',
        items: [
          {
            labelKey: 'shell.sidebar.item.avatar',
            route: '/data-display/avatar',
          },
          {
            labelKey: 'shell.sidebar.item.badge',
            route: '/data-display/badge',
          },
          {
            labelKey: 'shell.sidebar.item.card',
            route: '/data-display/card',
          },
          {
            labelKey: 'shell.sidebar.item.code-block',
            route: '/data-display/code-block',
          },
          {
            labelKey: 'shell.sidebar.item.preview-code',
            route: '/data-display/preview-code',
          },
          {
            labelKey: 'shell.sidebar.item.tables',
            children: [
              {
                labelKey: 'shell.sidebar.item.table',
                route: '/data-display/tables/table',
              },
              {
                labelKey: 'shell.sidebar.item.gradebook',
                route: '/data-display/tables/gradebook',
              },
              {
                labelKey: 'shell.sidebar.item.record-grid',
                route: '/data-display/tables/record-grid',
              },
            ],
          },
        ],
      },
      {
        labelKey: 'shell.sidebar.group.feedback',
        items: [
          { labelKey: 'shell.sidebar.item.alert', route: '/feedback/alert' },
          { labelKey: 'shell.sidebar.item.toast', route: '/feedback/toast' },
          {
            labelKey: 'shell.sidebar.item.loading',
            children: [
              {
                labelKey: 'shell.sidebar.item.skeleton',
                route: '/feedback/loading/skeleton',
              },
              {
                labelKey: 'shell.sidebar.item.spinner',
                route: '/feedback/loading/spinner',
              },
              {
                labelKey: 'shell.sidebar.item.progress',
                route: '/feedback/loading/progress',
              },
              {
                labelKey: 'shell.sidebar.item.loading-text',
                route: '/feedback/loading/loading-text',
              },
            ],
          },
        ],
      },
      {
        labelKey: 'shell.sidebar.group.forms',
        items: [
          {
            labelKey: 'shell.sidebar.item.text-fields',
            children: [
              {
                labelKey: 'shell.sidebar.item.form-field',
                route: '/forms/form-field',
              },
              { labelKey: 'shell.sidebar.item.input', route: '/forms/input' },
              {
                labelKey: 'shell.sidebar.item.textarea',
                route: '/forms/textarea',
              },
              {
                labelKey: 'shell.sidebar.item.password-field',
                route: '/forms/password-field',
              },
              {
                labelKey: 'shell.sidebar.item.email-field',
                route: '/forms/email-field',
              },
              {
                labelKey: 'shell.sidebar.item.phone-field',
                route: '/forms/phone-field',
              },
              {
                labelKey: 'shell.sidebar.item.otp-input',
                route: '/forms/otp-input',
              },
            ],
          },
          {
            labelKey: 'shell.sidebar.item.file-upload',
            route: '/forms/file-upload',
          },
          {
            labelKey: 'shell.sidebar.item.selection-controls',
            children: [
              {
                labelKey: 'shell.sidebar.item.checkboxes',
                children: [
                  {
                    labelKey: 'shell.sidebar.item.checkbox',
                    route: '/forms/checkbox',
                  },
                  {
                    labelKey: 'shell.sidebar.item.checkbox-group',
                    route: '/forms/checkbox-group',
                  },
                ],
              },
              {
                labelKey: 'shell.sidebar.item.radios',
                children: [
                  {
                    labelKey: 'shell.sidebar.item.radio',
                    route: '/forms/radio',
                  },
                  {
                    labelKey: 'shell.sidebar.item.radio-group',
                    route: '/forms/radio-group',
                  },
                ],
              },
              {
                labelKey: 'shell.sidebar.item.switches',
                children: [
                  {
                    labelKey: 'shell.sidebar.item.switch',
                    route: '/forms/switch',
                  },
                  {
                    labelKey: 'shell.sidebar.item.switch-group',
                    route: '/forms/switch-group',
                  },
                ],
              },
              {
                labelKey: 'shell.sidebar.item.selection-card',
                route: '/forms/selection-card',
              },
            ],
          },
          {
            labelKey: 'shell.sidebar.item.pickers',
            children: [
              {
                labelKey: 'shell.sidebar.item.selects',
                children: [
                  {
                    labelKey: 'shell.sidebar.item.option',
                    route: '/forms/option',
                  },
                  {
                    labelKey: 'shell.sidebar.item.select',
                    route: '/forms/select',
                  },
                  {
                    labelKey: 'shell.sidebar.item.multi-select',
                    route: '/forms/multi-select',
                  },
                ],
              },
              {
                labelKey: 'shell.sidebar.item.date-picker',
                route: '/forms/date-picker',
              },
            ],
          },
        ],
      },
      {
        labelKey: 'shell.sidebar.group.interaction',
        items: [
          {
            labelKey: 'shell.sidebar.item.popover',
            route: '/interaction/popover',
          },
          {
            labelKey: 'shell.sidebar.item.tooltip',
            route: '/interaction/tooltip',
          },
          {
            labelKey: 'shell.sidebar.item.dropdown-menu',
            route: '/interaction/dropdown-menu',
          },
          {
            labelKey: 'shell.sidebar.item.collapsible',
            route: '/interaction/collapsible',
          },
          {
            labelKey: 'shell.sidebar.item.accordion',
            route: '/interaction/accordion',
          },
        ],
      },
      {
        labelKey: 'shell.sidebar.group.navigation',
        items: [
          { labelKey: 'shell.sidebar.item.tabs', route: '/navigation/tabs' },
          {
            labelKey: 'shell.sidebar.item.breadcrumb',
            route: '/navigation/breadcrumb',
          },
          {
            labelKey: 'shell.sidebar.item.mega-menu',
            route: '/navigation/mega-menu',
          },
          {
            labelKey: 'shell.sidebar.item.stepper',
            route: '/navigation/stepper',
          },
          {
            labelKey: 'shell.sidebar.item.segmented-control',
            route: '/navigation/segmented-control',
          },
          {
            labelKey: 'shell.sidebar.item.editable-tabs',
            route: '/navigation/editable-tabs',
          },
          {
            labelKey: 'shell.sidebar.item.pagination',
            route: '/navigation/pagination',
          },
        ],
      },
      {
        labelKey: 'shell.sidebar.group.overlay',
        items: [
          {
            labelKey: 'shell.sidebar.item.dialog',
            route: '/overlay/dialog',
          },
        ],
      },
    ],
  },
];
