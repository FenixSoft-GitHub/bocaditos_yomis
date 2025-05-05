import { ImSpinner9 } from 'react-icons/im';

interface Props {
  size: number;
}

export const Loader = ({size}: Props) => {
	return (
		<div className='flex items-center justify-center h-screen dark:bg-fondo-dark'>
			<ImSpinner9 className='animate-spin text-choco dark:text-cream' size={size} />
		</div>
	);
};