import { routes } from './app.routes';
import { TrafficOverviewPage } from './pages/traffic-overview/traffic-overview-page';
import { CreateTrainPage } from './pages/create-train/create-train-page';

describe('routes', () => {
    it('defines the traffic overview route on the root path', () => {
        const overviewRoute = routes.find((route) => route.path === '');

        expect(overviewRoute?.component).toBe(TrafficOverviewPage);
    });

    it('defines the train detail route with an id parameter', () => {
        const trainRoute = routes.find((route) => route.path === 'create-train');

        expect(trainRoute?.component).toBe(CreateTrainPage);
    });
});
