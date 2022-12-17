# Serverless, AWS SES & Lambda Emails

If you have a website with a contact form, and an AWS account then you can easily use this script to send emails via SES to your inbox using any email address that you own. This is effectively one of the cheapest ways to have a robust contact us form on any of your front end react websites. 



# SUPER BASIC GUIDE:

1. Edit (Or Create it if missing) the `./serverless/contact-form/.env` file to add your AWS creds & Google Re-captcha key etc

```
REGION=eu-west-2 
IAM_PROFILE=YourIAMProfile 
FROM_EMAIL=info@website.com
TO_EMAIL=joe@website.com
RECAPTCHA_SECRET=aaaaaaaaaaaaaaa11111111111111
```

2. Run SLS Deploy and get back the API Endpoint (e.g. `https://12345abcd.execute-api.eu-west-2.amazonaws.com/dev/contact-us`)

3. Create a `./frontend/.env` file with your Google Recaptcha key and API end point and start sending emails using the form!

```
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=bbbbbbbbbbbb222222222222
CONTACTUS_API_GATEWAY_ENDPOINT=https://12345678.execute-api.eu-west-2.amazonaws.com/dev/contact-us/
```


<br/>
<br/>

# IN-DEPTH GUIDE:

## Pre-Requisites

1. You must have an AWS Account
1. You need to have IAM Credentials that have access to SES and Lambda
1. You need your credentials to be stored in your `~/.aws/credentials` file
1. You need to have serverless installed [see the serverless.com docs here](https://www.serverless.com/framework/docs/getting-started)
1. You need to have an email address verified in SES
1. Have a Key and Secret from [Google reCAPTCHA](https://www.google.com/recaptcha/)


## Backend Serverless explanation

In our backend example we are using a serverless.com script to host a lambda function that lets us send emails through SES. Before it sends an email it first checks with Google reCAPTCHA to see if the token is valid, and fi not returns an error. 


## Backend Deployment

1. Make sure you have verified an email with SES first
2. Change into our serverless directory: `cd serverless/contact-form/`
3. Create a `.env` file with your credentials and settings like this:
```
REGION=<your-region>
IAM_PROFILE=<your-iam-creds>
FROM_EMAIL=<your-verified-email>
TO_EMAIL=<receiving-email-address>  
RECAPTCHA_SECRET=<your-google-secret-key>
```

4. `npm install` to load our dependencies 
5. Run `sls deploy` to deploy to AWS - once done it'll return you a URL from API Gateway which you use in the next steps below:


## Front end 

Using the URL from the API gateway we can now put this into our frontend form and plug in our Google SITE ID into our .env file, run `yarn dev` and voila, we can now send emails after checking the "I'm not a robot box!" - Please note: this demo front end has been created using Typescript and NextJS.

1. Change into our front end directory `cd ./frontend/`
2. Create a frontend `.env` file to use our Google Site ID and the AWS API Gateway URL 

```
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=aaaaaaaaaaaaaaa11111111111111
CONTACTUS_API_GATEWAY_ENDPOINT=https://12345678.execute-api.eu-west-2.amazonaws.com/dev/contact-us/
```

3. `yarn install` to load our dependencies 
4. `yarn dev` to load our development server