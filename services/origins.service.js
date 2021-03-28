const Origin = require('../models/origins');

function originService() {
  const fetchOrigins = async () => {
    let origins;
    try {
      origins = await Origin.find({}, 'address');
      return (null, origins);
    } catch (error) {
      return (error, origins);
    }
  };

  const insertOrigin = async (name, address) => {
    const origin = new Origin({
      name,
      address,
    });
    await origin.save();
    return origin;
  };
  return {
    fetchOrigins,
    insertOrigin,
  };
}

module.exports = originService();
