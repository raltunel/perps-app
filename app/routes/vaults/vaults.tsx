import Welcome from '~/components/Welcome/Welcome';
import type { Route } from '../+types/home';
import styles from './vaults.module.css'
export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Perps - Vaults' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

export function loader({ context }: Route.LoaderArgs) {
  return { message: context.VALUE_FROM_NETLIFY };
}

export default function Vaults({ loaderData }: Route.ComponentProps) {
  return <Welcome title='Vaults' />;
}
