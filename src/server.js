const app = require('./index');
const { SERVER_CONFIG } = require('./config/constants');

const PORT = process.env.PORT || SERVER_CONFIG.DEFAULT_PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
