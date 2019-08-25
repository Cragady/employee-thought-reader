**Hosted version:** https://limitless-thicket-11693.herokuapp.com/

# Purpose

The reason behind creating this application was to build a simple User Interface and Backend around an api provided by an outside source. The requirements were to:
  * take the json object and present that to the user in an easy to digest way.
  * Give the user a way to hit the api.
  * Limit the amount of calls that are able to go through (Only one call at a time is the idea).
  * Let the user know when an api call has been made, and that it is still processing
  * Update all connected clients to the latest response from the api simultaneously

To fulfill some of these requirements, I used `socket.io` to communicate between clients and the server on all important changes.

# Technologies

This application is a Node, React, Express app. You will at least Node.js to run this app. I recommend having Node, Nodemon, Yarn, and create-react-app. This app relies heavily on `socket.io`. The rest of the dependencies are in the package.json files for this application.

# On Building the Application

After cloning or forking, run `yarn install` in the root of this application using the CLI. Usually running `yarn start` will start the development version. If you want to test the build as if it were production, run `yarn prod:test`.

