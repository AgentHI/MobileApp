export const FetchAskAnythingHistory = async (agentId: string, token_: string, page = 1) => {
  const url = `http://api.test.agenthi.ai:3000/api/getaskanythinghistory/?agent_id=${agentId}&page=${page}`;

  const headers = {
    accept: '*/*',
    Authorization: `Bearer ${token_}`,
  };

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
    });

    if (!response.ok) {
      if (response.status === 404) {
        return { data: { history: [] } };
      }
      throw new Error(
        `Failed to ask anything history. Status: ${response.status}`,
      );
    }
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const FetchQueryDetail = async (agentId: string, queryId: string, token_: string) => {
  const url = `http://api.test.agenthi.ai:3000/api/getquerydetails/?agent_id=${agentId}&query_id=${queryId}`;

  const headers = {
    accept: '*/*',
    Authorization: `Bearer ${token_}`,
  };

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch query details. Status: ${response.status}`,
      );
    }
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
