import React, { Component } from "react";
import {} from "framework7-react";
var i = 0;

class Calendar extends Component {
	constructor(props) {
		super(props);

		this.state = {
			date: new Date(),
			id: i++,
		};
	}

	componentDidMount() {
		this.init();
	}

	init() {
		const self = this;
		var calendarModal = window.app.calendar.create({
			inputEl: "#demo-calendar-modal" + this.state.id,
			openIn: "customModal",
			header: true,
			footer: true,
			value: [this.state.date],
			on: {
				dayClick(calendar, dayEl, year, month, day) {
					calendar.close();
					var date = new Date().setFullYear(year, month, day);
					self.setState({ date });

					if (self.props.onChange) {
						self.props.onChange(date);
					}
				},
			},
			disabled: {
				from: new Date(),
			},
		});
	}

	render() {
		return (
			<div className="calendarList list no-hairlines-md">
				<ul>
					<li>
						<div className="item-content item-input">
							<div className="item-inner">
								<div className="item-input-wrap">
									<input
										type="text"
										placeholder="Select date"
										id={"demo-calendar-modal" + this.state.id}
									/>
								</div>
							</div>
						</div>
					</li>
				</ul>
			</div>
		);
	}
}

export default Calendar;
