/**
 * Store listings for the Caesura mobile app. Powers /download.
 *
 * Leave a URL empty until that store listing is live: its badge then shows "Coming soon"
 * instead of a dead link. Example values:
 *   ios:     "https://apps.apple.com/app/caesura/id1234567890"
 *   android: "https://play.google.com/store/apps/details?id=app.caesura"
 */
export const appLinks = {
  ios: "",
  android: "",
};

export const appIsLive = Boolean(appLinks.ios || appLinks.android);
