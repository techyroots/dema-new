module.exports = {
    createResponse: (success, message, data, error) => {
      return {
        success,
        message,
        data,
        error,
      };
    },
  };