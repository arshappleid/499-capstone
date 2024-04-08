#!/bin/bash

# Define the list of subdirectories where npm install should be run
subdirectories=("frontend/instructor_frontend" "frontend/student_frontend" "frontend/super_admin_frontend" "express_microservices/admin" "express_microservices/instructor" "express_microservices/student" "express_microservices/authentication")

# Loop through each subdirectory and run npm install
for dir in "${subdirectories[@]}"; do
  if [ -d "$dir" ]; then
    echo "Running 'npm install' in $dir..."
    cd "$dir"
    npm install
    if [ "$1" = "dev" ]; then
	    npm install --save-dev
    fi
    cd ../..
    echo "Finished 'npm install' in $dir"
  else
    echo "Error: Directory $dir not found."
  fi
done
