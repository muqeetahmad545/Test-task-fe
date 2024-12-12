export const loginUser = async (email, password) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL_API}/user`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      }
    );

    if (!response.ok) {
      throw new Error('Invalid credentials');
    }

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(error.message || 'An error occurred during login');
  }
};
