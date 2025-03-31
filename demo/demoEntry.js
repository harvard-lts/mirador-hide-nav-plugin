import Mirador from "mirador/dist/es/src/index";
import Plugin from "../src/index";

document.addEventListener("DOMContentLoaded", () => {
  const config = {
    id: "mirador",
    windows: [
      {
        manifestId: "https://nrs.harvard.edu/URN-3:DOAK.RESLIB:40977022:MANIFEST:2"
      },
      {
        manifestId: "https://nrs.harvard.edu/URN-3:DOAK.RESLIB:40977022:MANIFEST:3"
      }
    ]
  };

  const plugins = [...Plugin];

  Mirador.viewer(config, plugins);
});
