import { config, library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faArrowRightFromBracket,
  faBook,
  faChartLine,
  faCircleNotch,
  faFile,
  faFileArrowDown,
  faFileZipper,
  faGear,
  faHeadset,
  faHome,
  faScrewdriverWrench,
  faServer,
  faTriangleExclamation,
  faTrophy,
} from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

// This is important, we are going to let Nuxt worry about the CSS
config.autoAddCss = false;

// You can add your icons directly in this plugin. See other examples for how you
// can add other styles or just individual icons.
library.add(faGithub);
library.add(faCircleNotch);
library.add(faTriangleExclamation);
library.add(faHome);
library.add(faBook);
library.add(faChartLine);
library.add(faUser);
library.add(faArrowRightFromBracket);
library.add(faHeadset);
library.add(faScrewdriverWrench);
library.add(faServer);
library.add(faTrophy);
library.add(faFileArrowDown);
library.add(faFileZipper);
library.add(faGear);
library.add(faFile);

// noinspection JSUnusedGlobalSymbols
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("font-awesome-icon", FontAwesomeIcon);
});
