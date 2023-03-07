
# Hi there

This is a web app to import contacts from .csv files following a specified format.

## Technology used

**Backend**: Node.js, Typescript, TypeORM, PostgreSQL. <br>
**Frontend**: React, Bootstrap

## Instructions to RUN

1. Edit the **env.example** file accordingly
2. Move to **./backend** and run ``npm install``
3. Move root directory and do ``docker compose up``
4. Move to  **./frontend**  and run ``npm install``
5. Edit the **env.example** file with **PORT**
6. Edit the **proxy** variable in **package.json** with server URL
7. Run ``npm start`` and localhost should open in the browser

## Instructions use the app

1. First create an account 
2. Login with existing user 
3. Upload a .csv with column names like **sample.csv** 

## Instructions to Test

1. Move to the **./backend** directory
2. Edit **.env.test** and run ``npm test``

PD: Node.js and Docker must be installed 
