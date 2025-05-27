exports.success = (res, data, message = "Data fetched successfully.") => {
  return res.status(200).json({
    status: "Success",
    message,
    data,
  });
};

exports.created = (res, data, message = "Resource created successfully.") => {
  return res.status(201).json({
    status: "Success",
    message,
    data,
  });
};

exports.error = (res, error, statusCode = 500, message = "An error occurred.") => {
  console.error(error);
  return res.status(statusCode).json({
    status: "Error",
    message: error.message || error || message,
    data: null,
  });
};
