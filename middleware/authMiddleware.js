const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const client = jwksClient({
  jwksUri: `${process.env.KEYCLOAK_URL}/realms/${process.env.REALM}/protocol/openid-connect/certs`
});

function getKey(header, callback){
  client.getSigningKey(header.kid, function(error, key) {
    if (error) {
      console.error(error)
    } else {
      const signingKey = key.publicKey || key.rsaPublicKey;
      callback(null, signingKey);
    }
  });
}

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization.substr('Bearer '.length);

  if (!token) {
    return res.status(401).json({ message: 'No token provided.' });
  }

  jwt.verify(token, getKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Failed to authenticate token.' });
    }

    req.user = decoded;
    next();
  });
};

module.exports = verifyToken;