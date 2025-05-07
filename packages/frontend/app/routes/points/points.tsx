import Welcome from '~/components/Welcome/Welcome';
import type { Route } from '../../+types/root';
export function meta() {
    return [
        { title: 'Perps - Points' },
        { name: 'description', content: 'Welcome to React Router!' },
    ];
}

export function loader({ context }: Route.LoaderArgs) {
    return { message: context.VALUE_FROM_NETLIFY };
}

export default function Points() {
    return <Welcome title='Points' />;
}
