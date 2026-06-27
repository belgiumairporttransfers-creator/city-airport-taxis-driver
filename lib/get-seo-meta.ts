import type { Metadata } from "next";

export const DRIVER_PORTAL_SITE_NAME = "City Airport Taxis Driver Portal";

export const DRIVER_PORTAL_DEFAULT_DESCRIPTION =
  "Secure driver portal for City Airport Taxis. Sign in to manage your profile, trips, earnings, and application status.";

const getSiteUrl = () =>
  process.env.NEXT_PUBLIC_SITE_URL || "https://driver.city-airport-taxis.be";

type TGetSeoMetaProps = Partial<Metadata> | void;

export const getSeoMeta = (props: TGetSeoMetaProps = {}): Metadata => {
  const {
    title,
    description = DRIVER_PORTAL_DEFAULT_DESCRIPTION,
    applicationName = DRIVER_PORTAL_SITE_NAME,
    keywords = [
      "City Airport Taxis",
      "driver portal",
      "driver dashboard",
      "taxi driver",
      "airport transfers",
      "Belgium taxi",
    ],
    icons = {
      icon: "/assets/fav-icon/favicon-32x32.png",
      apple: "/assets/fav-icon/apple-touch-icon.png",
    },
    robots = {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    },
    openGraph,
    twitter,
    ...restProps
  } = props ?? {};

  const finalTitle = title
    ? `${title} | ${DRIVER_PORTAL_SITE_NAME}`
    : DRIVER_PORTAL_SITE_NAME;

  const metaDescription = description ?? undefined;

  return {
    metadataBase: new URL(getSiteUrl()),
    title: finalTitle,
    applicationName,
    description: metaDescription,
    keywords,
    icons,
    robots,
    openGraph: {
      ...openGraph,
      title: finalTitle,
      description: metaDescription,
      siteName: "City Airport Taxis",
      type: "website",
      locale: "en_BE",
    },
    twitter: {
      ...twitter,
      card: "summary",
      title: finalTitle,
      description: metaDescription,
    },
    ...restProps,
  };
};
