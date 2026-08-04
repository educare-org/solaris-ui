import { Route } from '@angular/router';

import { configurationRoutes } from './routes/configuration.routes';
import { dataDisplayRoutes } from './routes/data-display.routes';
import { feedbackRoutes } from './routes/feedback.routes';
import { actionsRoutes } from './routes/actions.routes';
import { formsRoutes } from './routes/forms.routes';
import { interactionRoutes } from './routes/interaction.routes';
import { navigationRoutes } from './routes/navigation.routes';
import { contentRoutes } from './routes/content.routes';
import { overlayRoutes } from './routes/overlay.routes';

export const appRoutes: Route[] = [
  ...configurationRoutes,
  ...dataDisplayRoutes,
  ...feedbackRoutes,
  ...actionsRoutes,
  ...formsRoutes,
  ...interactionRoutes,
  ...navigationRoutes,
  ...contentRoutes,
  ...overlayRoutes,
];
