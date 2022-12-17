// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  error: String,
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  if (req.method !== 'POST') return

  const body = req.body;
  const { name, email, subject, message, token } = body 

  // Send the request to our AWS API Gateway endpoint, then lambda function then processes it and sends us back a response.
  const url = process.env.CONTACTUS_API_GATEWAY_ENDPOINT;
  if( !url ){
    return res.status(200).json( { error: "Please set CONTACTUS_API_GATEWAY_ENDPOINT in .env" } )
  }

  const response = await fetch(url, {
    method: 'POST', 
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body) 
  });
  const resp = await response.json();
  return res.status(200).json( resp )
}
