const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const bodyParser = require("body-parser");
const svgr = require("@svgr/core");
const port = 3000;
require("@svgr/plugin-svgo");
require("@svgr/plugin-prettier");
require("@svgr/plugin-jsx");

const app = express();
app.use(helmet());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/", (req, res) => {
  const {
    name,
    svg,
    native,
    ext = "js",
    icon,
    expandProps = "end",
    typescript,
  } = req.body;
  try {
    console.log(native, svg);
    const data = svgr.default.sync(
      svg,
      {
        native,
        ext,
        icon,
        expandProps,
        typescript,
        plugins: [
          "@svgr/plugin-svgo",
          "@svgr/plugin-jsx",
          "@svgr/plugin-prettier",
        ],
      },
      { componentName: name || "Icon" }
    );
    console.log("data", data);
    res.send({
      data,
    });
  } catch (e) {
    console.log("error", e);
    res.status(500).send({
      error: "Couldn't parse SVG",
    });
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
