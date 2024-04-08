FROM mysql:8.0.33

# Set the root password (change 'password' to your desired password)
ENV MYSQL_ROOT_PASSWORD=password

EXPOSE 3306

# Copy the SQL script to the container
# Make sure that the init.sql file is in the same directory as the Dockerfile
COPY init.sql /docker-entrypoint-initdb.d/