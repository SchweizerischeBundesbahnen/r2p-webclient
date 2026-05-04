import { routes } from './app.routes';
import { TrafficOverview } from './traffic-overview/traffic-overview';
import { TrainDetail } from './train-detail/train-detail';

describe('routes', () => {
  it('defines the traffic overview route on the root path', () => {
    const overviewRoute = routes.find((route) => route.path === '');

    expect(overviewRoute?.component).toBe(TrafficOverview);
  });

  it('defines the train detail route with an id parameter', () => {
    const trainRoute = routes.find((route) => route.path === 'train/:id');

    expect(trainRoute?.component).toBe(TrainDetail);
  });
});

