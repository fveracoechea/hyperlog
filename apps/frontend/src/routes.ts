import { index, layout, prefix, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  layout("./routes/Layout.tsx", { id: "layout" }, [
    index("./routes/Home.tsx"),
    route("links", "./routes/Links.tsx"),
    route("links/:linkId", "./routes/LinkDetails.tsx"),
    route("links/:linkId/edit", "./routes/LinkEdit.tsx"),
    route("collections", "./routes/Collections.tsx"),
    route("collections/:collectionId", "./routes/CollectionPage.tsx"),
    route("collections/:collectionId/edit", "./routes/CollectionEdit.tsx"),
    route("tags", "./routes/Tags.tsx"),
    route("tags/:tagId", "./routes/TagPage.tsx"),
    route("tags/:tagId/edit", "./routes/TagEdit.tsx"),
  ]),

  ...prefix("resources", [
    route("signout", "./routes/resources/signout.tsx"),
    route("import-bookmarks", "./routes/resources/importBookmarks.tsx"),
  ]),

  ...prefix("settings", [
    layout("./routes/SettingsLayout.tsx", { id: "settings" }, [
      route("account", "./routes/AccountPage.tsx"),
    ]),
  ]),

  layout("./routes/PlublicLayout.tsx", [
    route("login", "./routes/Login.tsx"),
    route("sign-up", "./routes/SignUp.tsx"),
  ]),
] satisfies RouteConfig;
