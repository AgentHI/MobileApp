import {Constants} from '../constants/Constants';

export const CreateAppointment = async (appointmentObj: any, token: string) => {
  const headers = {
    accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }; 

  try {
    const response = await fetch(Constants.AppointmentBaseUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(appointmentObj),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    // console.log('Appointment created successfully:', data);

    return data;
  } catch (error) {    
    console.error('Error creating appointment:', error);
  }
};

export const FetchAppointments = async (
  twinId: string,
  bearerToken: string,
) => {
  console.log('FetchAppointments_params ', twinId, bearerToken);
  const today = new Date().toISOString().split('T')[0];
  console.log("today", today);
  
  
  const url = `http://api.test.agenthi.ai:3000/api/appointments?twin_id=${twinId}&start_time%5Bgte%5D=${today}`;
  
  // console.log(`
  //   curl -X GET "${url}" \\
  //   -H "Accept: application/json" \\
  //   -H "Authorization: Bearer ${bearerToken}"
  // `);
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${bearerToken}`,
    },
  });
  
  if (!response.ok) {
    throw new Error(
      `FetchAppointmentsError: ${response.status} - ${response.statusText}`,
    );
  }
  
  const data = await response.json();
  return data;
};

export const UpdateAppointment = async (
  _id: string,
  payload_: any,
  token_: string,
) => {  
  
  console.log(JSON.stringify(payload_), _id, 'DATAAAAAAAAAAAAAAAAAA');
  const url = `http://api.test.agenthi.ai:3000/api/appointments/${_id}`;
  
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${token_}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload_),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response?.status}`);
    }
    
    const result = await response.json();
    // console.log('Appointment updated successfully:', result);
    
    return result;
  } catch (error) {    
    console.error('Error updating appointment:', error);
  }
};

export const DeleteAppointment = async (
  appointmentId: string,
  token_: string,
) => {
  const url = `http://api.test.agenthi.ai:3000/api/appointments/${appointmentId}`;
  const headers = {
    accept: '*/*',
    Authorization: `Bearer ${token_}`,
  };
  
  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: headers,
    });
    
    if (!response.ok) {
      throw new Error(
        `Failed to delete appointment. Status: ${response.status}`,
      );
    }

    // console.log('Appointment deleted successfully');
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const FetchAppointmentSlots = async (
  twinId: string,
  token_: string,
) => {
  const url = `http://api.test.agenthi.ai:3000/api/appointments/available-slots/${twinId}`;
  console.log(twinId, token_, url);
  
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
        `Failed to fetch appointment slots. Status: ${response.status}`,
      );
    }
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const ShareAppointment = async (appointmentId: any, token: string) => {
  const headers = {
    accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }; 
  
  try {
    const response = await fetch(`${Constants.AppointmentBaseUrl}/${appointmentId}/sharelink`, {
      method: 'POST',
      headers: headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {    
    console.error('Error sharing appointment:', error);
  }
};