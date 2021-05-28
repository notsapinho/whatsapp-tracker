importScripts("https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js");

if (workbox) {
	console.log(`Yay! Workbox is loaded 🎉`, workbox);
	workbox.routing.registerRoute(({ url }) => {
		return url.pathname.startsWith("/static/");
	}, new workbox.strategies.CacheFirst());

	workbox.routing.registerRoute(({ url }) => {
		return !url.pathname.startsWith("/api/") && !url.pathname.startsWith("/static/");
	}, new workbox.strategies.StaleWhileRevalidate());
} else {
	console.log(`Boo! Workbox didn't load 😬`);
}

self.addEventListener("push", function (event) {
	if (!(self.Notification && self.Notification.permission === "granted")) return;
	if (!event.data) return;
	const { name, id, status, type } = event.data.json();
	if (type !== "presence") return;
	if (status === "offline") return; // dont send offline notifications

	const body = `${name} just went ${status}`;
	const title = "WhatsApp";
	const options = {
		body,
		tag: Date.now(),
		icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/1200px-WhatsApp.svg.png",
		data: { id },
	};

	try {
		new self.Notification(title, options);
	} catch (error) {
		self.registration.showNotification(title, options);
	}

	console.log("Notification", body);
});

self.addEventListener("notificationclick", function (event) {
	console.log(event);
});
