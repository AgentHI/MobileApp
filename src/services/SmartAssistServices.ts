export const GetIntent = async (prompt: string, token: string) => {
  const url = 'http://api.test.agenthi.ai:3000/api/getintent';
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({prompt}),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log('Error fetching API:', error);
  }
};

export const HandleIntentApi = async (
  agentId: string,
  intentObj: any,
  token: string,
) => {
  const url = 'http://api.test.agenthi.ai:3000/api/handleIntent';
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  console.log('HandleIntentApiParams__',agentId, intentObj, token);
  

  const body = {
    agentId:  `${agentId}`,
    intent: JSON.stringify(intentObj),
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    console.log('API Response:', result);
    return result;
  } catch (error) {
    console.error('Error:', error);
  }
};
