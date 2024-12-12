'use client';

import React, { useState } from 'react';
import { Upload, Button, message, Select, Avatar, Spin } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import '../../styles/cars.css';
import { addCar } from '../../api/cars';

const AddCarPage = () => {
  const [formData, setFormData] = useState({
    carModel: '',
    price: '',
    phone: '',
    city: '',
    numOfCopy: '',
    carImage: '',
  });
  const [error, setError] = useState('');
  const [messageState, setMessageState] = useState('');
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null); // Store image URL for preview
  const [loading, setLoading] = useState(false);

  const handleImageChange = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
    } else if (info.file.status === 'done') {
      setFile(info.file.originFileObj); // Store the selected file temporarily
      setLoading(false);
      message.success(`${info.file.name} file selected successfully`);
    } else if (info.file.status === 'error') {
      setLoading(false);
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  // Image preview function
  const handlePreview = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result); // Set the local image preview
    };
    reader.readAsDataURL(file); // Read file as base64 URL
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessageState('');

    // Validation for missing fields (image is now optional)
    if (
      !formData.carModel ||
      !formData.price ||
      !formData.phone ||
      !formData.city ||
      !formData.numOfCopy
    ) {
      setError('All fields are required, excluding the car image.');
      return;
    }

    try {
      // If there's a file, include it
      let uploadedImageUrl = imageUrl;

      // Add the car data with the image URL
      const formDataWithImage = { ...formData, carImage: uploadedImageUrl };

      // Send car data to the backend via addCar
      const result = await addCar(formDataWithImage);

      setMessageState('Car added successfully!');
      setFormData({
        carModel: '',
        price: '',
        phone: '',
        city: '',
        numOfCopy: '',
        carImage: '',
      });
      setFile(null); // Clear the file after submission
      setImageUrl(null); // Clear the image URL after submission
    } catch (error) {
      setError(error.message || 'An error occurred while adding the car');
    }
  };

  return (
    <div className="add-car-page">
      <h1>Add a New Car</h1>

      {/* Display success or error messages */}
      {error && <p className="error">{error}</p>}
      {messageState && <p className="success">{messageState}</p>}

      <form onSubmit={handleSubmit}>
        {/* Car Model */}
        <div className="form-group">
          <label htmlFor="carModel">Car Model</label>
          <input
            type="text"
            id="carModel"
            value={formData.carModel}
            onChange={(e) =>
              setFormData({ ...formData, carModel: e.target.value })
            }
            placeholder="Enter car model"
            required
          />
        </div>

        {/* Price */}
        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input
            type="number"
            id="price"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            placeholder="Enter car price"
            required
          />
        </div>

        {/* Phone */}
        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input
            type="number"
            id="phone"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            placeholder="Enter contact phone"
            required
          />
        </div>

        {/* City */}
        <div className="form-group">
          <label htmlFor="city">City</label>
          <Select
            id="city"
            value={formData.city}
            onChange={(value) => setFormData({ ...formData, city: value })}
            required
            placeholder="Select a city"
          >
            <Select.Option value="Lahore">Lahore</Select.Option>
            <Select.Option value="Karachi">Karachi</Select.Option>
          </Select>
        </div>

        {/* Number of Copies */}
        <div className="form-group">
          <label htmlFor="numOfCopy">Number of Copies</label>
          <Select
            id="numOfCopy"
            value={formData.numOfCopy}
            onChange={(value) => setFormData({ ...formData, numOfCopy: value })}
            required
            placeholder="Select number of copies"
          >
            {[...Array(10).keys()].map((num) => (
              <Select.Option key={num} value={String(num + 1)}>
                {num + 1}
              </Select.Option>
            ))}
          </Select>
        </div>

        {/* Car Image Upload */}
        <div className="profileImage">
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar
              src={imageUrl}
              alt="Car Image"
              style={{
                width: 140,
                height: 140,
                marginTop: 10,
                marginBottom: 10,
              }}
            />
            <Upload
              name="file"
              accept="image/*"
              showUploadList={false}
              beforeUpload={(file) => {
                handlePreview(file); // Preview image without uploading
                return false; // Prevent automatic upload
              }}
            >
              <Spin spinning={loading} size="large">
                <Button
                  icon={<UploadOutlined />}
                  type="primary"
                  className="w-full"
                  style={{ display: loading ? 'none' : 'block' }}
                >
                  Upload Car Image (Optional)
                </Button>
              </Spin>
            </Upload>
          </div>
        </div>

        {/* Submit */}
        <button type="submit">Add Car</button>
      </form>
    </div>
  );
};

export default AddCarPage;
