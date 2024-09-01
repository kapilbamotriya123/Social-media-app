**Configuration**

Installing the related libraries
Installed prisma for the database with npx commands
Created the prisma.ts in ui/lib to connect to prisma

Created database on the vercel and
Pasted the .env files to .env
Pasted the database ref of prisma from vercel to schema.prisma(which created on the installation of prisma)

Created the schema inside the prisma.schema
Then npx prisma db push this pushes the to database  (which now created the table which we just defined in the model)

**Lucia**
For the authentication of the app
For lucia we will create a file auth.ts in src and define all the configuration for lucia and validation of cookies which is there on there documentation (I can’t fin the link but the code is lifted from the docs only and dont need to bother about its complexity)
Next create validation.ts for defining the validation schema for validation of  user credential( email should like email and password validation and much more)
This is imported from an external library ‘zod’
And then define some type for email, password like min length and which chars are allowed and what are the error that will be given
In the nextConfig add a severExternalPackages: [‘@node-rs/argon2’]

**server action for register**
Adding Server action for handling login and register requests in (auth)/signup/action.ts and (auth)/login/action.ts
then we parsed the user credentials with signup schema created by zod
created a password hash
then created a userId with Fn from lucia
checked if username and email already exists
if not then created a user and then created a session for the user
created a session cookie for the user
then set the cookie with session cookie credentials 
and then redirect to the home page
also we caught the redirect error and thrown it as the cookie is created and redirect to the home page

**server action on login** 
its almost the same as register with verification of password and using login validation that's it 

**server action for logout**
directly in actions.ts in (auth)
just get session from validateRequest inside auth
and then invalidate session 
create a blank cookie and then replace set that as cookie  