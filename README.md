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

# Basic Functionality

## My API

After the endpoint has been hit, the api takes the response from the provided endpoint and then scrapes PDQ's about us page looking for a name match. 

The scraper is set up in a way to match the name to provide the picture link even if someone had a name change. This is to work around the name change if the name change was updated in the about us page, but not where the pictures are stored. 

In the event of people sharing the same name, the api will then choose one of the scraped links for the picture and randomly choose which picture to display with the given thought.

After the picture link is set, the api will return the thought object to the frontend for parsing. If this process takes too long, the api returns a rejection. 

## Frontend/Server/socket.io

Once a request has been sent by the frontend, `socket.io` will then communicate with the server to tell the server to let the other connected clients know that the api has been hit. Once this happens, the button used for the api call is disabled and shows a marquee of `Thinking. . .`; there is also a timeout set to display a `Stop Thinking` button after the allotted time. This button will appear a couple of seconds after the forced timeout that is in the api. This is implemented in the event of a disconnect and too much time has passed to receive the response, or any other reason the call is taking too long. In this event, the user can wait for another response from `socket.io`, or initiate another call.

After the client gets the response, the response is communicated back to the server to update all connected clients. The response is used to give the page its layout.

# Improvements/Desires/Problems

* I would like to have a way to test this on a larger scale to see if the bottlenecking I implemented works as desired. It seems like a remote server is more suited for operations than a local server.

* With the way I'm handling the api calls, I'm forcing a timeout after about 20 seconds on the backend and and returning a failed api call if there is already a call active. If the intention was to avoid conflicting responses for the clients, I believe I have this condition met. If not, however, I would need to research a little into actually stopping an api call after one has been sent out. If the botteneck works better on a remote server, this is a needless worry.

* If the above point is valid, a database is involved, and this process could apply to a different application, I could probably give the client (original api caller) the information and ask them to confirm the change. After the change is confirmed by the client, the hypothetical database will be updated via a different api process with its own bottleneck and a new timestamp on the confirmation process. 
  
  The timestamps being put on the thought could be used to compare with the latest database update, and be rejected if it is an earlier version of the information. If this process is too lenghty, it could be automated while using `socket.io` for confirmation and comparison. This way, in the event of the bottleneck failing at both points, it avoids two simultaneous updates by comparing the thought timestamp and confirmation timestamp.

* The `marquee` I am using to notify users of an api process is flagged as a distracting element in `eslint`. This would need to be resolved instead of putting `// eslint-disable-next-line` before the line the `marquee` is on.

* Better layout and use of arias and labels for accessibility.

* A message that displays briefly when the api times out or fails.

* Emitting `socket.io` instances purely from server so as not to rely on the client to update the other clients. This will let clients know of an api failure, or update in the event of the original client disconnecting or having other issues.