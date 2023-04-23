## About

This is a demo project. A quiz app with the following functionalities:

overview of available quizzes,
solving a quiz (going through the questions and answers),
editing a quiz questions,
creating a new quiz.

For the mocking of the server functionality, Mirage JS was used. It has the ability to intercept any request
and handle it as if it was sent to the actuall server. It has the ability to temporarily store data so we can
have a genuine UX for testing and developing purposes.

The Material UI was used for the components composing, such as the buttons, inputs, lists and other. Styling 
was done with the MUI styled functionality. It also provides an easy solution for responsive designs.

React-query was utilized for the data-fetching and state management, since it provides some neat functionalities.

React-hook-form in combination with yup is used for handling the question form, since it provides easy validation 
functionality.

Prop-types were used for type validation, and React-router for the page routing and navigation.


## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

