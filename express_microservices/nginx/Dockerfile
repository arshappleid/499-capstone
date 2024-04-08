# Use an official Nginx image
FROM nginx:1.25.1


# Remove the default Nginx configuration file
RUN rm /etc/nginx/conf.d/default.conf

# Replace with our own configuration file
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
