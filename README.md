# Shwop

Shwop is a peer-to-peer, mobile-optimized marketplace with intuitive swipe-based user experience, geolocation tracking and text notifications. Check out Shwop [here](http://shwop.herokuapp.com/)!

## Table of Contents

1. [Overview and Features](#overview-and-features)
1. [Team](#team)
1. [Screenshots](#screenshots)
1. [Code Highlights](#code-highlights)
1. [Requirements](#requirements)
1. [Development](#development)
    - [Installing Dependencies](#installing-dependencies)
1. [Roadmap](#roadmap)

## Overview and Features

Shwop allows users to swipe their way through photos of available items for sale, rather than obliging them to click back and forth through endless links, like more traditional shopping sites. And since the shopping experience is photo-driven, a buyer knows exactly what he or she is getting.

Shwop users can search for specific items, swiping left to browse through what is available for sale and swiping right to place a bid on an item. On a desktop or laptop, users can click and drag through items or use the left/right arrow keys.

Once a bid is placed, the seller is sent an anonymous, peer-to-peer SMS (text) message via Twilio, which contains information about the bid and how to reply to the bidder if they are interested in accepting the offer.

In addition to uploading items for sale, users can also view a summary of all items that they have posted as well as all items for which they have submitted a bid. 

Shwop makes the shopping experience streamlined, efficient, visual, and fun!

## Team

  **Product Owner**: John Wareing  
  **Scrum Master**: Corey Roy  
  **Development Team Members**:
  - Tommy Sander [LinkedIn](https://linkedin.com/in/thomasksander) | [GitHub](https://github.com/tksander)  
  - Brett Sanders [LinkedIn](https://linkedin.com/in/brettwsanders) | [GitHub](https://github.com/brettwsanders)  
  - John Wareing [LinkedIn](https://linkedin.com/in/johnwareing) | [GitHub](https://github.com/jwareing)  
  - Corey Roy [LinkedIn](https://linkedin.com/in/coreyroy) | [GitHub](https://github.com/coreysf)  


## Screenshots

![Shwop App](/screenshots/ShwopMockup.png?raw=true "Web App")
![Shwop Mobile Browser App](/screenshots/iphone_white_angle2.png?raw=true "Mobile App" =200x200)


## Code Highlights

Client-side
- [Products View](/client/app/products/products.html)

Server-side
- [Products Controller](/server/products/productController.js)

Database 
- [Database Configuration File](/server/db/db_config.js)

Code-base Test 
- [Server Intergration Test](/test/server/integration.js)


## Requirements

- Node 
- NPM
- Bower
- mySQL
- Parse.com account

## Development
The following commands are written for OS X.  

### Installing Dependencies
Run all of the following commands from the root directory to setup your dependencies:

```sh
$ npm install
$ bower install
```

### Creating A Local mySQL Database
Create the mySQL database:
```sh
$ grunt create

Running "create" task

Running "shell:createdb" (shell) task
Lets go shwoping!

Done, without errors.
```

#### Accessing The Database

Check if mySQL is installed on your machine by executing:
```sh
$ which mySQL
```
If mySQL is not installed, run:
```sh
$ brew install mySQL
```
Start up your mySQL server
```sh
$ mySQL.server start
```
Start the mySQL shell, login as the root user, and access the database, by executing the below command.  
```sh
$ mySQL -u root shwopDB
```

### Starting Node Server
Open a new terminal window and run the following command to start a new Node server on Port 8080. 

```sh
$ grunt start
```
#### Create Sass file

```sh
grunt runSass
```

## Running Tests

```sh
grunt test
```

### Roadmap
View the project roadmap [here](https://github.com/ClandestineCalavera/shwop/issues)

