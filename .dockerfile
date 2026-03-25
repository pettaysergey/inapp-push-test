# Docker Image which is used as foundation to create
# a custom Docker Image with this Dockerfile
FROM node:13.12.0
 
# A directory within the virtualized Docker environment
# Becomes more relevant when using Docker Compose later
WORKDIR /
 
# Copies package.json and package-lock.json to Docker environment
COPY package*.json ./
COPY tsconfig.json ./
COPY .eslintrc.js ./
COPY .npmrc ./

ENV REACT_APP_SERVER_TARGET https://nsm-control.msn.apps.d0-oscp.corp.dev.vtb/v1/
ENV REACT_APP_TOKEN eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJ1bnAiLCJpc0F1ZGl0b3IiOmZhbHNlLCJpc0FkbWluIjpmYWxzZSwiZXhwIjoxNjMwNDEzMTgzLCJpYXQiOjE1OTg4NzcxODMsImxkYXBHcm91cHMiOlsiZHNvLXVucC11c2VyIiwiZHNvLXVucC1zdXBwb3J0Il19.YhequGWBgxHKI3OdlLG-u5gSM0k9GvbZRFOxrlHGt83bSpaQRcxAt9jvrAgD8pQWUn3MdppABNIjrlzmJc0FZfoW0RzAJ3MlNEezCTebsOxuf4aCQYxj302GWzsxzLfkryOq_5mnUlOdPfhk9DDlruDttkQSnb9TjVNsyUIu6TXVEJt654E6dsv0rfVqQaQBxfpaDXQebns5UHzeOAARFgUFuUlGVIlYP28mK-ZLFHAWkrtuc3cy65QGUGib1ciaLZtjIg1zLGD2c-C1r8p3qeLiqy3VIee-rIoQCZlRJdMNEIPDz2pHnA0L_ckLPeBtRCjIAa2NcTAmaehKSwlrIg

# Disable ssl strict mode
RUN yarn config set "strict-ssl" false -g


# Installs all node packages
RUN yarn
RUN npm install react-scripts@3.4.3 -g
RUN npm install react-app-rewired@2.1.6 -g
 
# Copies everything over to Docker environment
COPY . .
 
# Uses port which is used by the actual application
EXPOSE 3000
 
# Finally runs the application
CMD [ "yarn", "start" ]