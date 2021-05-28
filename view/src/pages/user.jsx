import React, { Component } from "react";
import { Page, Navbar, NavTitle, Link, NavRight, Preloader } from "framework7-react";
import { connect } from "react-redux";
import "../css/user.scss";
import request from "../js/request";
import Graph from "../components/graph";
import sanitize from "../js/sanitize";
import errorLogo from "../assets/error.png";
import Calendar from "../components/calendar";

class User extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			error: "",
			viewList: true,
			editing: false,
			date: Date.now(),
			notificationsSupported: "serviceWorker" in navigator && "PushManager" in window,
		};
		this.nameEdit = React.createRef();
	}

	componentDidMount() {
		this.refresh();
	}

	refresh = async () => {
		this.setState({ loading: true });
		const { id } = this.props;

		try {
			const { presence } = await request(`/presences/${id}`);
			this.props.dispatch({ type: "REFRESH_PRESENCE", payload: { id, presence } });
			this.setState({ loading: false });
		} catch (error) {
			this.setState({ error: error, loading: false });
		}
	};

	delete = async () => {
		const { name, id } = this.props.follower[this.props.id];
		const sanitizedName = sanitize(name);

		this.$f7router.app.dialog.confirm(`Do you really want to delete ${sanitizedName}`, "Delete User", async () => {
			await request("/follower", { method: "DELETE", body: { id } });
			this.props.dispatch({ type: "REMOVE_FOLLOWER", payload: id });
			this.$f7router.navigate("/help");
		});
	};

	enableEdit = async () => {
		this.setState({ editing: true });
		const { nameEdit } = this;
		setTimeout(() => {
			nameEdit.current.focus();
		});
	};

	edit = async () => {
		this.setState({ editing: false });
		const { nameEdit } = this;
		const { value } = nameEdit.current;
		var follower = this.props.follower[this.props.id];

		if (value === follower.name) return;
		var newFollower = { ...follower, name: value };

		await request("/follower", { method: "PATCH", body: newFollower });
		this.props.dispatch({ type: "EDIT_FOLLOWER", payload: newFollower });
	};

	checkEnter = (event) => {
		if (event.keyCode === 13) this.edit();
	};

	notifications = async () => {
		try {
			var follower = this.props.follower[this.props.id];
			follower.notifications = !follower.notifications;
			if (follower.notifications) {
				await this.enableNotifications();
				this.$f7router.app.notification
					.create({
						icon: `<i class="f7-icons">bell_fill</i>`,
						title: "Notifications Enabled",
						closeOnClick: true,
						closeTimeout: 4000,
					})
					.open();
			} else {
				this.$f7router.app.notification
					.create({
						icon: `<i class="f7-icons">bell_slash</i>`,
						title: "Notifications Disabled",
						closeOnClick: true,
						closeTimeout: 4000,
					})
					.open();
			}
		} catch (error) {
			this.$f7router.app.notification
				.create({
					icon: `<img src="${errorLogo}" />`,
					title: "Error",
					subtitle: error.toString(),
					closeOnClick: true,
					closeTimeout: 4000,
				})
				.open();
		}

		await request("/follower", { method: "PATCH", body: follower });
		this.props.dispatch({ type: "EDIT_FOLLOWER", payload: follower });
	};

	disableNotifications = async () => {
		if (!this.state.notificationsSupported) throw "Sorry your browser doesn't support notifications";
		const { registration } = window;

		const pushSubscription = await registration.pushManager.getSubscription();
		if (pushSubscription) {
			await pushSubscription.unsubscribe();
		}
	};

	enableNotifications = async () => {
		if (!this.state.notificationsSupported) throw "Sorry your browser doesn't support notifications";

		const permission = await this.askPermission();
		if (permission !== "granted") throw "Please allow notifications in your browser";
		const { registration } = window;

		const subscribeOptions = {
			userVisibleOnly: true,
			applicationServerKey: urlBase64ToUint8Array(
				"BEFAXN2tHZ6FQuRtMnDbz8pwqQ3NN_r6s2LfjFJGsfn_qRgtUQlIwZBT3n36t62hWYFySVfami1yNt1pyZL5oBw"
			),
		};

		const pushSubscription = await registration.pushManager.subscribe(subscribeOptions);
		const { p256dh, auth } = JSON.parse(JSON.stringify(pushSubscription)).keys;

		const subscriptionObject = {
			type: "browser",
			endpoint: pushSubscription.endpoint,
			p256dh,
			auth,
		};

		await request("/user/notifications", { method: "POST", body: subscriptionObject });
	};

	askPermission() {
		return new Promise(function (resolve, reject) {
			const permissionResult = Notification.requestPermission(function (result) {
				resolve(result);
			});

			if (permissionResult) {
				permissionResult.then(resolve, reject);
			}
		});
	}

	render() {
		if (this.props.follower === "loading" || !this.props.follower[this.props.id]) return <br></br>;
		const { name, id, avatar, notifications } = this.props.follower[this.props.id];

		return (
			<Page name="user" className="user">
				<Navbar className="user-navbar title-left" backLink>
					<NavTitle>
						<img src={avatar}></img>
						{this.state.editing ? (
							<input
								ref={this.nameEdit}
								defaultValue={name}
								onKeyDown={this.checkEnter}
								onBlur={this.edit}
							></input>
						) : (
							<span onClick={this.enableEdit}>{name}</span>
						)}
					</NavTitle>
					<NavRight>
						{this.state.viewList ? (
							<Link onClick={() => this.setState({ viewList: false })} iconIos="f7:layers"></Link>
						) : (
							<Link onClick={() => this.setState({ viewList: true })} iconIos="f7:list_bullet"></Link>
						)}

						{notifications ? (
							<Link
								onClick={this.notifications}
								iconIos="f7:bell_fill"
								iconAurora="f7:bell_fill"
								iconMd="material:notifications"
							></Link>
						) : (
							<Link
								onClick={this.notifications}
								iconIos="f7:bell_slash"
								iconAurora="f7:bell_slash"
								iconMd="material:notifications_off"
							></Link>
						)}

						<Link
							onClick={this.delete}
							iconIos="f7:trash"
							iconAurora="f7:trash"
							iconMd="material:delete"
						></Link>

						{this.state.loading ? (
							<Preloader></Preloader>
						) : (
							<Link
								onClick={this.refresh}
								iconIos="f7:arrow_clockwise"
								iconAurora="f7:arrow_clockwise"
								iconMd="material:refresh"
							></Link>
						)}
					</NavRight>
				</Navbar>
				<Calendar onChange={(date) => this.setState({ date })}></Calendar>
				<Graph
					list={this.state.viewList}
					data={this.props.presences}
					users={this.props.follower}
					single={id}
					date={this.state.date}
				></Graph>
			</Page>
		);
	}
}

export default connect((s) => ({ follower: s.follower, presences: s.presences }))(User);

// https://jsfiddle.net/78gfubzs/

function urlBase64ToUint8Array(base64String) {
	var padding = "=".repeat((4 - (base64String.length % 4)) % 4);
	var base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");

	var rawData = window.atob(base64);
	var outputArray = new Uint8Array(rawData.length);

	for (var i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
}
