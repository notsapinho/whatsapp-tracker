import React, { Component } from "react";
import {
	Popup,
	Page,
	LoginScreenTitle,
	List,
	ListInput,
	Block,
	Button,
	Preloader,
	Navbar,
	NavRight,
	Link,
	Icon,
} from "framework7-react";
import { connect } from "react-redux";
import request from "../js/request";
import client from "../js/client";

class Profile extends Component {
	constructor(props) {
		super(props);

		this.state = { loading: false, error: "", name: this.props.user.name };
	}

	save = async () => {
		if (!this.doesFollow) return this.login();
		try {
			const name = this.state.name || this.props.user.name;
			this.setState({ loading: true });
			await request("/user/name", { method: "PATCH", body: { name } });

			this.props.dispatch({ type: "SET_USER", payload: { ...this.props.user, name } });
			window.app.notification
				.create({
					title: "Username saved",
					closeOnClick: true,
					closeTimeout: 4000,
				})
				.open();
		} catch (error) {}
		this.setState({ loading: false });
	};

	login = async () => {
		try {
			this.setState({ loading: true });
			const name = this.state.name || this.props.user.name;
			const { user, token } = await request("/login", { method: "POST", body: { name } });
			this.props.dispatch({ type: "SET_USER", payload: user });

			localStorage.setItem("token", token);
			window.app.notification
				.create({
					title: "Logged in",
					closeOnClick: true,
					closeTimeout: 4000,
				})
				.open();

			await client.init(true);
			window.app.popup.close(".profile");
		} catch (error) {}
		this.setState({ loading: false });
	};

	logout = async () => {
		try {
			this.setState({ loading: true });
			localStorage.removeItem("token");
			const { user, token } = await request("/register", { method: "POST" });
			localStorage.setItem("token", token);
			this.props.dispatch({ type: "SET_USER", payload: user });

			window.app.notification
				.create({
					title: "Logged out",
					closeOnClick: true,
					closeTimeout: 4000,
				})
				.open();

			await client.init(true);
			window.app.popup.close(".profile");
		} catch (error) {}
		this.setState({ loading: false });
	};

	update = (event) => {
		this.setState({ name: event.currentTarget.value || this.props.user.name });
	};

	/** @returns {boolean} */
	get doesFollow() {
		return Object.keys(this.props.follower).length;
	}

	lock = async () => {
		window.app.dialog.confirm(
			`Do you really want to lock your account so that nobody can change it anymore?`,
			"Lock Account",
			async () => {
				try {
					this.setState({ loading: true });
					await request("/user/lock", { method: "PATCH" });

					this.props.dispatch({ type: "SET_USER", payload: { ...this.props.user, nameLock: true } });
					window.app.notification
						.create({
							title: "Account locked",
							closeOnClick: true,
							closeTimeout: 4000,
						})
						.open();
				} catch (error) {}
				this.setState({ loading: false });
			}
		);
	};

	render = () => {
		const { name, nameLock } = this.props.user;

		return (
			<Popup className="profile" push closeOnEscape closeByBackdropClick swipeToClose>
				<Page loginScreen>
					<Navbar>
						<NavRight>
							<Link popupClose=".profile">Close</Link>
						</NavRight>
					</Navbar>

					<LoginScreenTitle>WhatsTracker</LoginScreenTitle>
					<div className="display-flex justify-content-center" style={{ height: 80 }}>
						<img alt="whatsapp" src="/logo.png" width={80}></img>
					</div>
					<Block className="text-align-center">
						{this.doesFollow
							? "Save your contacts and access them from another device"
							: "If you already have a WhatsTracker Account, login to see your contacts from your other device"}
					</Block>

					<List form>
						<ListInput
							defaultValue={name}
							onChange={this.update}
							label="Username"
							type="text"
							placeholder="Your username"
							clearButton
						/>
					</List>
					<Block className="text-align-center">
						{this.state.loading ? (
							<Preloader></Preloader>
						) : (
							<Button onClick={this.save} large raised fill disabled={nameLock}>
								{nameLock ? "Account locked" : this.doesFollow ? "Save" : "Login"}
							</Button>
						)}
						<br />
						{this.doesFollow && !nameLock && (
							<Button onClick={this.lock}>
								Lock Username <Icon f7>lock</Icon>
							</Button>
						)}

						{this.doesFollow && <Button onClick={this.logout}>Logout</Button>}
					</Block>
				</Page>
			</Popup>
		);
	};
}

export default connect((s) => ({ follower: s.follower, user: s.user }))(Profile);
