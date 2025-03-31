import Mirador from "mirador/dist/es/src/index";
import Plugin from "../src/index";

document.addEventListener("DOMContentLoaded", () => {
  const config = {
    id: "mirador",
    windows: [
      {
        manifestId: ""
      }
    ]
  };

  const plugins = [...Plugin];

  Mirador.viewer(config, plugins);
});
