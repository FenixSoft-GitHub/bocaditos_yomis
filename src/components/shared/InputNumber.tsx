import NumberFlow from '@number-flow/react'
import clsx from 'clsx'
import { Minus, Plus } from 'lucide-react'
import * as React from 'react'
type Props = {
	value?: number
	min?: number
	max?: number
	onChange?: (value: number) => void
	className?: string
	classNameIcon?: string
} 
export default function InputNumber({ value = 0, min = -Infinity, max = Infinity, onChange, className, classNameIcon }: Props) {
	const defaultValue = React.useRef(value)
	const inputRef = React.useRef<HTMLInputElement>(null)
	const [animated, setAnimated] = React.useState(true)
	// Hide the caret during transitions so you can't see it shifting around:
	const [showCaret, setShowCaret] = React.useState(true)
	const handleInput: React.ChangeEventHandler<HTMLInputElement> = ({ currentTarget: el }) => {
		setAnimated(false)
		let next = value
		if (el.value === '') {
			next = defaultValue.current
		} else {
			const num = el.valueAsNumber
			if (!isNaN(num) && min <= num && num <= max) next = num
		}
		// Manually update the input.value in case the number stays the same e.g. 09 == 9
		el.value = String(next)
		onChange?.(next)
	}
	const handlePointerDown = (diff: number) => (event: React.PointerEvent<HTMLButtonElement>) => {
		setAnimated(true)
		if (event.pointerType === 'mouse') {
			event?.preventDefault()
			inputRef.current?.focus()
		}
		const newVal = Math.min(Math.max(value + diff, min), max)
		onChange?.(newVal)
	}
	return (
		<div className={`group flex justify-between items-stretch rounded-md font-semibold ring ring-cocoa/90 transition-[box-shadow] focus-within:ring-2 focus-within:ring-amber-500 dark:ring-cream/50 ${className}`}>
			<button
				aria-hidden="true"
				tabIndex={-1}
				className="flex items-center pl-[.5em] pr-[.325em]"
				disabled={min != null && value <= min}
				onPointerDown={handlePointerDown(-1)}
			>
				<Minus className={classNameIcon} absoluteStrokeWidth strokeWidth={3.5} />
			</button>
			<div className="relative grid items-center justify-items-center text-center [grid-template-areas:'overlap'] *:[grid-area:overlap]">
				<input
					ref={inputRef}
					className={clsx(
						showCaret ? 'caret-primary' : 'caret-transparent',
						'spin-hide w-[1.5em] bg-transparent py-2 text-center font-[inherit] text-transparent outline-none'
					)}
					// Make sure to disable kerning, to match NumberFlow:
					style={{ fontKerning: 'none' }}
					type="number"
					min={min}
					step={1}
					autoComplete="off"
					inputMode="numeric"
					max={max}
					value={value}
					onInput={handleInput}
				/>
				<NumberFlow
					value={value}
					locales="en-US"
					format={{ useGrouping: false }}
					aria-hidden="true"
					animated={animated}
					onAnimationsStart={() => setShowCaret(false)}
					onAnimationsFinish={() => setShowCaret(true)}
					className="pointer-events-none"
					willChange
				/>
			</div>
			<button
				aria-hidden="true"
				tabIndex={-1}
				className="flex items-center pl-[.325em] pr-[.5em]"
				disabled={max != null && value >= max}
				onPointerDown={handlePointerDown(1)}
			>
				<Plus className={classNameIcon} absoluteStrokeWidth strokeWidth={3.5} />
			</button>
		</div>
	)
}