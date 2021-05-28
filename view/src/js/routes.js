import HomePage from "../pages/home.jsx";
import UserPage from "../pages/user.jsx";
import HelpPage from "../pages/help.jsx";
import ComparisonPage from "../pages/comparison.jsx";

var routes = [
	{
		path: "/",
		master: true,
		detailRoutes: [
			{
				path: "/users/:id",
				component: UserPage,
			},
			{
				path: "/help",
				component: HelpPage,
			},
			{
				path: "/comparison",
				component: ComparisonPage,
			},
		],
		component: HomePage,
	},
];

export default routes;
