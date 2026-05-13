import Mirador from "mirador";
import Plugin from "../src/index";

document.addEventListener("DOMContentLoaded", () => {
  const config = {
    id: "mirador",
    windows: [
      {
        manifestId: "https://nrs.lib.harvard.edu/URN-3:DOAK.RESLIB:102561403:MANIFEST:2"
      },
      {
        manifestId: "https://nrs.lib.harvard.edu/URN-3:DOAK.RESLIB:102561403:MANIFEST:3"
      }
    ]
  };

  const plugins = [...Plugin];

  Mirador.viewer(config, plugins);
});
