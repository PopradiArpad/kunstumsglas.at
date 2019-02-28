# Test

## Initialize server test db
```
cd PROJECT_ROOT
cp test/db_test.tar.xz .
tar -xf db_test.tar.xz
```

## server
Uses mocha.
```
npm run test_server -- mocha options
```
The mocha config must be in /test.

## app
Uses jest.
```
npm run test_app -- jest options
```
