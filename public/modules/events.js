export slidermove;

let slidermove = new CustomEvent(
	'newMessage',
	{
		detail: {
			message: 'Slider Moved!',
			time: new Date()
		},
		bubbles: true,
		cancelable: 
	}
)
