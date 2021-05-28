import React, { Component } from "react";
import { Page, Navbar, NavTitle, Link, NavRight, Preloader, BlockFooter, Icon } from "framework7-react";
import { connect } from "react-redux";
import "../css/user.scss";
import request from "../js/request";
import Graph from "../components/graph";
import Calendar from "../components/calendar";

class Comparison extends Component {
	constructor(props) {
		super(props);
		this.state = { loading: false, error: "", viewList: false, date: Date.now() };
	}

	componentDidMount() {
		this.refresh();
	}

	refresh = async () => {
		this.setState({ loading: true });

		try {
			const { presences } = await request(`/presences`);
			this.props.dispatch({ type: "SET_PRESENCES", payload: presences });
			this.setState({ loading: false });
		} catch (error) {
			this.setState({ error: error, loading: false });
		}
	};

	get users() {
		const exampleFollower = {
			0: {
				id: 0,
				name: "John Doe",
			},
			1: {
				id: 1,
				name: "Jane Doe",
			},
		};

		return Object.keys(this.props.follower).length ? this.props.follower : exampleFollower;
	}

	get presences() {
		const examplePresences = {
			0: [
				{
					from: new Date().setHours(8, 12, 10),
					to: new Date().setHours(8, 28, 10),
				},
				{
					from: new Date().setHours(14, 39, 10),
					to: new Date().setHours(15, 3, 10),
				},
				{
					from: new Date().setHours(18, 43, 10),
					to: new Date().setHours(18, 44, 10),
				},
			],
			1: [
				{
					from: new Date().setHours(8, 8, 10),
					to: new Date().setHours(8, 34, 10),
				},
				{
					from: new Date().setHours(16, 23, 10),
					to: new Date().setHours(16, 37, 10),
				},
				{
					from: new Date().setHours(18, 42, 10),
					to: new Date().setHours(18, 44, 10),
				},
			],
		};

		return Object.keys(this.props.presences).length ? this.props.presences : examplePresences;
	}

	render() {
		if (this.props.follower === "loading") return <br></br>;

		return (
			<Page name="comparison" className="comparison">
				<Navbar className="comparison-navbar title-left" backLink>
					<NavTitle>Comparison</NavTitle>
					<NavRight>
						{this.state.viewList ? (
							<Link onClick={() => this.setState({ viewList: false })} iconIos="f7:layers"></Link>
						) : (
							<Link onClick={() => this.setState({ viewList: true })} iconIos="f7:list_bullet"></Link>
						)}
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
					data={this.presences}
					users={this.users}
					date={this.state.date}
				></Graph>
			</Page>
		);
	}
}

export default connect((s) => ({ follower: s.follower, presences: s.presences }))(Comparison);

// https://jsfiddle.net/78gfubzs/
