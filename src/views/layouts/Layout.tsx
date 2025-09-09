import type { FC } from "hono/jsx";

export const Layout: FC = ({ children }) => (
	<html lang="en">
		<body>{children}</body>
	</html>
);
