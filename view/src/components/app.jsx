import { App, View } from "framework7-react";
import React from "react";
import { Provider } from "react-redux";
import routes from "../js/routes";
import store from "../js/store";
import EnableCookies from "./enableCookies";
import Introduction from "./introduction";
import Profile from "../pages/profile";

export default class extends React.Component {
	constructor() {
		super();

		this.state = {
			app: null,
			navigated: false,
			f7params: {
				name: "WhatsTracker",
				theme: "ios",
				routes: routes,
				swipeout: {
					removeElements: false,
				},
			},
		};
	}

	render() {
		const url = window.innerWidth > 800 ? "/help" : "/";
		return (
			<Provider store={store}>
				<App params={this.state.f7params}>
					<EnableCookies></EnableCookies>
					<Introduction></Introduction>
					<Profile></Profile>
					<View
						reloadDetail
						masterDetailBreakpoint={800}
						// masterDetailResizable
						preloadPreviousPage
						stackPages
						loadInitialPage
						main
						animate
						className="safe-areas"
						url={url}
					/>
				</App>
			</Provider>
		);
	}

	componentDidMount() {
		this.$f7ready((f7) => {
			this.setState({ app: f7, navigated: true });
			window.app = f7;
		});
	}
}
