To implement the JWT authentication in any of the microservices 

1. Add this file as jwt_auth.js . Also update the Verify User code , 
```js
const jsonwebtoken = require('jsonwebtoken');
const jwt_decode = require('jwt-decode');
const {Instructor} = require("./database/index");


// JWT Middleware
async function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401).send({message:'Could not read token , check format.'});

    jsonwebtoken.verify(token, process.env.jwt_secret, {algorithms: ['HS256']}, async (err, user) => {
        if (err) {
            if (err.name === 'UnauthorizedError') {
                res.status(401).send({message: 'Invalid token'});
            } else if (err.name === 'TokenExpiredError') {
                res.status(401).send({message: 'Expired Token'});
            } else {
                res.sendStatus(403).send({message:err});
            }
        } else {
            // Verified token
            const instructor_id = await jwt_decode(token).instructor_id;
            console.log("Instructor id from the token : "+instructor_id);
            const resp = await verifyUser(instructor_id);
            if(resp === false){
                res.status(401).send({message:'Instructor id could not be verified.'});
                return;
            }
            req.user = instructor_id;
            next();
        }
    });
}

async function verifyUser(instructor_id){
    try{
        const resp = await Instructor.findOne({where :{INSTRUCTOR_ID : instructor_id}});
        if(resp == null) return false;

        return true;
    }catch (e){
        console.log('Error occured while verifying instructor , at jwt_auth/verifyUser : '+e);
        return false;
    }
}

module.exports = authenticateToken;

```
2. Then in app.js add this code 
```js
const authenticateToken = require('./jwt_auth');   // make sure the route is correct
app.use(authenticateToken); // Apply authentication to all routes.
```
3. Make sure the following Environment variables are being passed from the docker compose file 
```
 tokenExpirtationTime: '1h' ## 1 hour
 jwt_secret: 'this-is-the-secret-string-generated-by-authentication-server-generate-new-secret'
```
4. Now all the routes should be secured using JWT token , and expect the token in the header as 
```json
{
      authorization: "Bearer this-is-the-token"
}

```
It will return following messages :
1. If Invalid Token ```{message : "Invalid Token"}```
2. If Expired Token ```{message: "Expired Token"}```
3. If a Valid Token , sends a Non-Valid UserId ```{message: "Instructor id could not be verified."}```