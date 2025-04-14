import Welcome from '~/components/Welcome/Welcome';
import type { Route } from '../../+types/root';
// import styles from './referrals.module.css'
export function meta({}: Route.MetaArgs) {
    return [
        { title: 'Perps - Referrals' },
        { name: 'description', content: 'Welcome to React Router!' },
    ];
}

export function loader({ context }: Route.LoaderArgs) {
    return { message: context.VALUE_FROM_NETLIFY };
}

export default function Referrals({ loaderData }: Route.ComponentProps) {
    return <Welcome title='Referrals' />;
}
