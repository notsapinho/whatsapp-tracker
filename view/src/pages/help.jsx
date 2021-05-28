import React, { Component } from "react";
import { Page, Navbar } from "framework7-react";
import { connect } from "react-redux";
import Help from "../components/help";

class User extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return <Help startPage></Help>;
	}
}

export default connect((s) => ({}))(User);
