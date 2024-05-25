interface TestButtonProps {
	elementSize: {
		w: number
		h: number
	}
	onClickStatic: () => void
	onClickDynamic: () => void
}

export const TestButtons = ({ elementSize, onClickStatic, onClickDynamic }: TestButtonProps) => (
	<div style={{
		width: `${elementSize.w}px`,
		height: `${elementSize.h}px`,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	}}>
		<button className="button is-primary is-large" type="button" onClick={() => onClickStatic()}>
			<span className="icon">
				<i className="mdi mdi-gamepad"></i>
			</span>
			<span>Static</span>
		</button>
		<button className="button is-primary is-large" type="button" onClick={() => onClickDynamic()}>
			<span className="icon">
				<i className="mdi mdi-gamepad"></i>
			</span>
			<span>Dynamic</span>
		</button>
	</div>
)
