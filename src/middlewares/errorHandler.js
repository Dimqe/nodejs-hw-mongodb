

export const errorHandler = (err, req, res, next) => {

  const status = err.status || 500;

  const responseBody = {
    status: status,
    message: err.message || 'Something went wrong',
   
    data: err.data,
  };

  
  if (err.status === 400 && err.details) {
    responseBody.data = err.details;
  }

 
  res.status(status).json(responseBody);
};