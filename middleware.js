// // // middleware.js

const passport = require('./auth');

const middleware = (req, res, next) => {
  // Passport's isAuthenticated checks if the user is logged in
  req.isAuthenticated() ? next() : res.status(401).send("Unauthorized");
};

module.exports = middleware;

// // middleware.js
// const axios = require('axios');

// const middleware = async (req, res, next) => {
//   try {
//     // Check if there is an access token in the request headers
//     const accessToken = req.headers.authorization;

//     if (!accessToken) {
//       return res.status(401).send('Unauthorized');
//     }

//     // Make a request to the userinfo endpoint to get user information
//     const userInfo = await getUserInfo(accessToken);

//     // Attach the user information to the request for later use
//     req.user = userInfo;

//     // Continue to the next middleware or route handler
//     next();
//   } catch (error) {
//     console.error('Error in middleware:', error);
//     res.status(500).send('Internal Server Error');
//   }
// };

// // Function to get user information from the userinfo endpoint
// async function getUserInfo(accessToken) {
//   try {
//     const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });

//     return response.data;
//   } catch (error) {
//     console.error('Error getting user info:', error.response ? error.response.data : error.message);
//     throw error;
//   }
// }

// module.exports = middleware;
