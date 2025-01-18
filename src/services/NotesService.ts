export const UpdatePersonalContentBlock = async (
  myNoteId: string,
  blockUuid: string,
  newNote: any,
  token: string,
) => {
  const url = `http://api.test.agenthi.ai:3000/api/smartNotes/${myNoteId}/contentblock/uuid/${blockUuid}`;

  const headers = {
    Accept: '*/*',
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const body = JSON.stringify({
    type: 'text',
    text: newNote,
  });

  // Construct curl command
  const curlCommand = [
    `curl -X PUT "${url}"`,
    ...Object.entries(headers).map(([key, value]) => `-H "${key}: ${value}"`),
    `-d '${body}'`,
  ].join(' \\\n');

  console.log('Curl Command:\n', curlCommand);

  const response = await fetch(url, {
    method: 'PUT',
    headers,
    body,
  });

  if (!response.ok) {
    throw new Error(`UpdatePersonalContentBlockError: ${response.status}`);
  }

  const data = await response.json();
  console.log('UpdatePersonalContentBlock--', data);
  return data;
};

export const DeletePersonalContentBlock = async (
  myNoteId: string,
  blockUuid: string,
  token: string,
) => {
  const response = await fetch(
    `http://api.test.agenthi.ai:3000/api/smartNotes/${myNoteId}/contentblock/uuid/${blockUuid}`,
    {
      method: 'DELETE',
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    },
  );

  if (!response.ok) {
    throw new Error(`DeletePersonalContentBlockError: ${response.status}`);
  }

  const data = await response.json();
  console.log('DeletePersonalContentBlock--', data);
  return data;
};

export const AddPersonalContentBlock = async (
  myNoteId: string,
  formData: any,
  token: string,
) => {
  const url = `http://api.test.agenthi.ai:3000/api/smartNotes/${myNoteId}/addPersonalContentBlock`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  const data = await response.json();
  console.log(data);

  return data;
};

export const AddPublicContentBlock = async (
  myNoteId: string,
  formData: any,
  token: string,
) => {
  const url = `http://api.test.agenthi.ai:3000/api/smartNotes/${myNoteId}/addPublicContentBlock`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Response:', result);
    return result;
  } catch (error) {
    console.error('Error:', error);
  }
};

export const AddPrivateContentBlock = async (
  myNoteId: string,
  formData: any,
  token: string,
) => {
  const url = `http://api.test.agenthi.ai:3000/api/smartNotes/${myNoteId}/addPrivateContentBlock`;

  console.log('AddPrivateContentBlock_params__', {
    myNoteId,
    formData,
  });

  // const curlCommand = `
  //   curl -X POST "${url}" \\
  //   -H "Authorization: Bearer ${token}" \\
  //   -F "formData=${JSON.stringify(formData)}"
  //           `;
  // console.log('Equivalent cURL Command:', curlCommand);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Response:', result);
    return result;
  } catch (error) {
    console.error('Error:', error);
  }
};

export const GetPublicClientNotes = async (
  clientNoteId: string,
  token: string,
) => {
  const url = `http://api.test.agenthi.ai:3000/api/smartNotes/${clientNoteId}`;
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Smart Notes Data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching smart notes:', error);
  }
};

export const GetPrivateClientNotes = async (
  clientNoteId: string,
  token: string,
) => {
  const url = `http://api.test.agenthi.ai:3000/api/smartNotes/${clientNoteId}`;
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log('GetPrivateClientNotes Data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching GetPrivateClientNotes:', error);
  }
};

export const FetchSummaryNotes = async (
  clientNoteId: string,
  token: string,
) => {
  const url = `http://api.test.agenthi.ai:3000/api/smartNotes/${clientNoteId}/generateSummary`;
  const headers = {
    accept: 'application/json',
    Authorization: `Bearer ${token}`,
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error fetching summary:', error);
  }
};

export const SearchNotes = async (data: any, token: string) => {
  const url = 'http://api.test.agenthi.ai:3000/api/smartSearch/notes';
  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
  // const body = JSON.stringify({
  //     notes_id: "67401470e38d2b03685a2725",
  //     query: "price discussed"
  // });
  const body = JSON.stringify(data);

  const curlCommand = `
  curl -X POST '${url}' \\
    -H 'Accept: application/json' \\
    -H 'Authorization: Bearer ${token}' \\
    -H 'Content-Type: application/json' \\
    -d '${body}'
    `;
  console.log('SearchNotesCurl_______', curlCommand);

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
    console.log('API Response:', data);
    return data;
  } catch (error) {
    console.error('ErrorSearchNotes:', error);
  }
};

export const FetchLatestNotes = async (token: string) => {
  const url = 'http://api.test.agenthi.ai:3000/api/smartNotes/latestnotes';

  // console.log('_tokentoken___', token);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    // console.log('Response Data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching latest notes:', error);
  }
};

export const OverAllSearch_ = async (requestData: any, token: string) => {
  const url = 'http://api.test.agenthi.ai:3000/api/smartSearch/overall-search';
  // const requestData = {
  //   smartNoteId: 'string',
  //   query: 'Badri'
  // };

  console.log('OverAllSearch_Params__ ', requestData, token);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    console.log('API Response:', result);
    return result;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const FetchSmartNotes = async (
  smartnotesId: string,
  token: string,
  page: number = 1,
  limit: number = 10,
) => {

  console.log('FetchSmartNotes__',{smartnotesId,token,page,limit});
  
  const url = `http://api.test.agenthi.ai:3000/api/smartNotes/${smartnotesId}/notes?page=${page}&limit=${limit}`;
  const headers = {
    accept: 'application/json',
    Authorization: `Bearer ${token}`,
  };
  try {
    const response = await fetch(url, {headers});
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching the API:', error);
  }
};
