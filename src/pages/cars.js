import React, { useState } from 'react';
import { Upload, Button, message, Select, Image, Row, Col } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import '../../styles/cars.css';
import { addCar, uploadImage } from '../../api/cars'; // Assume addCar handles sending the form data

const { Dragger } = Upload; // Using the Drag and Drop upload component

const AddCarPage = () => {
  const [formData, setFormData] = useState({
    carModel: '',
    price: '',
    phone: '',
    city: '',
    numOfCopy: '',
    carImages: [], // Storing multiple image URLs
  });
  const [error, setError] = useState('');
  const [messageState, setMessageState] = useState('');
  const [imageUrls, setImageUrls] = useState([]); // Storing image preview URLs
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]); // Store the file list
  const handleFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);

    const previewUrls = newFileList.map((file) =>
      URL.createObjectURL(file.originFileObj)
    );
    setImageUrls(previewUrls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessageState('');

    if (
      !formData.carModel ||
      !formData.price ||
      !formData.phone ||
      !formData.city ||
      !formData.numOfCopy
    ) {
      setError('All fields are required, excluding the car images.');
      return;
    }

    if (fileList.length === 0) {
      setError('Please upload at least one image.');
      return;
    }

    setLoading(true);

    try {
      const uploadedImageUrls = await Promise.all(
        fileList.map((file) => uploadImage(file.originFileObj)) // Assuming uploadImage accepts a file and returns a URL
      );
      const finalFormData = {
        ...formData,
        carImages: uploadedImageUrls,
      };
      const result = await addCar(finalFormData);
      if (result.success) {
        setMessageState('Car added successfully!');
        setFormData({
          carModel: '',
          price: '',
          phone: '',
          city: '',
          numOfCopy: '',
          carImages: [],
        });
        setFileList([]);
        setImageUrls([]);
      }
    } catch (error) {
      setError(error.message || 'An error occurred while adding the car');
    } finally {
      setLoading(false);
      setFileList([]);
      setImageUrls([]);
      setFormData({
        carModel: '',
        price: '',
        phone: '',
        city: '',
        numOfCopy: '',
        carImages: [],
      });
    }
  };

  return (
    <div className="add-car-page">
      <h1>Add a New Car</h1>
      {error && <p className="error">{error}</p>}
      {messageState && <p className="success">{messageState}</p>}
      <form onSubmit={handleSubmit}>
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
              <Select.Option key={num} value={num + 1}>
                {num + 1}
              </Select.Option>
            ))}
          </Select>
        </div>
        <div className="form-group">
          <label htmlFor="carImages">Car Images</label>
          <Dragger
            accept="image/*"
            multiple={true}
            fileList={fileList}
            showUploadList={false}
            onChange={handleFileChange}
            beforeUpload={() => false} // Prevent default upload action
          >
            <div className="upload-box">
              <p className="upload-text">
                Drag and drop images here, or click to select files
              </p>
            </div>
          </Dragger>
          <Row gutter={16} className="preview-images">
            {imageUrls.map((url, index) => (
              <Col key={index} span={8}>
                <Image src={url} alt={`car-image-${index}`} />
              </Col>
            ))}
          </Row>
        </div>
        <button type="submit" htmlType="submit" loading={loading}>
          Add Car
        </button>
      </form>
    </div>
  );
};

export default AddCarPage;
