[![Build Status](https://travis-ci.org/systelab/skillsbase-frontend.svg?branch=master)](https://travis-ci.org/systelab/skillsbase-frontend)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/88aef97b995c4bd0ae6e7e615b663ec5)](https://www.codacy.com/app/alfonsserra/skillsbase-frontend?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=systelab/skillsbase-frontend&amp;utm_campaign=Badge_Grade)
[![Known Vulnerabilities](https://snyk.io/test/github/systelab/skillsbase-frontend/badge.svg?targetFile=package.json)](https://snyk.io/test/github/systelab/skillsbase-frontend?targetFile=package.json)

# Skillsbase Frontend

This project is a Skills Base application front-end.


## Getting Started

To get you started you can simply clone the `skillsbase-frontend` repository and install the dependencies:

### Prerequisites

You need [git][git] to clone the `skillsbase-frontend` repository.

You will need [Node.js][node] and [npm][npm].

### Clone `skillsbase-frontend`

Clone the `skillsbase-frontend` repository using git:

```bash
git clone https://github.com/systelab/skillsbase-frontend.git
cd skillsbase-frontend
```

### Install Dependencies

To install the dependencies you must run:

```bash
npm install
```
### Run

To run the application use the following command:

```bash
ng serve
```

In order to login, you need a backend. A SkillsBase Backend is implemented in the https://github.com/systelab/skillsbase repository.

## Docker

### Build docker image

There is an Automated Build Task in Docker Cloud in order to build the Docker Image. 
This task, triggers a new build with every git push to your source code repository to create a 'latest' image.
There is another build rule to trigger a new tag and create a 'version-x.y.z' image

You can always manually create the image with the following command:

```bash
docker build -t systelab/skillsbase-frontend . 
```

The image created, will contain a [nginx server][nginx] with the application files.

You can easily tweak the nginx config in [nginx/default.conf](nginx/default.conf), for example to [configure the server as https](http://nginx.org/en/docs/http/configuring_https_servers.html)

### Run the container

```bash
docker run -d -p 8081:80 systelab/skillsbase-frontend
```

The app will be available at http://localhost:8081

In order to change the backend server, you can set the variable BACKEND, for example:

```bash
docker run -d -e BACKEND='http://www.dep.com:8080' -p 8081:80 systelab/skillsbase-frontend
```

If not set, the default value will be http://localhost:8080

[git]: https://git-scm.com/
[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
[Angular]: https://angular.io/
[nginx]: https://nginx.org/
[yo]: http://yeoman.io/
