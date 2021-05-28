import React from "react";
import {
	Page,
	LoginScreenTitle,
	Button,
	List,
	ListItem,
	Block,
	Row,
	Col,
	Icon,
	BlockFooter,
	Navbar,
} from "framework7-react";
import "../css/introduction.scss";

export default function ({ startPage }) {
	return (
		<Page loginScreen>
			<Navbar className="d-none"></Navbar>
			<header>
				<LoginScreenTitle>
					<h1 style={{ fontSize: "var(--f7-login-screen-title-font-size)", fontWeight: 500 }}>
						WhatsTracker
					</h1>
				</LoginScreenTitle>

				<div className="display-flex justify-content-center" style={{ height: 80 }}>
					<img alt="whatsapp" src="/logo.png" width={80}></img>
				</div>
			</header>
			<div>
				<List mediaList className="">
					<ListItem title="Online Time" text="Track when a user comes online/goes offline.">
						<Icon
							slot="media"
							color="primary"
							size={40}
							ios="f7:clock"
							aurora="f7:clock"
							md="material:timer"
						></Icon>
					</ListItem>
					<ListItem title="Notifications" text="Get notified if a user comes online.">
						<Icon
							slot="media"
							color="primary"
							size={40}
							ios="f7:bell"
							aurora="f7:bell"
							md="material:notifications"
						></Icon>
					</ListItem>
					<ListItem
						title="Connections"
						text="Shows connection between users, and when they are online together."
					>
						<Icon
							slot="media"
							color="primary"
							size={40}
							ios="f7:person_2"
							aurora="f7:person_2"
							md="material:people"
						></Icon>
					</ListItem>
				</List>
			</div>
			<footer>
				<Block>
					<Row>
						<Col>
							{startPage ? null : (
								<Button large fill popupClose>
									Continue
								</Button>
							)}
						</Col>
					</Row>
				</Block>
				<span></span>
				<BlockFooter>
					This Website is in no way affiliated with, authorized, maintained, sponsored or endorsed by WhatsApp
					or any of its affiliates or subsidiaries. This is an independent and unofficial software. Use at
					your own risk.
				</BlockFooter>
			</footer>
		</Page>
	);
}
