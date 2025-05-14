interface Props {
	content: string;
	className?: string;
}

export const CellTableProduct = ({ content, className }: Props) => {
	return (
		<td className={`px-4 py-2 font-medium tracking-tighter ${className}`}>{content}</td>
	);
};