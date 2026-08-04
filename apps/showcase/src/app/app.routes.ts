import { Route } from '@angular/router';

import { configurationRoutes } from './routes/configuration.routes';
import { dataDisplayRoutes } from './routes/data-display.routes';
import { interactionRoutes } from './routes/interaction.routes';
import { navigationRoutes } from './routes/navigation.routes';
import { feedbackRoutes } from './routes/feedback.routes';
import { actionsRoutes } from './routes/actions.routes';
import { contentRoutes } from './routes/content.routes';
import { overlayRoutes } from './routes/overlay.routes';
import { formsRoutes } from './routes/forms.routes';

export const appRoutes: Route[] = [
  ...configurationRoutes,
  ...interactionRoutes,
  ...dataDisplayRoutes,
  ...navigationRoutes,
  ...feedbackRoutes,
  ...actionsRoutes,
  ...contentRoutes,
  ...overlayRoutes,
  ...formsRoutes,
];
