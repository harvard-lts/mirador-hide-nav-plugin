import Mirador from "mirador/dist/es/src/index";
import Plugin from "../src/index";

document.addEventListener("DOMContentLoaded", () => {
  const config = {
    id: "mirador",
    windows: [
      {
        manifestId: "https://iiif.lib.harvard.edu/manifests/ids:10274486",
      },
    ]
  };

  const plugins = [...Plugin];

  Mirador.viewer(config, plugins);
});
