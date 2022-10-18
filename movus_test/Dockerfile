# == CONFIGURE==
# using alpine for smaller image size
FROM node:16-alpine
# set working directory to /app inside the container
WORKDIR /app

# copy app files
COPY package.json .

# install the react
RUN npm install

# copy the file
COPY . .

# set port (using Expose)
EXPOSE 3000

# start the app
CMD ["npm", "start"]