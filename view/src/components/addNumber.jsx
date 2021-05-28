import { Button, Link, List, ListInput, Navbar, NavRight, Page, Popup, Preloader } from "framework7-react";
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import request from "../js/request";
import Users from "../pages/users";
import vCard from "vcard-parser";

class AddNumber extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: "",
			phone: "",
			errorForm: "",
			errorPhone: "",
			errorName: "",
			adding: false,
		};
		this.country = "";

		fetch("https://ipapi.co/country_calling_code/")
			.then((res) => res.text())
			.then((country) => {
				this.country = country;
			});
	}

	get contactApiSupport() {
		return "contacts" in window.navigator && "ContactsManager" in window;
	}

	importPhone = async () => {
		try {
			const props = ["name", "tel"];
			const opts = { multiple: true };
			var contacts = await navigator.contacts.select(props, opts);
			if (!contacts.length) return;

			for (var contact of contacts) {
				if (!contact.name || !contact.name.length || !contact.tel || !contact.tel.length) continue;
				var name = contact.name[0];
				contact.tel = contact.tel.map((x) => x.replace(/\D/g, ""));
				contact.tel = contact.tel.filter((x, i) => contact.tel.indexOf(x) === i);

				for (var phone of contact.tel) {
					await this.addFollower({ name: name, phone }).catch(() => {});
				}
			}

			window.app.toast
				.create({
					text: "Import finished",
					closeButton: true,
				})
				.open();
		} catch (error) {
			console.error(error);
			window.app.toast
				.create({
					text: "Couldn't access contacts.\nReason: Permissions Denied",
					closeButton: true,
				})
				.open();
		}
	};

	importFile = async (event) => {
		var files = event.target.files;
		var output = [];
		for (var file of files) {
			if (!file.name.match(".*.vcf")) {
				continue;
			}

			var text = await new Promise((res) => {
				var reader = new FileReader();

				reader.onload = function (e) {
					res(e.target.result);
				};

				reader.readAsText(file);
			});
			output.push(text);
		}
		output = output.join("\n");
		var cards = output.split("END:VCARD").map((x) => x + "END:VCARD");

		for (var card of cards) {
			try {
				card = vCard.parse(card);
				var name = card.fn[0].value;

				for (var phone of card.tel) {
					phone = phone.value;
					await this.addFollower({ name: name, phone }).catch((e) => {});
				}
			} catch (error) {}
		}

		window.app.toast
			.create({
				text: "Import finished",
				closeButton: true,
			})
			.open();
	};

	onNameChange = (event) => {
		var { value } = event.currentTarget;
		this.setState({ name: value });
	};

	onPhoneChange = (event) => {
		var { value } = event.currentTarget;
		this.setState({ phone: value });
		setTimeout(() => {
			if (document.querySelector('[type="tel"]:-webkit-autofill')) this.fillCountryCode(value);
		}, 0);
	};

	async addFollower({ name, phone }) {
		var follower = await request("/follower", {
			method: "POST",
			body: JSON.stringify({
				name,
				phone,
			}),
		});
		this.props.dispatch({ type: "ADD_FOLLOWER", payload: follower });
		return follower;
	}

	submit = async (event) => {
		event.preventDefault();

		this.setState({ adding: true });

		try {
			var { avatar, name } = await this.addFollower(this.state);

			window.app.notification
				.create({
					icon: avatar && `<img src="${avatar}" style="border-radius: 50%" />`,
					title: "Contact Added",
					subtitle: name,
					closeOnClick: true,
					closeTimeout: 4000,
				})
				.open();

			this.setState({
				adding: false,
				name: "",
				phone: "",
				errorForm: "",
				errorName: "",
				errorPhone: "",
			});
		} catch (error) {
			this.setState({ adding: false, errorForm: error ? error.error : error });
		}
	};

	fillCountryCode = (phone) => {
		if (!phone.startsWith(this.country)) this.setState({ phone: this.country + " " + this.state.phone });
	};

	render() {
		return (
			<Popup
				onPopupClosed={this.props.onClose}
				className="add-number-popup"
				closeByBackdropClick
				closeOnEscape
				swipeToClose
				opened={this.props.open}
			>
				<Page>
					<Navbar title="Add Number">
						<NavRight>
							<Link popupClose>Close</Link>
						</NavRight>
					</Navbar>

					{this.contactApiSupport && (
						<Button
							style={{ margin: "1rem", marginBottom: "0" }}
							fill
							round
							large
							onClick={this.importPhone}
						>
							Import Contacts from Phone
						</Button>
					)}

					<input
						multiple
						onChange={this.importFile}
						style={{ width: "0.1px", height: "0.1px", opacity: 0 }}
						id="file"
						type="file"
						accept=".vcf"
					></input>
					<label
						style={{ margin: "1rem" }}
						htmlFor="file"
						className="button button-round button-fill button-large"
					>
						Import Contacts from Files
					</label>

					<List onSubmit={this.submit} form inset inlineLabels noHairlinesMd>
						<ListInput
							required
							autocomplete="name"
							label="Name"
							type="text"
							placeholder="Name of the person"
							errorMessage={this.state.errorName}
							errorMessageForce={!!this.state.errorName}
							value={this.state.name}
							onChange={this.onNameChange}
						></ListInput>
						<ListInput
							required
							label="Phone number"
							autocomplete="tel"
							type="tel"
							placeholder="Phone number of the person"
							errorMessage={this.state.errorPhone}
							errorMessageForce={!!this.state.errorPhone}
							value={this.state.phone}
							onChange={this.onPhoneChange}
						></ListInput>
						<div className="text-color-red text-align-center">
							<br></br>
							{this.state.errorForm}
						</div>
						<br></br>
						<Button
							className="display-flex"
							type="submit"
							large
							fill
							round
							color="primary"
							style={{ width: "auto", margin: "auto" }}
						>
							{this.state.adding ? (
								<Preloader color="white"></Preloader>
							) : (
								<Fragment>
									<i className="icon f7-icons">plus</i>
									Add
								</Fragment>
							)}
						</Button>
					</List>
					<Users></Users>
				</Page>
			</Popup>
		);
	}
}

export default connect((s) => ({ follower: s.follower }))(AddNumber);
