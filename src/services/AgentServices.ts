import {Platform} from 'react-native';
import {Constants} from '../constants/Constants';
import RNFetchBlob from 'rn-fetch-blob';

export const CreateAiAgent = async (
  AgentData: any,
  BearerToken?: string,
  auth: boolean = true,
) => {
  // console.log('CreateAiAgent__params___ ', AgentData, BearerToken);

  const data = {
    ...AgentData,
    password: '00000000',
    certificates: ['string'],
    address: 'string',
    isagreemented: true,
  };

  try {
    const response = await fetch(Constants.AgentBaseUrl, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: auth ? `Bearer ${BearerToken}` : '',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const responseData = await response.json();
    // console.log(responseData);
    return responseData;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
};

export const CheckAgentViaEmail = async (agentEmail: string) => {
  try {
    const response = await fetch(
      `${Constants.AgentBaseUrl}/email?email=${agentEmail}`,
      {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Cookie:
            'connect.sid=s%3AUmXmRVYyi6rw4xWnfvSJYJ5EItiGTM0S.u4Oit5zPYkeQm1sOCV8kU97UTA3F1rd3thm1VVN2KWA',
        },
      },
    );

    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }

    const data = await response.json();
    // console.log(data);
    return data;
  } catch (error) {
    console.error('There was an error with the fetch operation:', error);
  }
};

export const FetchAgentViaEmail = async (email: string) => {
  try {
    const response = await fetch(
      `${Constants.AgentBaseUrl}/email?email=${encodeURIComponent(email)}`,
      {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Cookie:
            'connect.sid=s%3ARzvNPkj8W4dCnHPEIJaWWH_Zye8DE5gv.MX0Hkxy%2F0U1qgHqGuOkCfXcusLAbNgAd7wswaQNtcOg',
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching agent details:', error);
    throw error;
  }
};

export const UpdateAgentData = async (
  AgentData: any,
  BearerToken: string,
  agentId: string,
) => {
  const data = {
    ...AgentData,
    password: '00000000',
    certificates: ['string'],
    address: 'string',
    isagreemented: true,
  };

  try {
    const response = await fetch(`${Constants.AgentBaseUrl}/${agentId}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${BearerToken}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const responseData = await response.json();
    // console.log(responseData);
    return responseData;
  } catch (error) {
    console.error('UpdateAgentDataError:', error);
  }
};

export const UpdateUnavailability = async (
  AgentData: any,
  BearerToken: string,
  twinId: string,
) => {  
  try {
    const response = await fetch(`${Constants.TwinBaseUrl}/${twinId}/availability`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${BearerToken}`,
      },
      body: JSON.stringify(AgentData),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('UpdateUnavailability:', error);
  }
};

export const UpdateAtwinData = async (twinData: any, twinId: string) => {
  console.log('params__UpdateAtwinData', JSON.stringify(twinData), twinId);

  try {
    const response = await fetch(`${Constants.TwinBaseUrl}/${twinId}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Cookie:
          'connect.sid=s%3AogHUOAGtsb4tTJ1bat2WHM4sSu00e71C.myr%2FBc%2B60nuDH6zcTUislrYPj45LDqVcO8D4XsYmFu8',
      },
      body: JSON.stringify(twinData),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const responseData = await response.json();
    // console.log(responseData);
    return responseData;
  } catch (error) {
    console.error('UpdateAtwinDataError:', error);
  }
};

export const CreateClient = async (payload: any, BearerToken: string) => {
  try {
    const response = await fetch(`${Constants.ClientBaseUrl}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${BearerToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    // console.log('Response:', data);
    return data;
  } catch (error) {
    console.error('CreateClientError:', error);
    throw error;
  }
};

export const FetchAllClients = async (
  agentId: string,
  BearerToken: string,
  page: number = 1,
  limit: number = 10,
) => {
  // console.log('FetchAllClients_params__', {
  //   agentId,
  //   BearerToken,
  //   page,
  //   limit,
  // });
  const options = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${BearerToken}`,
    },
  };

  const url = `${Constants.ClientBaseUrl}/${agentId}?page=${page}&limit=${limit}`;

  const curlCommand = `
  curl -X ${options.method} "${url}" \\
  -H "Accept: application/json" \\
  -H "Cookie: connect.sid=${encodeURIComponent(
    's%3Af-8yytGfN8lrIEII5xDT6zr_9Ky_-neR.uOrpv1QyjG0gsCMwp2hM54o1AQAdpp2oMYvwhwXGGeU',
  )}" \\
  -H "Authorization: Bearer ${BearerToken}"
    `.trim();

  // console.log('CURL_FetchAllClients_____:', curlCommand);

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    // console.log(data);
    return data;
  } catch (error) {
    console.error('FetchAllClientsError', error);
  }
};

export const CreateAppointment = async (
  appointmentData: any,
  BearerToken: string,
) => {
  // const appointmentData = {
  //     twin_id: twinId,
  //     start_time: startTime,
  //     end_time: endTime,
  // };

  try {
    const response = await fetch(`${Constants.ApiBaseUrl}/appointments`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: BearerToken,
        Cookie:
          'connect.sid=s%3Af-8yytGfN8lrIEII5xDT6zr_9Ky_-neR.uOrpv1QyjG0gsCMwp2hM54o1AQAdpp2oMYvwhwXGGeU',
      },
      body: JSON.stringify(appointmentData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();
    // console.log('Appointment created successfully:', responseData);
    return responseData;
  } catch (error) {
    console.error('CreateAppointmentError', error);
    throw error;
  }
};

export const pushTokens = async (idToken: string, serverAuthCode: string) => {
  const url = 'http://api.test.agenthi.ai:3000/api/agents/google-login';

  // console.log('pushTokens___',{idToken,serverAuthCode});

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      idToken: idToken,
      serverAuthCode: serverAuthCode,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response.json();
};

export const UploadProfilePicture = async (
  imageObj: any,
  BearerToken: string,
  name?: string,
) => {
  let filePath = '';
    let fileName = '';
    let mimeType = '';

    if (typeof imageObj === 'string' && imageObj.startsWith('http')) {
      const res = await RNFetchBlob.config({ fileCache: true }).fetch('GET', imageObj);
      filePath = res.path();
      fileName = name || `${Date.now()}_photo.jpg`;
      mimeType = 'image/jpeg';
    } else {
      fileName = `${Date.now()}_${imageObj?.fileName || 'photo.jpg'}`;
      filePath =
        Platform.OS === 'ios'
          ? imageObj?.uri?.replace('file://', '')
          : imageObj?.path;
      mimeType = imageObj.mime || 'image/jpeg';
    }

    console.log('UploadProfilePicture_params___', filePath, mimeType);

    const formData = new FormData();
    formData.append('photo', {
      uri: `file://${filePath}`,
      name: fileName,
      type: mimeType,
    });

  try {
    const response = await fetch('http://api.test.agenthi.ai:3000/api/agents/profile-picture', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${BearerToken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Response:', data);
    return data;
  } catch (error) {
    console.error('Error UploadProfilePicture:', error.message);
  }
};

export const SendOtp = async (contact: string) => {
  console.log(contact);
  
  const url = 'http://api.test.agenthi.ai:3000/api/otp/send';
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  const body = JSON.stringify({contact});

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: body,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Response:', data);
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const VerifyOtp = async (data: any) => {
  const url = 'http://api.test.agenthi.ai:3000/api/otp/verify';
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const result = await response.json();
    console.log('Response:', result);
    return result;
  } catch (error) {
    console.error('Error:', error);
  }
};

export const CompleteSignupWithoutToken = async (data: any) => {
  const url = 'http://api.test.agenthi.ai:3000/api/agents/complete-signup';
  const method = 'POST';

  const curlRequest = `
  curl -X ${method} '${url}' \\
  -H 'Accept: application/json' \\
  -H 'Content-Type: application/json' \\
  -d '${JSON.stringify(data)}'
    `.trim();

  console.log('CompleteSignupWithoutTokenCurl__:', curlRequest);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const result = await response.json();
    console.log('CompleteSignupWithoutToken:', result);
    return result;
  } catch (error) {
    console.error('Error:', error);
  }
};

