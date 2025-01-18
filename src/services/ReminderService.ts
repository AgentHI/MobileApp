import {Constants} from '../constants/Constants';

export const CreateReminder = async (reminderObj: any, token: string) => {
  const headers = {
    accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  try {
    const response = await fetch(Constants.ReminderBaseUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(reminderObj),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Reminder created successfully:', data);

    return data;
  } catch (error) {
    console.error('CreateReminderError:', error);
  }
};

export const FetchReminders = async (twinId: string, token: string) => {
  try {
    const response = await fetch(
      `${Constants.ReminderBaseUrl}?twin_id=${twinId}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);

    return data
  } catch (error) {
    console.error('FetchRemindersError:', error);
  }
};

export const DeleteReminder = async (clientId:string, token:string) => {
  const url = `http://api.test.agenthi.ai:3000/api/reminders/${clientId}`;

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    console.log('Client deleted successfully',response);
    return response;
  } catch (error) {
    console.error('Error deleting client:', error);
    return false;
  }
};