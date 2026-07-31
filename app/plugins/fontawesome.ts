import { config, library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";

// This is important, we are going to let Nuxt worry about the CSS
config.autoAddCss = false;

// Add all icons, since the user has the options select a icon for the links at runtime.
library.add(fas);
library.add(far);
library.add(fab);

// noinspection JSUnusedGlobalSymbols
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("font-awesome-icon", FontAwesomeIcon);
});
