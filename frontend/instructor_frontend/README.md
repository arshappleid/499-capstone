# Running, Building and Deploying the application.

## How to build the app during development
1. Make sure you have node version 18 installed.
2. Navigate into the project directory , and Install dependencies using ``` npm install ```
3. Come to the main directory , simply run ``` npm run dev ```

## How to build the application, to see if it would build in production environment.
Ideally after having worked on your project at the end , we would do this to see if our source code compiles nicely in production environment.

Eventually when we have the CI/CD pipeline this will not be required.

1. Make sure everything is saved
2. Simply run ``` docker compose up -d```  , and visit ```http://localhost```



## Running tests :
- In main repository run the following command ``` npm run tests ```;
