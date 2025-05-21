import type { Route } from '../../+types/root';

export function meta() {
    return [
        { title: 'Pro | Ambient' },
        { name: 'description', content: 'Trade Perps with Ambient' },
    ];
}

export function loader({ context }: Route.LoaderArgs) {
    return { message: context.VALUE_FROM_NETLIFY };
}

export default function Market() {
    return (
        <div>
            <h2>Trade Prop</h2>
        </div>
    );
}
