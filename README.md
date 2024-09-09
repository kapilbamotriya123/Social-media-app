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
first added the sub dropdown for theme in user button 
then added the classes and onclick the theme was changed was was fetched was method described below
wrap the children in root layout insider theme provider
then the use theme hook was availbale with {theme , setTheme} and wallah we can now set the theme and remember theme was provided in the root layout to change them on login pages too.

**Now I will begin working on sticky sidebar/bottom bar**
added MenuBar as comp in main only and then added buttons and given classes
then imported in then (main)/layout

**Creating posts**
added the model for post in prisma.schema
created a validation type for the post with zod in validation.ts
create a action for creating post in components/posts/editor/action.ts
    the general action which add something to db, first validate user then parse the data with the schema and adds the data to db with prisma 


**The Tiptap library is used for adding content input check its documentations**
so tiptap library is added for textarea in the post which resize and all that stuff which makes it pretty we dont have to do it ourselves

so we added the tiptap editor in comp/post/PostEditor.tsx and then added the editor in the post editor comp then added the post comp in the main page

**Post section**
so we have render the post on the Home page.tsx and passed to Post(render individual post) 
the tricky part is that we have added the users info with post and type of which is not known 
basically post have a type defined in prisma and it gives us that but 
we dont have any type where can include the contents of foriengn key then issue is solved inside the lib/type.ts which has some really handy methods to get the types of included data

and fetching pages is easy just normal tailwind 
the date is set relative inside of relativeData.ts in lib

****

**Trending Sidebar**

Now we added the trending sidebar which we did not added in layout .tsx but we created a comp seperate in /components
then fetched random users and created a who to follow comp where we added this users to follow and their styling part 

after this we added trending topics inside the trending bar which had a very complex sql query to find the count the count of hashtags and then it returned a table 
we used unstablecache for storing this hashtag data we set to revalidate every 3 hrs 
then we built the front page for seeing these trending topics 

REMEMBER WE DID MULTIPLE NEW THINGS HERE TOO SO CHECK GIT HUB COMMITS AS THEY ARE NOW DONE AFTER EVERY COMPLETION OF EVERY SECTION WITH PROPER NAMING 
CHECK THE RELATED GITHUB TO SEE WHERE WE MADE CHANGES AND WHAT CHANGES WE MADE WITH REFERENCES FROM THIS FILE


**React Query and fetching of notes on the client side with api request**
added the React query provider and wrapped the complete app inside that 
created an api route for for-you page and  the for-you component which fetches pots which fetches the post with react query and renders them with post component is added to home page

them removed then cache of react with when a user log out otherwise the next user will see the data of posts feed of prev user


**ky**
ky just makes the fetching of data easier and we can configure it to make the data data of our choice 

**Reactinfinitequeries**

we made a lost of change sin the api to fetch the 10 + 1 notes and if they are greater 10 ie 11, we will send the id of 11th post in the res as nextCursor 
with react infinite query we can use this cursor to know if there are more posts and if there are the query sends another request under the hood of using fetchNextPage fn given by reactInfiniteQuery
the type of post is now diff as contains a cursor in it so we defined it in typescript but everything is self explanatory 
the specif code part is pushed to github under commit 'added ky and  react infinite query and its logic'

**adding a post skeleton in page load**
added a post skeleton while the page is loading 

**adding post with react query**
The post uploading should also update the state of application so updating the post is now done query mutations
the lgic for this is written inside the mutations.ts ie. useSubmitPost mutation which updates the state of the application after adding the post 
and the sumbitpost is directly called inside the function 
The code is added to github commit seperately and can be checked if needed


**deleting posts**
we first implemented the actions for deleting post on server which required auth if post admin and user are the same 
them we implemented the mutation which should call the fn in action and then update the query's state
then we made the delete button toggle
and then we added that in a dropdown trigger which was then added to post and then made connection between them 


**Following**
so following something requires optimistic updates
create a many to many relationship through Follow table which has two field follwing id and follower id 
make an api route for handling the following request as the optimistic updates are done on the client side and to fetch data on the client side we need to make api call
first we will make api route which will handle the following related queries

for getting the info whether we follow the user or not we used the get request
for following the user we used the post request which added the values in the follow table 
for unfollowing the user we used the delete request which deleted the values from the follow table

then we created the useFollowerInfo  hook which will handle the following and unfollowing of the user
the use Follower info created a query which takes the userId and initial state

the query key is defined as 'follower-info' and userId which make it unique for the user with whom we are interacting 
the query function gets the data of follower

**setting up the optimistic updates**

we use the useMutation hook from the react query and what it on clicking the follow button we were we set the mutationFn which handled if the user is already following the acc or not 
then onMutate we made the optimistic updates which does changes the state of the application without checking the status from backend and if the backend throws error then the state will go back to its prev state

**Now we will build the following feed**
which is basically the return the post from the user who you are following and very similar to for you feed
lets start by react a api route for fetching the posts of user that we follow 

then the route request is called in the following feed just like we did in the for you feed
we then we added a tabs from shadcn which allow us to toggle between all users and user that we follow 


**lets create the user page**
which we will create in an appropriate directory


**making hashtags @ and url into urls from the posts**
we will use linkify react lib which give us freedom to convert text into url 
it words by wrapping the inside it and the rendering the children then it will search the hashtags and urls which we will define in the component
check comp for details

**UserTooltip**
added a user toop tip which on hover on user profile shows user info and follow button 
this needs to done in many places wherever there is any username so it provider like comp which wraps the user info and user info is passed to it via props 


**for setting tooltip for username in the post we have to create a api route as the user tooltip provider need the user info**
create an api route in users/username/[username]
after creating api route we made a comp userlinkwithtootip which calls this route via react query and give the info the usertooltip which wraps the link and complete thing is returned with a prop username 
and it was used in the linkify where we were make the username into link so that it has username info and the which passes as prop to our comp and wallah everything works

**now we will start to upload the user profile via setting up upload thing**
first connect github with the upload thing 
then get the keys from the upload thing 
put the keys in the env
then use the appid to available for client by adding adding NEXT_PUBLIC_
then create a file router in core.ts in the api/uploadthing/core.ts
then create a route which uses the createRouteHandler from the upload thing and provides a GET And POST router
we export the useUploadThing and uploadFiles too which we get from the generate react helper inside the file uploadthing.ts in lib
last in the root layout we have to add the Nextssrplugin and routerconfig value is extractRouterConfig(fileRouter) this is mentioned in the documentation and I am note sure why are using it 

This whole part is repeated below for better understanding of concept so check that instead of this 
**next up we will start using upload thing to update the user
we created a action updateUser which takes the values bio and displayName and updates the database and returns the updated user
then we will create a mutations.ts which keeps the code clean and this will update the query cache and server side stuff
the mutations is very lengthy but understandable as these are pretty much the same update the details to server and change the cached query
the show error or success message** 

**Uploading Files on the UploadThing**
first we need to set the api route for upload thing that we did in the api/uploadThing/core.ts 
Some important things are we replaced the file url with the custom url that is generated for us with out app id in it so that anyone cannot access this urla dn only req from our app are received
after that we need to whitelist the url before loading it, (as it will make request from server to another file so whitelisting is done )
white listing is done in next.config.mjs
we need to whitelist this app because nextjs resizes the image and to stop anyone form using our server for resizing their image need to make sure that request received from our app are only accepted which is done by url specific to our app

then we will create the actual route which will handle this api call from client in api/uploadThing/route.ts which we get upload createRouteHandler from upload which takes on arg that is router: fileRouter(that we just finished setting up)
we need to export the useUploadthing and uploadFiles hook from the lib/uploadThings.ts
then we add the NextSSRPlugin in root laout

we now need to edit profile of user but that also contains the name and bio so we should first create validation schema for them

so lets now start creating the server action for handling the updates on edit profile (this is created only for display name and bio because the upload files have their own router)
now we will create a mutations.ts file for mutating data (the file is created in the router where show the user profile)
the mutation function is quite complex but what is does is , it performs both the request to updateUserdata and update the avatar url and changes the query cache in order to display the avatar on all posts 

Next up we will made the Edit button functional 
we create a edit button dialoge which gets rendered on clicking edit button 
this dialog has a form which contains the display name and bio in field 
but we also have avatarInput in it which have made in seperate comp avatar input which renders an image and a camera on it and on clicking it a file selector pops up 
and now we want to crop this image with acrop dialog which we make in comp dir as this is reusable and take image, aspect ratio, onCropped-fn, onClose-fn which we will where the comp is being used
we are using react-cropper for cropping the image which also has the css file which needs to be imported in order to give the crop styles that we want 

In avatar input after selecting the image we have fn onImageSelected which resizes the image before passing it to cropImage dialog the 
for resizing we use the react-image-file-resizer package , this takes a number of arguments and and set the resized image to setImageToCrop and as soon as the imageToCrop is defined the crop image dialog appears

after all this we mutate the new avatarFile too which we define in new onj called avatar url and use it as croppedImage by converting the blob to file and if cropped image is not there we set it to undefined and then we mutate the new avatar

now we will change the core.ts to delete the old avatar when I upload a new one which does this as explained in the comments of the same 


**OK so now we will upload media along with text in the posts**

[//]: # (most of the stuff is defined in the the comments)
first we will add a new prisma model Media 
then will make a relation between media and post, ie. on post can have multiple media

then we change the core.ts accordingly to add the images and videos
we return the mediaId from here which we will use when creating a new post 
so lets change the validation for creating new post

after all this we will build the custom hook to upload the media 
created a custom hook useMediaUploads which renders all the neccessary hooks 

**Then we created media previews to see the media in the posts**

**Now we will build drag and drop along with copy paste**
is is done by a hook useDrazone by upload thing itself