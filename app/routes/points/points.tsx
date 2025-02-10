import Welcome from '~/components/Welcome/Welcome';
import type { Route } from '../+types/home';
import styles from './points.module.css'
export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Perps - Points' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

export function loader({ context }: Route.LoaderArgs) {
  return { message: context.VALUE_FROM_NETLIFY };
}

export default function Points({ loaderData }: Route.ComponentProps) {
  return <Welcome title='Points' />;
}
