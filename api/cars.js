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
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add car');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error occurred:', error);
    throw new Error(error.message || 'An error occurred while adding the car');
  }
};

export const uploadImage = async (imageFile) => {
  const formData = new FormData();
  formData.append('file', imageFile); // Ensure this matches the backend
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL_API}/img`,
      {
        method: 'POST',
        body: formData,
      }
    );
    if (!response.ok) throw new Error('Image upload failed');
    const data = await response.json();
    return data.carImage; // Assuming the backend returns the uploaded image URL in `imageUrl`
  } catch (error) {
    console.error('Image upload failed:', error);
    message.error('Failed to upload image. Please try again.');
    return null;
  }
};
