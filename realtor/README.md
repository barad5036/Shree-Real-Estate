https://user-images.githubusercontent.com/74545192/195051897-365da939-a071-450c-a084-80bb9f207644.mp4

## Shree Real Estate

### Real Estate app that populates data from an API endpoints, Bayut API, fetches the real estate UAE data, and NewscatcherAPI for real time news headlines across the world,  Redux Toolkit's RTK Query was used to communicate to the multiple endpoints and state management, I made used of Firebase Auth REST API for authentication.

### Features
* Landing Page
* Property Listing Page
* Property Details Page
* Agency Page
* Blog Page
* Signup and Login Pages
* User Authentication
* Search Query
* Highly responsive and aesthetic design
* FAQs

### Dependencies/Tools
* React
* Redux Toolkit
* React Router 5
* Tailwindcss
* Firebase
* React Icons

### APIs
* Firebase Auth REST API
* Bayut API  [Real Estate]
* Newscatcher API [Global News]

### Shree Real Estate is hosted on Netlify

### [Live View](https://shree-real-estate.netlify.app/home)  


[![Netlify Status](https://api.netlify.com/api/v1/badges/8c2d58f9-aa02-4e52-99c5-9658f5946663/deploy-status)](https://app.netlify.com/sites/shree-real-estate/deploys)

## Deploy this repository to Netlify

1. In Netlify, choose **Add new site → Import an existing project** and connect the `barad5036/Shree-Real-Estate` GitHub repository.
2. Leave the base directory empty. The root `netlify.toml` installs and builds the React app from `realtor/`, publishes `realtor/build`, and routes client-side URLs to `index.html`.
3. To use the API, first deploy the Express app in `backend/` to a Node.js host and configure its environment variables there: `MONGO_URI`, `JWT_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, and `CLIENT_URL` (your Netlify site URL).
4. In Netlify, open **Site configuration → Environment variables** and add `REACT_APP_API_URL` with the backend API URL ending in `/api` (for example, `https://your-api.example.com/api`). Trigger a new deploy after saving it.

Netlify hosts the React frontend; it does not run the Express server or MongoDB database from this repository. Keep backend credentials on the backend host, not in frontend environment variables.
