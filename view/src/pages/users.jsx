import { List, ListItem, SwipeoutActions, SwipeoutButton, Preloader, Searchbar } from "framework7-react";
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import "../css/users.scss";
import request from "../js/request";

class Users extends Component {
	constructor(props) {
		super(props);
	}

	delete = async (event) => {
		var id = event.path[2].id;
		await request("/follower", { method: "DELETE", body: { id: id } });
		this.props.dispatch({ type: "REMOVE_FOLLOWER", payload: id });
	};

	render() {
		return (
			<Fragment>
				<Searchbar
					backdrop={false}
					searchContainer=".users"
					searchIn=".item-title"
					disableButton={false}
				></Searchbar>
				<List className="searchbar-not-found">
					<ListItem title="Nothing found" />
				</List>
				<List className="users" mediaList>
					{(() => {
						if (this.props.follower === "loading") {
							return (
								<div key="users-loading" className="display-flex justify-content-center">
									<Preloader color="primary"></Preloader>
								</div>
							);
						}

						const rendered = [
							<ListItem
								link={`/comparison`}
								key="comparison"
								id="comparison"
								className="comparison"
								title={"Comparison"}
							></ListItem>,
							...Object.values(this.props.follower).map((follower) => (
								<ListItem
									link={`/users/${follower.id}`}
									key={follower.id}
									id={follower.id}
									className="user"
									title={follower.name}
								>
									<img slot="media" src={follower.avatar} width="60" />
								</ListItem>
							)),
						];

						return rendered;
					})()}
				</List>
			</Fragment>
		);
	}
}

export default connect((s) => ({ follower: s.follower }))(Users);
