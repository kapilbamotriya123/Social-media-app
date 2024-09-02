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

**building sign up and log in pages**
building these pages is a tedious task first I created the sign up page with a few tailwind classes and formatiing 
then added signUpForm which is a client component and build the form with react-hook-form and 
ui was made with the shadcn which is complicated but using it is absolutely necessary and mutliple forms will take a lot of time 
we used zod-resolver to validate the type of input from users and and it sets the errors and required field with react hook components which is mentioned on shadcn's official website 
now logging in was handled with our action and start transition hook and error displayed if there are any from the server which is actions in case of next js 
this is pretty much a boiler plate code that I should practise every second website is going to need this

**show password and loading Button**

The passwordInput and LoadingButton components are created in the ui/components folder manually for custom functionality and styling. 
The passwordInput component is used to show and hide the password in the input field. The LoadingButton component is used to show a loading spinner when the button is clicked. 
The components are created using the useState and useEffect hooks in React. The passwordInput component uses the useState hook to toggle the visibility of the password.
The LoadingButton component uses the useState hook to toggle the visibility of the loading spinner. 

setting the error was done in the form 

**layout.tsx for the auth which redirect if a user already have a session **

**Session Context Provider**
the file session context Provider create a comp which return the children with the context whcih can be accessed by user context 
the value for content is given inside (main) layout because session value is fetched there and the childrens of main layout are wrapped with session context provider
which makes it possible for the childrens of main to get the context with the useContext(sessionContext) but we have also created a function useSessionContext which return the session as we dont have to do it manually and its a good practise to do so

**Navbar design**
the navbar is made in its own comp which then is imported inside our main layout so that Is is omnipresent
the navbar also need some comps which are reusable so put them inside components dir such as user avatar and many more 
from here I will just add the comps used in sequence for context check the file itself
the profile icon is added as dropdown menu and added as user button comp
the user button comp has a profile icon in itself 


**Logout && searchField && Theme**

we added the log out button inside the user button dropdown which was connected to the actions.ts in auth which invalidate the session

Then we added the search field inside its own component which is a regular form which on search navigate to url with query of search field 
we will add the funcionality later when we will have some content 

then we added the dark theme which was done with shadcn,
first added the subdropdown for theme in userbutton 
then added the classes and onclick the theme was changed was was fetched was method described below
wrap the children in root layout insider theme provider
then the use theme hook was availbale with {theme , setTheme} and wallah we can now set the theme and remember theme was provided in the root layout to change them on login pages too.