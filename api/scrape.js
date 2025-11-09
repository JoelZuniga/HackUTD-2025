const DownDetector = require("../downdetector");

module.exports = async (req, res) => {
  const site = "t-mobile";
  const detector = new DownDetector();

  detector.detect(site);

  detector.once("response", ([code, message]) => {
    if (code !== 200 || !message) {
      console.error("Error fetching T-Mobile, code:", code);
      return res
        .status(500)
        .json({ error: "Error fetching T-Mobile from DownDetector" });
    }

    // At this point it's already inserted into Mongo in downdetector.js
    return res.status(200).json({ ok: true });
  });
};
