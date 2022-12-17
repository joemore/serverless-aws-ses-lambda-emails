import AWS from 'aws-sdk';
import axios from "axios";

function sendResponse( success, message ){
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(
      success ? { success : true , message : message }
      : { success : false, error: message }
    )
  };
}

export const post = async (event) => {
  const data = JSON.parse(event.body);
  console.log(`😎 Data...`, data);
  const token = data.token;
  delete data.token;
  const { success, error } = await isValidToken(token);
  if (success) {
    // console.log('TOKEN SUCCESS ✅:');
    const { success, message } = await sendEmail(data);
    return sendResponse( success, message );
  }else if( error ){
    // console.log('TOKEN ERROR ⛔️:', error);
  }
  return sendResponse( success, error );
};

export const isValidToken = async (token) => {
  try {
    const response = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
      params: {
        secret: process.env.RECAPTCHA_SECRET,
        response: token
      }
    });
    const { success, 'error-codes': errors } = response.data;
    // console.log('🤬',response.data);
    return { success, error: errors?.length ? errors[0] : undefined };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

function escapeHTML(str) {
  return str.replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

const sendEmail = async (data) => {

  //Remove HTML tags but replace new line with <br/>
  const message = escapeHTML(data['message']).replace(/(?:\r\n|\r|\n)/g, '<br/>');
  const subject = escapeHTML(data['subject']);
  const name = escapeHTML(data['name']);
  const email = data['email'];

  if( !email || email.trim().length < 1 ){
    return { success: false, message: 'No email provided!' };
  }
  if( !name || name.trim().length < 1 ){
    return { success: false, message: 'No name provided!' };
  }
  if( !message || message.trim().length < 1 ){
    return { success: false, message: 'No message entered!' };
  }

  console.log(`🍒 Emailing... to "${process.env.TO_EMAIL}" from "${process.env.FROM_EMAIL}", user email: ${email}, subject: ${subject}, message: ${message}`);

  const params = {
    Destination: {
      ToAddresses: [
        process.env.TO_EMAIL
      ]
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `<p style="font-style:bold;color:#A9A9A9;margin-bottom:20px">Name: ${name} <br/>
          Subject: ${subject} <br/>
          Email: ${email} <br/>
          </p>
          <p>
          ${message}
          </p>
          `
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject.trim().length && subject
          || process.env.BLANK_SUBJECT //Include this in your .env if you wish
          || `Contact Form - ${name}` //Default subject if left blank by user
      }
    },
    ReplyToAddresses: [
      `${name} <${email}>`
    ],
    Source: process.env.FROM_EMAIL,
  };
  await new AWS.SES({ apiVersion: '2010-12-01' }).sendEmail(params).promise();
  return { success: true, message: 'Email has been sent!' };
};