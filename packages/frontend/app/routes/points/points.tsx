import Welcome from '~/components/Welcome/Welcome';
import type { Route } from '../../+types/root';
export function meta() {
    return [
        { title: 'Points | Ambient' },
        { name: 'description', content: 'Trade Perps with Ambient' },
    ];
}

export function loader({ context }: Route.LoaderArgs) {
    return { message: context.VALUE_FROM_NETLIFY };
}

export default function Points() {
    return <Welcome title='Points' />;
}
