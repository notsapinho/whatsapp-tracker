import React, { Component } from "react";
import { Popup, Page, Navbar, NavRight, Link, Block } from "framework7-react";

export default class EnableCookies extends Component {
	constructor(props) {
		super(props);
		this.state = { popupOpened: !this.enabledCookies };
	}

	get enabledCookies() {
		try {
			(() => {})(window.localStorage);
			return true;
		} catch {
			return false;
		}
	}

	render() {
		return (
			<Popup
				className="enable-cookies-popup"
				closeByBackdropClick={false}
				closeOnEscape={false}
				opened={this.state.popupOpened}
			>
				<Page>
					<Navbar title="Enable Cookies">
						<NavRight>
							<Link onClick={() => window.location.reload()}>Check</Link>
						</NavRight>
					</Navbar>

					<div
						style={{ height: "100%" }}
						className="display-flex justify-content-center align-items-center text-align-center"
					>
						<Block style={{ fontSize: "1.3rem" }}>
							You need to enable Cookies, for this website to work
						</Block>
					</div>
				</Page>
			</Popup>
		);
	}
}
