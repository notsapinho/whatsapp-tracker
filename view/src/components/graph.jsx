import React from "react";
import { ListItem, List } from "framework7-react";
import "../css/graph.scss";

function Entry(props) {
	var { from, to, duration, children } = props;
	var length = duration;

	if (!isNaN(to - from)) {
		length = to - from;
	}

	if (length === 0) length = 0.01;

	return (
		<div
			{...props}
			className="time"
			style={{
				height: `calc(var(--graph-time-height) * ${length})`,
				top: `calc(var(--graph-time-height) * ${from})`,
			}}
		>
			{children}
		</div>
	);
}

function renderGraph({ users, data, today, tomorrow, single }) {
	return (
		<div className={"graph " + (single ? "single" : "")}>
			<div className="center">
				<div className="header">
					{Array.apply(null, Array(24)).map((_, hour) => (
						<div className="clock time" key={hour}>
							{hour < 10 ? "0" + hour : hour}:00
						</div>
					))}
					<div className="clock time"></div>
				</div>
				<div className="content">
					{Object.values(users).map((user) => {
						// filter dates only for this day
						var presences = (data[user.id] || []).filter(
							(presence) =>
								(presence.from > today && presence.from < tomorrow) ||
								(presence.to > today && presence.to < tomorrow)
						);

						return (
							<div className="user">
								<div className="times">
									{Array.apply(null, Array(24)).map((_, hour) => (
										<div className="grid" key={hour}>
											<hr></hr>
										</div>
									))}
									{presences.map((presence) => {
										var fromDate = new Date(presence.from);
										var from = fromDate.getHours() + fromDate.getMinutes() / 60;

										var toDate = new Date(presence.to);
										var to = toDate.getHours() + toDate.getMinutes() / 60;

										var duration = (presence.to - presence.from) / 1000 / 60 / 60; // duration in hours

										return (
											<Entry from={from} duration={duration}>
												<div className="left">
													<span className="from clock">
														{fromDate.getHours() +
															":" +
															(fromDate.getMinutes() < 10
																? "0" + fromDate.getMinutes()
																: fromDate.getMinutes())}
													</span>
													<span className="to clock">
														{toDate.getHours() +
															":" +
															(toDate.getMinutes() < 10
																? "0" + toDate.getMinutes()
																: toDate.getMinutes())}
													</span>
												</div>
												<div className="center">
													<span className="name">{/* {!single && user.name} */}</span>
												</div>
												<div className="right"></div>
											</Entry>
										);
									})}
								</div>
								<div className="legend time">{user.name}</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}

function renderList({ data, users, tomorrow, today, single }) {
	var date = new Date().toLocaleDateString();

	return (
		<div className={"presences " + (single ? "single" : "")}>
			{Object.values(users).map((user) => {
				var presences = (data[user.id] || []).filter(
					(presence) =>
						(presence.from > today && presence.from < tomorrow) ||
						(presence.to > today && presence.to < tomorrow)
				);

				var p = [...presences];
				var last;

				for (const [i, current] of Object.entries(p)) {
					if (!last) last = current;
					const index = Number(i);

					const next = presences[index + 1];
					if (!next) continue;

					if (next.from - last.to <= 1000 * 180) {
						p = p.filter((x) => x !== current);
						last.to = next.from;
					} else {
						last = current;
					}
				}

				return (
					<div className="user">
						<div className="list">
							{p.map((presence) => {
								var fromDate = new Date(presence.from);

								var from =
									`${fromDate.getHours()}`.padStart(2, "0") +
									":" +
									`${fromDate.getMinutes()}`.padStart(2, "0");

								var toDate = new Date(presence.to);
								var to =
									`${toDate.getHours()}`.padStart(2, "0") +
									":" +
									`${toDate.getMinutes()}`.padStart(2, "0");

								var duration = (presence.to - presence.from) / 1000 / 60 / 60; // duration in hours
								var durationHours = `${Math.floor(duration)}`.padStart(2, "0");
								var durationMinutes = `${Math.ceil((duration - durationHours) * 60)}`.padStart(2, "0");

								return (
									<div className="entry">
										<div className="start">{from}</div>
										<div className="duration">
											{durationHours}:{durationMinutes}
										</div>
										<div className="end">{to}</div>
									</div>
								);
							})}
						</div>
						<div className="name block-title">{!single && user.name}</div>
					</div>
				);
			})}
		</div>
	);
}

export default ({ data, users, single, date = Date.now(), list = false } = {}) => {
	const today = new Date(date);
	today.setHours(0, 0, 0, 0);
	const tomorrow = new Date(date);
	tomorrow.setHours(23, 59, 59, 59);

	if (single) {
		let user = users[single];
		users = {};
		users[single] = user;
	}

	if (list) return renderList({ data, users, tomorrow, today, single });

	return renderGraph({ data, users, tomorrow, today, single });
};
