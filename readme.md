# About

Express backend using `passport`, `csurf`,`express-validator` and `mongoose`.

# API

If the post request is invalid, the backend will reply with a `message` and `additionalInfo` which contains an array of objects that provides additional info on which part of the request is invalid:

## Example:

```
 {
     "message" : "Invalid inputs passed, please check your data",
     "additionalInfo: [
         {
            "name": "username",
            "error": "Username can not be empty"
         }
     ]
 }
```