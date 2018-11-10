import axios from 'axios';

const API_URL =
  'https://api.data.go.th/search_virtuoso/api/dataset/query?&dsname=vir_501_1497234362&path=vir_501_1497234362';

const getSchools = async (pageSize, pageNo) => {
  const res = await axios.get(
    `${API_URL}&loadAll=0&pageNo=${pageNo}&pageSize=${pageSize}`
  );
  return res.data;
};

export const findSchoolWithDistrict = async (district, pageSize, pageNo) => {
  const res = await axios.get(
    `${API_URL}&property=col_4&operator=CONTAINS&valueLiteral=${district}&loadAll=0&pageNo=${pageNo}&pageSize=${pageSize}`
  );
  return res.data;
};

export const findSchoolWithOption = async (colNo, value, pageSize, pageNo) => {
  const property = colNo === 0 ? 'id' : 'col_' + colNo;
  const URL = `${API_URL}&property=${property}&operator=CONTAINS&valueLiteral=${value}&loadAll=0&pageNo=${pageNo}&pageSize=${pageSize}`;
  const res = await axios.get(URL);
  return res.data;
};

export default getSchools;
