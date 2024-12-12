export const addCar = async (carData) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL_API}/cars`, // Replace with your backend API URL
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(carData),
      }
    );

    // Check if response is ok
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add car');
    }

    // Parse the response
    const data = await response.json();

    // Return the response data if successful
    return data;
  } catch (error) {
    console.error('Error occurred:', error);
    throw new Error(error.message || 'An error occurred while adding the car');
  }
};
