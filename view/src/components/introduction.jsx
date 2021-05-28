import React, { Component } from "react";
import { Popup } from "framework7-react";
import Help from "./help";

export default class Introduction extends Component {
	constructor(props) {
		super(props);
		this.state = { popupOpened: !this.alreadyViewed };
	}

	get alreadyViewed() {
		if (
			["AdsBot-Google-Mobile", "AdsBot-Google", "Googlebot", "FeedFetcher-Google"].find((x) =>
				navigator.userAgent.includes(x)
			)
		) {
			return true;
		}
		try {
			return localStorage.getItem("introduction");
		} catch (error) {
			return false;
		}
	}

	view = () => {
		this.setState({ popupOpened: false });
		localStorage.setItem("introduction", true);
	};

	render() {
		return (
			<Popup className="introduction" push opened={this.state.popupOpened} onPopupClosed={this.view}>
				<Help></Help>
			</Popup>
		);
	}
}
