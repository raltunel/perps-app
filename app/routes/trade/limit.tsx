import type { Route } from '../../+types/root';

export function meta({}: Route.MetaArgs) {
    return [
        { title: 'New React Router App' },
        { name: 'description', content: 'Welcome to React Router!' },
    ];
}

export function loader({ context }: Route.LoaderArgs) {
    return { message: context.VALUE_FROM_NETLIFY };
}

export default function Limit({ loaderData }: Route.ComponentProps) {
    return (
        <div>
            <h2>Trade Limit</h2>
        </div>
    );
}
