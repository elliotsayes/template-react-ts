interface TestButtonProps {
	elementSize: {
		w: number
		h: number
	}
}

export const TestButton = ({ elementSize }: TestButtonProps) => (
	<div style={{
		width: `${elementSize.w}px`,
		height: `${elementSize.h}px`,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	}}>
		<button className="button is-primary is-large">
			<span className="icon">
				<i className="mdi mdi-gamepad"></i>
			</span>
			<span>Play</span>
		</button>
	</div>
)
