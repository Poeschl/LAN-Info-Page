import { config, library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faArrowRightFromBracket,
  faBan,
  faChess,
  faChevronRight,
  faCircleNotch,
  faCircleXmark,
  faCloudDownloadAlt,
  faDownload,
  faFile,
  faFileCircleCheck,
  faFileCircleXmark,
  faFolderOpen,
  faGear,
  faHome,
  faLock,
  faRotate,
  faTrash,
  faTriangleExclamation,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import {
  faCircleCheck,
  faCopy,
  faHardDrive,
  faSquareCheck,
  faUser,
  faWindowMaximize,
} from "@fortawesome/free-regular-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

// This is important, we are going to let Nuxt worry about the CSS
config.autoAddCss = false;

// You can add your icons directly in this plugin. See other examples for how you
// can add other styles or just individual icons.
library.add(faWindowMaximize);
library.add(faGear);
library.add(faGithub);
library.add(faUpload);
library.add(faDownload);
library.add(faCircleXmark);
library.add(faCircleCheck);
library.add(faCircleNotch);
library.add(faTriangleExclamation);
library.add(faHome);
library.add(faCloudDownloadAlt);
library.add(faRotate);
library.add(faChess);
library.add(faHardDrive);
library.add(faFileCircleCheck);
library.add(faFileCircleXmark);
library.add(faChevronRight);
library.add(faFile);
library.add(faFolderOpen);
library.add(faBan);
library.add(faSquareCheck);
library.add(faTrash);
library.add(faUser);
library.add(faArrowRightFromBracket);
library.add(faLock);
library.add(faCopy);

// noinspection JSUnusedGlobalSymbols
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("font-awesome-icon", FontAwesomeIcon);
});
