# Use the official Ubuntu base image
FROM ubuntu:latest

# Define the username as a global constant
ENV USERNAME=csw

# Install necessary dependencies
RUN apt-get update && apt-get install -y \
    wget \
    curl \
    git \
    vim \
    net-tools \
    npm \
    && rm -rf /var/lib/apt/lists/*

 
# Create app directory
WORKDIR /usr/src/app
 
COPY cloudsweeper-ui/package.json ./package.json
COPY cloudsweeper-ui/package-lock.json ./package-lock.json
RUN npm ci
 
COPY cloudsweeper-ui/ .
 
EXPOSE 3000
 
#RUN <<EOF
#apt-get update
#apt-get install -y --no-install-recommends git
#EOF
 
RUN useradd -s /bin/bash -m csw && usermod -aG csw csw 
 
HEALTHCHECK CMD curl --fail http://localhost:3000 || exit 1  
 
# install Docker tools (cli, buildx, compose)
COPY --from=gloursdocker/docker / /
CMD [ "npm", "start" ]
