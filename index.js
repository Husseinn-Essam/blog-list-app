const app = require("./app");
const config = require("./utils/config");
const { info, error } = require("./utils/logger");
const port = 3003;
app.listen(port, () => {
  info(`Server running on port ${port}`);
});
