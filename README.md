# Job Management Frontend

Frontend for this assignment was created with Vite+React JS

## Table of Contents:

- [Installation](#installaltion)
- [Featurees](#features)
- [Usage](#usage)
- [Error Handling](#error-handling)
- [Production](#production)

### Installaltion

- Run `npm install` to install all the necessary packages.
- Create a `.env` file in the root directory of the project.
- Create a environment variable named `VITE_SERVER_NAME` and add the backend server name as a string. e.g. `"http://localhost:5000/"`
- Run `npm run dev` and the project will run in development mode.
- Go to `https://job-management-beryl.vercel.app/` here to see the production build.

### Features

#### Unique Appointments:

This software lets the user choose a date in the present or future. Then checks against all other appointments for that day. If any appointment is present blocks of that time. Adiitionally, it also does not let the user choose a time in the past.

#### Data Persistence:

We used NoSQL database so the data persists throughout application reloads.

#### Form Validation:

We used custom hook for inline validation and overall form validation. All of the fields, in all the forms are individually validated, if they are all true then and only then the form is valid and user can submit.

#### Custome HTTP Hook to optimize HTTP requests:

This hook allows us to simplify our Http requests,at component level. Additionally, by using useeffect along with abort controller to cancel out any request when component is unmounted. This allows us to avoid memory leaks.

#### Custom Form Hook:

This hook allows us to manage input field and form validation, along with simpler flow of logic. This allowed us to have one component for creating and editing jobs.

### Usage

#### Job List View

The job list view is available at `home` path. The initial table shows:

- Information Overview.
- Status with a color indicator.
- Actions tab for further action.

The actions column gives multiple options for each entry

- View details by clicking the eye icon.
- Edit the details by clicking on the edit icon.
- Delete the job by clicking the trash bin icon.

#### Job Details View

Clicking on the eye icon opens a modal that shows every detail for the job selected.

#### Editing Details

The edit icon takes you to the create job tab but with the selected jobs details filled out along with date and time. From here, you can change any details by clicking the submit button. This will return you back to dashboard, where you can view your updates reflected.

#### Deleting Entry

Clicking on the trash icon will open a modal, where you have to type in the **Bold/Highlighted** text to confirm the action. This measure, is there to ensure accidental deletion.

Along with the action tab, on the navigation bar and the right top corner of the table, you will find the option to create new jobs.

#### Create New Job

Simply fill out the form, with appropriate value and submit. Change the calendar date, when you select a date it will fetch the blocked off time from database and render every availble block from **9AM to 5PM**. Select a time slot and submit. This will redirect you to `home` directory with updated table, reflecting the change.

### Error Handling

We have Created a custom error and edge case handling method for our editing and job creation page. If due to network/database/server connection issues you face the component. Simply click the **Reset** button to retry the action.

### Production

This project is hosted on vercel, so that you can test it out at ease. Simply click on the link below, and head on out.
`https://job-management-beryl.vercel.app/`
