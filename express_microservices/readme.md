## Fixing the certificates issue.
Unfortunately we cannot upload our TLS certificates to github due to security issue. Ideally you would generate them on your own in a dev environement. But lets not do that and just follow steps below.
1. Therefore please download them from our google drive link.
- It should have three files inside called ``` certificate.pem, certrequest.csr , privatekey.pem```
2. Paste this folder inside your ```verify_login``` microservice . As ```verify_login/certificates``` .
3. Delete all your docker images , then your docker containors.
4. In your ```capstone_project``` repo , run ``` docker compose up ```.
5. Should be fixed.




## Nginx Error
1. ``` 502 Bad Gateway ``` - This is because the backend service crashed , re run it from docker.
2. ``` 404 Cannot POST /controllername``` - This is because it is not recognizing the route , make sure the route matches the controller name.
   1. Check if you are sending the right request ``` GET , POST```.
3. 





## Solving the CORS error:

Add the following code to your express JS file :

```javascript
const corsOptions = {
    origin: '*', // Set the allowed origin(s) here, e.g., 'http://localhost:3000/'
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
};
app.use(cors(corsOptions));


```

