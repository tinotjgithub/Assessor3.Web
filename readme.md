# rm-assessor-poc Frontend

## Setup

This requires [node and npm](https://nodejs.org/en/) to be installed.

```bash
# install dependencies
npm install
```

## Building tsx files

```bash
./node_modules/.bin/gulp
```

## Development

```bash
./node_modules/.bin/webpack-dev-server
```

## Testing

### Unit Testing

```bash
# run unit test cases using npm command 
npm test
```
### End to End

There are [nightwatch](http://nightwatchjs.org/) tests in `Tests/Nightwatch` which
can be run through npm scripts:

```bash
# run against the local dev server localhost:8080
npm run test-e2e

# run against the live site (ngareactwo.azurewebsites.net)
npm run test-e2e -- -e live
```

## Style checking using tslint

```bash
gulp tslint
```