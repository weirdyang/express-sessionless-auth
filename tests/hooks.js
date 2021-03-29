const Journal = require('../models/journal');
const User = require('../models/user');

exports.mochaHooks = {
  afterAll: async () => {
    // one-time final cleanup
    await User.remove().exec();
    await Journal.remove().exec();
  },
};
