import { library, dom } from '@fortawesome/fontawesome-svg-core';
import { 
  faBars,
  faDatabase,
  faCode,
  faLaptopCode,
  faTerminal,
  faCodeBranch,
  faPhone,
  faMapMarkerAlt,
  faEnvelope
} from '@fortawesome/free-solid-svg-icons';

import { 
  faLinkedin,
  faGithub,
  faJava,
  faNodeJs,
  faDocker,
  faJs
} from '@fortawesome/free-brands-svg-icons';

library.add(
  faBars,
  faDatabase,
  faCode,
  faLaptopCode,
  faTerminal,
  faCodeBranch,
  faPhone,
  faMapMarkerAlt,
  faEnvelope,
  faLinkedin,
  faGithub,
  faJava,
  faNodeJs,
  faDocker,
  faJs
);

dom.watch();

document.addEventListener('DOMContentLoaded', () => {
  dom.i2svg(); // Convert all i tags to SVG
});