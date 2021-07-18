import { assetURL } from "onefx/lib/asset-url";
import { t } from "onefx/lib/iso-i18n";
import { mobileViewPortContent } from "onefx/lib/iso-react-render/root/mobile-view-port-content";

import { Helmet } from "onefx/lib/react-helmet";
import { noFlashColorMode } from "onefx/lib/styletron-react";
import React from "react";
import { connect } from "react-redux";
import { colors } from "./styles/style-color";

function HeadInner({
  locale,
  nonce,
}: {
  locale: string;
  nonce: string;
}): JSX.Element {
  return (
    <Helmet
      link={[
        // PWA & mobile
        { rel: "manifest", href: assetURL("manifest.json") },
        { rel: "apple-touch-icon", href: "/favicon.svg" },

        {
          rel: "icon",
          type: "image/png",
          sizes: "any",
          href: assetURL("favicon.png"),
        },

        // styles
        {
          rel: "stylesheet",
          type: "text/css",
          href: assetURL("stylesheets/antd.css"),
        },
        {
          rel: "stylesheet",
          type: "text/css",
          href: assetURL("stylesheets/antd-dark.css"),
        },
        {
          href: "https://fonts.googleapis.com/css?family=Noto+Sans:400,700,400italic,700italic",
          rel: "stylesheet",
          type: "text/css",
        },
      ]}
      meta={[
        { name: "viewport", content: mobileViewPortContent },
        { name: "description", content: t("meta.description") },
        { name: "theme-color", content: colors.primary },

        // social
        { property: "og:title", content: `${t("meta.title")}` },
        { property: "og:description", content: t("meta.description") },
        { property: "og:image", content: assetURL("favicon.png") },
        { property: "twitter:card", content: "summary_large_image" },
      ]}
      title={`${t("meta.title")} - ${t("meta.description")}`}
    >
      <html lang={locale} />
      <script type="text/javascript" nonce={nonce}>
        {noFlashColorMode({ defaultMode: "light" })}
      </script>
    </Helmet>
  );
}

export const Head = connect(
  (state: { base: { locale: string; nonce: string } }) => ({
    locale: state.base.locale,
    nonce: state.base.nonce,
  })
)(HeadInner);
