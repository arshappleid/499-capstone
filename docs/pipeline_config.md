## Configuring CICD Pipeline

### How the current CD pipeline is configured.

- The current cd pipeline relies on a github selfhosted learner (running as a service on the server). This services listens for HTTP requests that are sent by Github . This then triggers the pipeline that is configured in ```.github/workflows/deployment.yml ``` . Which takes down all the current docker containers , then deletes the images . Later builds the new images , using the new code and deply the containors. The steps are also elaborated below :
  1. Pull All the latest code . Currently done using ``` actions/checkout@v3```
  2. Take down all the services containors using ``` docker-compose -f docker-compose.prod.yaml down --rmi all ``` .
  3. Rebuild all the containors using ```docker-compose -f docker-compose.prod.yaml up -d```



