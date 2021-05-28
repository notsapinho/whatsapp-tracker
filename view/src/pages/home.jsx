import React, { Component } from "react";
import {
	Page,
	Navbar,
	NavTitle,
	Icon,
	Link,
	Toolbar,
	Block,
	Fab,
	FabButtons,
	FabButton,
	Tab,
	Tabs,
	NavLeft,
	NavRight,
	Button,
} from "framework7-react";
import AddNumber from "../components/addNumber";
import Users from "./users";
import { connect } from "react-redux";

class HomePage extends Component {
	constructor(props) {
		super(props);

		this.state = { addNumber: false };
	}

	componentDidMount() {}

	render = () => {
		const doesFollow = Object.keys(this.props.follower).length;

		return (
			<Page name="home">
				<Navbar>
					<NavLeft>
						<Link
							popupOpen=".introduction"
							href="#info"
							iconIos="f7:info_circle"
							iconAurora="f7:info_circle"
							iconMd="material:info"
						></Link>
					</NavLeft>
					<NavTitle>WhatsTracker</NavTitle>
					<NavRight>
						{this.props.user?.name ? (
							<Link iconF7="person" popupOpen={".profile"}></Link>
						) : (
							<Button fill round popupOpen={".profile"}>
								{doesFollow ? "Save" : "Login"}
							</Button>
						)}
					</NavRight>
				</Navbar>

				<Users></Users>

				<AddNumber onClose={() => this.setState({ addNumber: false })} open={this.state.addNumber}></AddNumber>
				<Fab
					onClick={() => this.setState({ addNumber: true })}
					position="left-bottom"
					slot="fixed"
					color="primary"
				>
					<Icon ios="f7:plus" aurora="f7:plus" md="material:add"></Icon>
				</Fab>
			</Page>
		);
	};
}

export default connect((s) => ({ follower: s.follower, user: s.user }))(HomePage);
