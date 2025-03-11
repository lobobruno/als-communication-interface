import type { MetadataRoute } from "next";

const allowedPaths = ["/img", "/world-index"];

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: "*",
				disallow: "/",
			},
			/*{
				userAgent: "facebookexternalhit",
				allow: allowedPaths,
			},
			{
				userAgent: "Twitterbot",
				allow: allowedPaths,
			},*/
		],
	};
}
