import React, { useEffect, useState } from "react";

import "./Address.css";

import axiosDriver from "../../config/axios";
import { useNavigate } from "react-router-dom";

const Address = () => {
  const [getAddressList, setGetAddressList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [nama, setNama] = useState("");
  const [kelurahan, setKelurahan] = useState("");
  const [kecamatan, setKecamatan] = useState("");
  const [kabupaten, setKabupaten] = useState("");
  const [provinsi, setProvinsi] = useState("");
  const [detail, setDetail] = useState("");
  const [editAddress, setEditAddress] = useState(null);

  const navigate = useNavigate();

  const fetchData = async () => {
    const response = await axiosDriver.get(
      "http://localhost:3000/api/delivery-addresses"
    );
    console.log(response);
    if (response.data.error !== 1) {
      setGetAddressList(response.data.data);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (editAddress) {
      setNama(editAddress.nama);
      setKelurahan(editAddress.kelurahan);
      setKecamatan(editAddress.kecamatan);
      setKabupaten(editAddress.kabupaten);
      setProvinsi(editAddress.provinsi);
      setDetail(editAddress.detail);
    } else {
      setNama("");
      setKelurahan("");
      setKecamatan("");
      setKabupaten("");
      setProvinsi("");
      setDetail("");
    }
  }, [editAddress]);

  const handleAddAddress = () => {
    setEditAddress(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (editAddress) {
      setEditAddress((prevAddress) => ({
        ...prevAddress,
        [name]: value,
      }));
    } else {
      switch (name) {
        case "nama":
          setNama(value);
          break;
        case "kelurahan":
          setKelurahan(value);
          break;
        case "kecamatan":
          setKecamatan(value);
          break;
        case "kabupaten":
          setKabupaten(value);
          break;
        case "provinsi":
          setProvinsi(value);
          break;
        case "detail":
          setDetail(value);
          break;
        default:
          break;
      }
    }
  };

  const handleAddNewAddress = async () => {
    const addressData = {
      nama,
      kelurahan,
      kecamatan,
      kabupaten,
      provinsi,
      detail,
    };

    if (editAddress) {
      const response = await axiosDriver.put(
        `http://localhost:3000/api/delivery-addresses/${editAddress._id}`,
        addressData
      );

      if (response.data.error !== 1) {
        const updatedList = getAddressList.map((address) =>
          address._id === editAddress._id ? response.data : address
        );

        setGetAddressList(updatedList);
        setEditAddress(response.data);
        setShowModal(false);
      }
    } else {
      const response = await axiosDriver.post(
        "http://localhost:3000/api/delivery-addresses",
        addressData
      );

      if (response.data.error !== 1) {
        setGetAddressList([response.data, ...getAddressList]);
        navigate("/address");
        setShowModal(false);
      }
    }
  };

  const handleDelete = async (addressId) => {
    try {
      await axiosDriver.delete(
        `http://localhost:3000/api/delivery-addresses/${addressId}`
      );
      setGetAddressList(
        getAddressList.filter((address) => address._id !== addressId)
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (address) => {
    setEditAddress(address);
    setShowModal(true);
  };

  return (
    <div className="address">
      <div className="shop-title">
        <button onClick={handleAddAddress}>Add Address</button>
      </div>
      <div className="addresss">
        <table className="table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Nama</th>
              <th>Alamat</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {getAddressList?.map((address, index) => (
              <tr key={address?._id}>
                <td>{index + 1}</td>
                <td>{address?.nama}</td>
                <td>
                  {address?.kelurahan}, {address?.kecamatan},
                  {address?.kabupaten}, {address?.provinsi},
                  <br />
                  note: {address?.detail}
                </td>
                <td>
                  <div className="button">
                    <button
                      className="edit-button"
                      onClick={() => handleEdit(address)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(address._id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-content">
              <h2>{editAddress ? "Edit Address" : "Add New Address"}</h2>
              <label htmlFor="nama">Nama:</label>
              <input
                type="text"
                name="nama"
                value={editAddress ? editAddress.nama : nama}
                onChange={handleInputChange}
              />
              <label htmlFor="kelurahan">Kelurahan:</label>
              <input
                type="text"
                name="kelurahan"
                value={editAddress ? editAddress.kelurahan : kelurahan}
                onChange={handleInputChange}
              />
              <label htmlFor="kecamatan">Kecamatan:</label>
              <input
                type="text"
                name="kecamatan"
                value={editAddress ? editAddress.kecamatan : kecamatan}
                onChange={handleInputChange}
              />
              <label htmlFor="kabupaten">Kabupaten:</label>
              <input
                type="text"
                name="kabupaten"
                value={editAddress ? editAddress.kabupaten : kabupaten}
                onChange={handleInputChange}
              />
              <label htmlFor="provinsi">Provinsi:</label>
              <input
                type="text"
                name="provinsi"
                value={editAddress ? editAddress.provinsi : provinsi}
                onChange={handleInputChange}
              />
              <label htmlFor="detail">Detail:</label>
              <input
                type="text"
                name="detail"
                value={editAddress ? editAddress.detail : detail}
                onChange={handleInputChange}
              />
              <div className="modal-buttons">
                <button onClick={handleCloseModal}>Cancel</button>
                <button onClick={handleAddNewAddress}>
                  {editAddress ? "Save" : "Add Address"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Address;
