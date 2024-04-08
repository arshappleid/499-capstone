### Steps to Have the Containors up and running.

1. Have the repository pulled from GitHub.
2. Navigate into the project repositry. ``` cd capstone_project```
3. Run the docker compose file using ```docker-compose -f docker-compose.prod.yaml up -d```





## Shutting down the containors 

Run the following script to take down the containors ```docker-compose -f docker-compose.prod.yaml down -d```





## Fixing Pool overlap issue

1. Get the network id using ```docker network ls```

2. Stop the network using ``` docker network rm NETWORK_NAME_OR_ID```

   